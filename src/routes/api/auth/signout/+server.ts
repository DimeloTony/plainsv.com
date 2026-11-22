import { redirect } from "@sveltejs/kit";
import { auth } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Signs the user out and goes home */
export const GET: RequestHandler = async (event) => {
	const callbackURL = event.url.searchParams.get("callbackURL");
	// Read the cookie here instead of `locals`, so sign out works without the hook.
	const token = event.cookies.get("session");
	// If there is a session cookie: delete its session from the database and the cookie.
	if (token) {
		const { session } = await auth.validateSessionToken(event, token);
		if (session) await auth.invalidateSession(session._id);
		auth.deleteSessionTokenCookie(event);
	}
	// If a callbackURL on this site was given: go back there, otherwise go home.
	return redirect(302, callbackURL && callbackURL.startsWith("/") && !callbackURL.startsWith("//") ? callbackURL : "/");
};
