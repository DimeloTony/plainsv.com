import { redirect } from "@sveltejs/kit";
import { githubAuth } from "#lib/server/auth/github.js";
import type { RequestHandler } from "./$types";

/** Redirects to the GitHub sign in page */
export const GET: RequestHandler = async (event) => {
	const callbackURL = event.url.searchParams.get("callbackURL");
	// If the user is already signed in: go home.
	if (event.locals.userData) redirect(302, "/");

	const state = githubAuth.generateSessionToken();
	const authorizationURL = githubAuth.createAuthorizationURL(state, ["read:user", "user:email"], `${process.env.DOMAIN_URL}/api/auth/github/callback`);
	// Save the state to check on the callback, for 10 minutes.
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	githubAuth.setCookie(event, "github_oauth_state", state, expiresAt);
	// If a callbackURL was given: save it to redirect there after the callback.
	if (callbackURL) githubAuth.setCookie(event, "oauth_callback_url", callbackURL, expiresAt);

	return redirect(302, authorizationURL.toString(), { external: true });
};
