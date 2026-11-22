import { error, redirect } from "@sveltejs/kit";
import { githubAuth } from "#lib/server/auth/github.js";
import { db } from "#lib/server/mongodb/index.js";
import type { AuthUserProfile } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Finishes GitHub sign in, then creates or updates the user and starts a session */
export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;
	const callbackURL = event.cookies.get("oauth_callback_url") ?? null;
	// If the code or state is missing, or the state does not match the cookie: stop.
	if (!code || !state || !storedState || state !== storedState) error(400, "Something went wrong creating account.");

	let profile: AuthUserProfile;
	try {
		const tokens = await githubAuth.validateAuthorizationCode(code);
		profile = await githubAuth.getUser(tokens);
	} catch (err) {
		// If GitHub rejected the code or the email is not verified: stop.
		error(400, err instanceof Error ? err.message : "Something went wrong while authenticating you.");
	}

	// Find the user by email, or create one.
	const { email, image } = profile;
	let user = await db.findUser({ email });
	if (!user) {
		user = await db.createUser({ email, image, createdAt: new Date(), updatedAt: new Date() });
	}
	// Else: refresh the avatar from GitHub.
	else {
		await db.updateUserById(user._id, { $set: { image, updatedAt: new Date() } });
	}

	// Create the session and save its token to the `session` cookie.
	const sessionToken = githubAuth.generateSessionToken();
	const session = await githubAuth.createSession(sessionToken, user._id);
	githubAuth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	// Clean up the temporary cookies.
	event.cookies.delete("github_oauth_state", { path: "/" });
	event.cookies.delete("oauth_callback_url", { path: "/" });

	return redirect(302, callbackURL || "/");
};
