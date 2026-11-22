import { redirect } from "@sveltejs/kit";
import { googleAuth } from "#lib/server/auth/google.js";
import type { RequestHandler } from "./$types";

/** Redirects to the Google sign in page */
export const GET: RequestHandler = async (event) => {
	const callbackURL = event.url.searchParams.get("callbackURL");
	// If the user is already signed in: go home.
	if (event.locals.userData) redirect(302, "/");

	const state = googleAuth.generateSessionToken();
	const codeVerifier = googleAuth.generateSessionToken();
	const authorizationURL = googleAuth.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"], `${process.env.DOMAIN_URL}/api/auth/google/callback`);
	// Save the state and PKCE verifier to check on the callback, for 10 minutes.
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	googleAuth.setCookie(event, "google_oauth_state", state, expiresAt);
	googleAuth.setCookie(event, "google_code_verifier", codeVerifier, expiresAt);
	// If a callbackURL was given: save it to redirect there after the callback.
	if (callbackURL) googleAuth.setCookie(event, "oauth_callback_url", callbackURL, expiresAt);

	return redirect(302, authorizationURL.toString(), { external: true });
};
