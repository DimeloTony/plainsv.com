import fs from "node:fs/promises";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

/** Serves the docs index page as plain markdown for LLMs. */
export const GET: RequestHandler = async () => {
	const svxRoutePath = "src/routes/(app)/docs/+page.svx";
	try {
		// Load the docs index page and parse its contents.
		const svxRouteData = getFileData((await fs.readFile(svxRoutePath)).toString());
		// Remove the live demo tag, since it only renders in the browser.
		const markdown = svxRouteData.markdown.replace(/\n?<Demo\b[^>]*\/>/g, "");
		return new Response(markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
	} catch (error: any) {
		// If the docs page is missing or unreadable: return a not-found message.
		return new Response("The llm.md for the docs page was not found.");
	}
};
