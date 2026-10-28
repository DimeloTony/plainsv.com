import fs from "node:fs/promises";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

/** Serves the deploy page as plain markdown for LLMs. */
export const GET: RequestHandler = async () => {
	const svxRoutePath = "src/routes/(app)/docs/deploy/+page.svx";
	try {
		// Load the deploy page and parse its contents.
		const svxRouteData = getFileData((await fs.readFile(svxRoutePath)).toString());
		// Remove the live demo tag, since it only renders in the browser.
		const markdown = svxRouteData.markdown.replace(/\n?<Demo\b[^>]*\/>/g, "");
		return new Response(markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
	} catch (error: any) {
		// If the deploy page is missing or unreadable: return a not-found message.
		return new Response("The llm.md for the deploy page was not found.");
	}
};
