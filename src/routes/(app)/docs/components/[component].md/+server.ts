import fs from "node:fs/promises";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { RequestHandler } from "./$types";

/** Serves a component's docs page as plain markdown for LLMs. */
export const GET: RequestHandler = async (event) => {
	const component = event.params.component;
	const svxRoutePath = `src/routes/(app)/docs/components/${component}/+page.svx`;
	try {
		// Load the component's docs page and parse its contents.
		const svxRouteData = getFileData((await fs.readFile(svxRoutePath)).toString());
		// Remove the live demo tag, since it only renders in the browser.
		const markdown = svxRouteData.markdown.replace(/\n?<Demo\b[^>]*\/>/g, "");
		return new Response(markdown);
	} catch (error: any) {
		// If the docs page is missing or unreadable: return a not-found message.
		return new Response(`The llm.md for component '${component}' was not found.`);
	}
};
