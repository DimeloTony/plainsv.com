import { redirect } from "@sveltejs/kit";
import { authProvider } from "#lib/server/auth/provider.js";
import { generateToken, setCookie } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Redirects to the Google sign in page */
export const GET: RequestHandler = async (event) => {
	const callbackURL = event.url.searchParams.get("callbackURL");
	// If the user is already signed in: go home.
	if (event.locals.userData) redirect(302, "/");

	const state = generateToken();
	const codeVerifier = generateToken();
	const authorizationURL = authProvider.createAuthorizationURL(state, codeVerifier);
	// Save the state and PKCE verifier to check on the callback.
	setCookie(event, "google_oauth_state", state);
	setCookie(event, "google_code_verifier", codeVerifier);
	// If a callbackURL was given: save it to redirect there after the callback.
	if (callbackURL) setCookie(event, "oauth_callback_url", callbackURL);

	return redirect(302, authorizationURL.toString(), { external: true });
};
