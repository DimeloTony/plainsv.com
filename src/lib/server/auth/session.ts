import { randomBytes, createHash } from "crypto";
import { dev } from "$app/env";
import { db } from "#lib/server/mongodb/index.js";
import type { DbCollectionsSchema } from "#lib/server/mongodb/schema.js";
import type { RequestEvent } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit/hooks";
const DAY = 1000 * 60 * 60 * 24;

/** Shared session methods that every provider class extends, such as `GithubAuth` */
export class AuthSession {
	/** How long a new session lasts, in milliseconds */
	expiresIn: number;
	/** Refresh the session when it expires within this time, in milliseconds */
	refreshWithin: number;

	constructor(options?: SessionOptions) {
		this.expiresIn = options?.expiresIn ?? DAY * 30;
		this.refreshWithin = options?.refreshWithin ?? DAY * 15;
	}

	/** Load the session and user from the `session` cookie into `locals`; run it before the main handle with `sequence` in `hooks.server.ts` */
	hook: Handle = async ({ event, resolve }) => {
		const token = event.cookies.get("session");
		// if there is no session cookie, treat the user as logged out
		if (!token) {
			event.locals.userData = null;
			event.locals.sessionData = null;
			return await resolve(event);
		}
		const { session, user } = await this.validateSessionToken(event, token);
		event.locals.userData = user;
		event.locals.sessionData = session;
		return await resolve(event);
	};

	/** Create session token */
	generateSessionToken(): string {
		const bytes = randomBytes(32);
		const token = bytes.toString("base64url");
		return token;
	}

	/** Create session */
	async createSession(token: string, userID: string): Promise<DbCollectionsSchema["session"]> {
		// store only the hash, so a leaked database cannot be used to sign in
		const sessionId = this.hashToken(token);
		const expiresAt = new Date(Date.now() + this.expiresIn);
		const session: DbCollectionsSchema["session"] = { _id: sessionId, byUserID: userID, expiresAt };
		// insert new session to db collection
		await db.createSession(session);
		// return session
		return session;
	}

	/** Set a cookie that page scripts cannot read and that expires at `expiresAt` */
	setCookie(event: RequestEvent, name: string, value: string, expiresAt: Date): void {
		// send it only over HTTPS outside the dev server
		event.cookies.set(name, value, { httpOnly: true, secure: !dev, sameSite: "lax", expires: expiresAt, path: "/" });
	}

	/** Set session to cookies */
	setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
		this.setCookie(event, "session", token, expiresAt);
	}

	/** Delete session token from cookies */
	deleteSessionTokenCookie(event: RequestEvent): void {
		event.cookies.set("session", "", {
			httpOnly: true,
			sameSite: "lax",
			maxAge: 0,
			path: "/",
		});
	}

	/** Validate user session, refreshing it when it expires within `refreshWithin` */
	async validateSessionToken(event: RequestEvent, token: string): Promise<SessionValidationResult> {
		const sessionId = this.hashToken(token);
		const sessionData = await db.findSessionById(sessionId);
		// if no session data was found, return null session and user
		if (!sessionData) return { session: null, user: null };
		// if session expired, delete it from the session collection and cookies and return null session and user
		if (Date.now() >= sessionData.expiresAt.getTime()) {
			await db.deleteSessionById(sessionId);
			this.deleteSessionTokenCookie(event);
			return { session: null, user: null };
		}
		// refresh session
		if (Date.now() >= sessionData.expiresAt.getTime() - this.refreshWithin) {
			// update expired at date from session
			sessionData.expiresAt = new Date(Date.now() + this.expiresIn);
			// update it on db collection
			await db.updateSessionById(sessionId, { $set: { expiresAt: sessionData.expiresAt } });
			// update the cookie too, otherwise the browser drops it on the old date
			this.setSessionTokenCookie(event, token, sessionData.expiresAt);
		}
		// finally, return session data and user
		const user = await db.findUserById(sessionData.byUserID);
		// if the user was deleted, delete the orphaned session and treat them as logged out
		if (!user) {
			await db.deleteSessionById(sessionId);
			this.deleteSessionTokenCookie(event);
			return { session: null, user: null };
		}
		return { session: sessionData, user };
	}

	/** Delete session from database */
	async invalidateSession(sessionId: string): Promise<void> {
		await db.deleteSessionById(sessionId);
	}

	/** Hash a session token into the id stored in the database */
	protected hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex");
	}

	/** Hash the code verifier into the PKCE S256 code challenge */
	protected createCodeChallenge(codeVerifier: string): string {
		return createHash("sha256").update(codeVerifier).digest("base64url");
	}
}

/** Session methods without a provider, for code every provider shares, such as the sign out route */
export const auth = new AuthSession();

/** Session settings, in milliseconds */
export interface SessionOptions {
	/** How long a new session lasts, 30 days by default */
	expiresIn?: number;
	/** Refresh the session when it expires within this time, 15 days by default */
	refreshWithin?: number;
}

/** Verified profile every provider's `getUser` returns, so callbacks treat all providers the same */
export interface AuthUserProfile {
	/** User id at the provider */
	id: string;
	/** Verified email, used to find the user in the database */
	email: string;
	/** Avatar URL, or an empty string when the provider has none */
	image: string;
}

/** Session and user for a valid token, or both `null` */
export type SessionValidationResult = { session: DbCollectionsSchema["session"]; user: DbCollectionsSchema["user"] } | { session: null; user: null };
