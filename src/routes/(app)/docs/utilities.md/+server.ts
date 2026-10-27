import fs from "node:fs/promises";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { RequestHandler } from "./$types";

/** Serves the utilities index page as plain markdown for LLMs. */
export const GET: RequestHandler = async () => {
	const svxRoutePath = "src/routes/(app)/docs/utilities/+page.svx";
	try {
		// Load the utilities index page and parse its contents.
		const svxRouteData = getFileData((await fs.readFile(svxRoutePath)).toString());
		// Remove the live demo tag, since it only renders in the browser.
		const markdown = svxRouteData.markdown.replace(/\n?<Demo\b[^>]*\/>/g, "");
		return new Response(markdown);
	} catch (error: any) {
		// If the utilities page is missing or unreadable: return a not-found message.
		return new Response("The llm.md for the utilities page was not found.");
	}
};
