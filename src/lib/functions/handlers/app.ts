import { dev } from "$app/env";
import type { FuncHandler } from "#lib/functions/schemas.js";

/** Toggle theme */
export const toggleDarkMode: FuncHandler<"toggleDarkMode"> = async ({ event }) => {
	const isDarkMode = event.cookies.get("theme") === "dark";
	const theme = isDarkMode ? "light" : "dark";
	// Save the theme for a week; only send it over https outside dev
	event.cookies.set("theme", theme, { path: "/", httpOnly: true, sameSite: "lax", secure: !dev, maxAge: 60 * 60 * 24 * 7 });
	return { error: false, data: { isDarkMode: !isDarkMode } };
};
