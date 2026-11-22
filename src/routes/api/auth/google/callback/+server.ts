import { error, redirect } from "@sveltejs/kit";
import { googleAuth } from "#lib/server/auth/google.js";
import { db } from "#lib/server/mongodb/index.js";
import type { AuthUserProfile } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Finishes Google sign in, then creates or updates the user and starts a session */
export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
	const callbackURL = event.cookies.get("oauth_callback_url") ?? null;
	// If the code, state, or verifier is missing, or the state does not match the cookie: stop.
	if (!code || !state || !storedState || !codeVerifier || state !== storedState) error(400, "Something went wrong creating account.");

	let profile: AuthUserProfile;
	try {
		const tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier, `${process.env.DOMAIN_URL}/api/auth/google/callback`);
		profile = await googleAuth.getUser(tokens);
	} catch (err) {
		// If Google rejected the code or the email is not verified: stop.
		error(400, err instanceof Error ? err.message : "Something went wrong while authenticating you.");
	}

	// Find the user by email, or create one.
	const { email, image } = profile;
	let user = await db.findUser({ email });
	if (!user) {
		user = await db.createUser({ email, image, createdAt: new Date(), updatedAt: new Date() });
	}
	// Else: refresh the avatar from Google.
	else {
		await db.updateUserById(user._id, { $set: { image, updatedAt: new Date() } });
	}

	// Create the session and save its token to the `session` cookie.
	const sessionToken = googleAuth.generateSessionToken();
	const session = await googleAuth.createSession(sessionToken, user._id);
	googleAuth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	// Clean up the temporary cookies.
	event.cookies.delete("google_oauth_state", { path: "/" });
	event.cookies.delete("google_code_verifier", { path: "/" });
	event.cookies.delete("oauth_callback_url", { path: "/" });

	return redirect(302, callbackURL || "/");
};
