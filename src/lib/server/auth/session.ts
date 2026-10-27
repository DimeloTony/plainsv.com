import { randomBytes, createHash } from "crypto";
import { dev } from "$app/env";
import { authDb } from "./db.js";
import type { AuthSession, AuthUser } from "./types.js";
import type { RequestEvent } from "@sveltejs/kit";
const DAY = 1000 * 60 * 60 * 24;

/** Sets a cookie; `expires` wins over `maxAge`, and the default lifetime is 10 minutes */
export function setCookie(event: RequestEvent, name: string, value: string, options?: { maxAge?: number; expires?: Date }) {
	event.cookies.set(name, value, {
		path: "/",
		// Hide auth cookies from page scripts, and send them only over HTTPS outside the dev server.
		httpOnly: true,
		secure: !dev,
		maxAge: options?.maxAge !== undefined ? options.maxAge : options?.expires !== undefined ? undefined : 60 * 10,
		expires: options?.expires,
		sameSite: "lax",
	});
}

/** Creates a random URL-safe token, used for the OAuth state, the PKCE verifier, and session tokens */
export function generateToken() {
	return randomBytes(32).toString("base64url");
}

/** Creates a 30-day session for the user and sets its token as the `session` cookie */
export async function createAndSetSession(event: RequestEvent, userId: string) {
	const token = generateToken();
	// Store only the hash, so a leaked database cannot be used to sign in.
	const session: AuthSession = { id: hashToken(token), userId, expiresAt: new Date(Date.now() + DAY * 30) };
	await authDb.createSession(session);
	setCookie(event, "session", token, { expires: session.expiresAt });
	return session;
}

/** Returns the session and user for a `session` cookie token, refreshing sessions that expire within 15 days */
export async function validateSessionToken(event: RequestEvent, token: string): Promise<SessionValidationResult> {
	const sessionId = hashToken(token);
	const session = await authDb.findSession(sessionId);
	// If no session matches the token: treat the user as signed out.
	if (!session) return { session: null, user: null };

	const now = Date.now();
	// If the session expired: delete it and the cookie.
	if (now >= session.expiresAt.getTime()) {
		await authDb.deleteSession(sessionId);
		event.cookies.delete("session", { path: "/" });
		return { session: null, user: null };
	}

	// If the session expires within 15 days: push the expiry 30 days from now.
	if (now >= session.expiresAt.getTime() - DAY * 15) {
		session.expiresAt = new Date(now + DAY * 30);
		await authDb.updateSessionExpiry(sessionId, session.expiresAt);
	}

	const user = await authDb.findUser(session.userId);
	// If the user was deleted: drop the orphaned session.
	if (!user) {
		await authDb.deleteSession(sessionId);
		event.cookies.delete("session", { path: "/" });
		return { session: null, user: null };
	}
	return { session, user };
}

/** Deletes the signed-in user's session and its cookie */
export async function deleteSession(event: RequestEvent) {
	// If no one is signed in: skip the database call.
	if (!event.locals.sessionData) return;
	await authDb.deleteSession(event.locals.sessionData.id);
	event.cookies.delete("session", { path: "/" });
}

/** Hashes a session token into the id stored in the database */
function hashToken(token: string) {
	return createHash("sha256").update(token).digest("hex");
}

/** Session and user for a valid token, or both `null` */
export type SessionValidationResult = { session: AuthSession; user: AuthUser } | { session: null; user: null };
