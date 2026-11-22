import { githubAuth } from "#lib/server/auth/github.js";
import type { PageServerLoad } from "./$types";

/** Loads the signed-in user and session from the `session` cookie, without the hook */
export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get("session");
	// If there is no session cookie: no one is signed in.
	if (!token) return { userData: null, sessionData: null };

	const { session, user } = await githubAuth.validateSessionToken(event, token);
	return { userData: user, sessionData: session };
};
