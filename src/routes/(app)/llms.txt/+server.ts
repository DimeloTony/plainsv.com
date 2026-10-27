import fs from "node:fs/promises";
import { appData } from "#lib/data/app.js";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

const sections = [
	{ title: "Overview", folder: "" },
	{ title: "Components", folder: "components" },
	{ title: "Utilities", folder: "utilities" },
];

/** Serves an llms.txt index that links every docs page as plain markdown. */
export const GET: RequestHandler = async (event) => {
	const origin = event.url.origin;
	const lines = [`# ${appData.name}`, "", `> ${appData.description}`, ""];

	for (const section of sections) {
		lines.push(`## ${section.title}`, "");

		// If the section is the overview: link only the docs introduction.
		if (!section.folder) {
			const intro = await getPageInfo("src/routes/(app)/docs/+page.svx");
			const styling = await getPageInfo("src/routes/(app)/docs/styling/+page.svx");
			lines.push(`- [Introduction](${origin}/docs): ${intro?.description ?? appData.description}`);
			// If the styling page is readable: link it after the introduction.
			if (styling) lines.push(`- [${styling.title}](${origin}/docs/styling): ${styling.description}`);
			lines.push("");
			continue;
		}

		// Otherwise list every folder in the section that has a docs page.
		const folderPath = `src/routes/(app)/docs/${section.folder}`;
		const entries = await fs.readdir(folderPath, { withFileTypes: true });
		const names = entries.filter((entry) => entry.isDirectory() && !/[[\]]/.test(entry.name)).map((entry) => entry.name);
		const index = await getPageInfo(`${folderPath}/+page.svx`);
		// If the section has an .svx index page: link it before its pages.
		if (index) lines.push(`- [${index.title}](${origin}/docs/${section.folder}.md): ${index.description}`);
		for (const name of names.sort()) {
			const page = await getPageInfo(`${folderPath}/${name}/+page.svx`);
			// If the folder has no readable docs page: skip it.
			if (!page) continue;
			lines.push(`- [${page.title}](${origin}/docs/${section.folder}/${name}.md): ${page.description}`);
		}
		lines.push("");
	}

	return new Response(lines.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};

/** Reads a docs page and returns its frontmatter title and description. */
async function getPageInfo(svxPath: string) {
	try {
		const { frontmatter } = getFileData((await fs.readFile(svxPath)).toString());
		return { title: frontmatter.title ?? "", description: frontmatter.description ?? "" };
	} catch {
		// If the page is missing or unreadable: return nothing.
		return undefined;
	}
}
