import { error, redirect } from "@sveltejs/kit";
import { vercelAuth } from "#lib/server/auth/vercel.js";
import { db } from "#lib/server/mongodb/index.js";
import type { AuthUserProfile } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Finishes Vercel sign in, then creates or updates the user and starts a session */
export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("vercel_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("vercel_code_verifier") ?? null;
	const callbackURL = event.cookies.get("oauth_callback_url") ?? null;
	// If the code, state, or verifier is missing, or the state does not match the cookie: stop.
	if (!code || !state || !storedState || !codeVerifier || state !== storedState) error(400, "Something went wrong creating account.");

	let profile: AuthUserProfile;
	try {
		const tokens = await vercelAuth.validateAuthorizationCode(code, codeVerifier, `${process.env.DOMAIN_URL}/api/auth/vercel/callback`);
		profile = await vercelAuth.getUser(tokens);
	} catch (err) {
		// If Vercel rejected the code or the email is not verified: stop.
		error(400, err instanceof Error ? err.message : "Something went wrong while authenticating you.");
	}

	// Find the user by email, or create one.
	const { email, image } = profile;
	let user = await db.findUser({ email });
	if (!user) {
		user = await db.createUser({ email, image, createdAt: new Date(), updatedAt: new Date() });
	}
	// Else: refresh the avatar from Vercel.
	else {
		await db.updateUserById(user._id, { $set: { image, updatedAt: new Date() } });
	}

	// Create the session and save its token to the `session` cookie.
	const sessionToken = vercelAuth.generateSessionToken();
	const session = await vercelAuth.createSession(sessionToken, user._id);
	vercelAuth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	// Clean up the temporary cookies.
	event.cookies.delete("vercel_oauth_state", { path: "/" });
	event.cookies.delete("vercel_code_verifier", { path: "/" });
	event.cookies.delete("oauth_callback_url", { path: "/" });

	return redirect(302, callbackURL || "/");
};
