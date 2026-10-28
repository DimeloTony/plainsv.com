import fs from "node:fs/promises";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

/** Lists every component folder with a docs page so each .md file is prerendered. */
export const entries: EntryGenerator = async () => {
	const folderPath = "src/routes/(app)/docs/components";
	const folders = await fs.readdir(folderPath, { withFileTypes: true });
	const names = folders.filter((folder) => folder.isDirectory() && !/[[\]]/.test(folder.name)).map((folder) => folder.name);
	// Keep only folders that have a docs page.
	const pages = await Promise.all(names.map(async (name) => ((await fs.stat(`${folderPath}/${name}/+page.svx`).catch(() => undefined)) ? name : undefined)));
	return pages.filter((name) => name !== undefined).map((component) => ({ component }));
};

/** Serves a component's docs page as plain markdown for LLMs. */
export const GET: RequestHandler = async (event) => {
	const component = event.params.component;
	const svxRoutePath = `src/routes/(app)/docs/components/${component}/+page.svx`;
	try {
		// Load the component's docs page and parse its contents.
		const svxRouteData = getFileData((await fs.readFile(svxRoutePath)).toString());
		// Remove the live demo tag, since it only renders in the browser.
		const markdown = svxRouteData.markdown.replace(/\n?<Demo\b[^>]*\/>/g, "");
		return new Response(markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
	} catch (error: any) {
		// If the docs page is missing or unreadable: return a not-found message.
		return new Response(`The llm.md for component '${component}' was not found.`);
	}
};
