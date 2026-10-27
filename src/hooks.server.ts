import type { Handle } from "@sveltejs/kit/hooks";

export const handle: Handle = async ({ event, resolve }) => {
	// Handle `dark` class on body on the server side to avoid flicker from light to dark
	if (event.request.method === "GET" && event.route.id !== null) {
		event.locals.isDarkMode = event.cookies.get("theme") === "dark";
		const response = await resolve(event, { transformPageChunk: ({ html }) => (event.locals.isDarkMode ? html.replace("<body ", '<body class="dark" ') : html) });
		return response;
	}
	return await resolve(event);
};
