import fs from "node:fs/promises";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

/** Lists every utility folder with a docs page so each .md file is prerendered. */
export const entries: EntryGenerator = async () => {
	const folderPath = "src/routes/(app)/docs/utilities";
	const folders = await fs.readdir(folderPath, { withFileTypes: true });
	const names = folders.filter((folder) => folder.isDirectory() && !/[[\]]/.test(folder.name)).map((folder) => folder.name);
	// Keep only folders that have a docs page.
	const pages = await Promise.all(names.map(async (name) => ((await fs.stat(`${folderPath}/${name}/+page.svx`).catch(() => undefined)) ? name : undefined)));
	return pages.filter((name) => name !== undefined).map((utility) => ({ utility }));
};

/** Serves a utility's docs page as plain markdown for LLMs. */
export const GET: RequestHandler = async (event) => {
	const utility = event.params.utility;
	const svxRoutePath = `src/routes/(app)/docs/utilities/${utility}/+page.svx`;
	try {
		// Load the utility's docs page and parse its contents.
		const svxRouteData = getFileData((await fs.readFile(svxRoutePath)).toString());
		// Remove the live demo tag, since it only renders in the browser.
		const markdown = svxRouteData.markdown.replace(/\n?<Demo\b[^>]*\/>/g, "");
		return new Response(markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
	} catch (error: any) {
		// If the docs page is missing or unreadable: return a not-found message.
		return new Response(`The llm.md for utility '${utility}' was not found.`);
	}
};
