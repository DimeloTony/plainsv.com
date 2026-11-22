import { redirect } from "@sveltejs/kit";
import { vercelAuth } from "#lib/server/auth/vercel.js";
import type { RequestHandler } from "./$types";

/** Redirects to the Vercel sign in page */
export const GET: RequestHandler = async (event) => {
	const callbackURL = event.url.searchParams.get("callbackURL");
	// If the user is already signed in: go home.
	if (event.locals.userData) redirect(302, "/");

	const state = vercelAuth.generateSessionToken();
	const codeVerifier = vercelAuth.generateSessionToken();
	const authorizationURL = vercelAuth.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"], `${process.env.DOMAIN_URL}/api/auth/vercel/callback`);
	// Save the state and PKCE verifier to check on the callback, for 10 minutes.
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	vercelAuth.setCookie(event, "vercel_oauth_state", state, expiresAt);
	vercelAuth.setCookie(event, "vercel_code_verifier", codeVerifier, expiresAt);
	// If a callbackURL was given: save it to redirect there after the callback.
	if (callbackURL) vercelAuth.setCookie(event, "oauth_callback_url", callbackURL, expiresAt);

	return redirect(302, authorizationURL.toString(), { external: true });
};
