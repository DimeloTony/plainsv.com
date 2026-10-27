import { validateSessionToken } from "./session.js";
import type { Handle } from "@sveltejs/kit/hooks";

/** Loads the signed-in user into `locals` and adds the `dark` class to `<body>` on the server */
export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("session");
	// If there is a session cookie: load its session and user.
	if (token) {
		const { session, user } = await validateSessionToken(event, token);
		event.locals.userData = user;
		event.locals.sessionData = session;
	} else {
		event.locals.userData = null;
		event.locals.sessionData = null;
	}

	// If it is a page request: add the `dark` class to <body> from the theme cookie.
	if (event.request.method === "GET" && event.route.id !== null) {
		event.locals.isDarkMode = event.cookies.get("theme") === "dark";
		return await resolve(event, { transformPageChunk: ({ html }) => (event.locals.isDarkMode ? html.replace("<body ", '<body class="dark" ') : html) });
	}
	return await resolve(event);
};
