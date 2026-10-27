import { error, redirect } from "@sveltejs/kit";
import { authDb } from "#lib/server/auth/db.js";
import { authProvider } from "#lib/server/auth/provider.js";
import { createAndSetSession } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Finishes Google sign in, then creates or updates the user and starts a session */
export const GET: RequestHandler = async (event) => {
	const oauthState = event.url.searchParams.get("state");
	const oauthCode = event.url.searchParams.get("code");
	const cookieState = event.cookies.get("google_oauth_state") ?? null;
	const cookieCodeVerifier = event.cookies.get("google_code_verifier") ?? null;
	const callbackURL = event.cookies.get("oauth_callback_url") ?? null;

	// If the code, state, or verifier is missing, or the state does not match the cookie: stop.
	if (!oauthState || !oauthCode || !cookieState || !cookieCodeVerifier || oauthState !== cookieState) {
		throw error(404, "Something went wrong creating account.");
	}

	const validator = await authProvider.validateAuthorizationCode(oauthCode, cookieCodeVerifier);
	// If Google rejected the code: stop.
	if (validator.error) throw error(501, "Something went wrong while authenticating you.");

	const user = await authDb.upsertUser(validator.data.user);
	await createAndSetSession(event, user.id);

	// Clean up the temporary cookies.
	event.cookies.delete("google_oauth_state", { path: "/" });
	event.cookies.delete("google_code_verifier", { path: "/" });
	event.cookies.delete("oauth_callback_url", { path: "/" });

	return redirect(301, callbackURL || "/");
};
