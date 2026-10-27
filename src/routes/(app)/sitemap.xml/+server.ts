import fs from "node:fs/promises";
import { exampleLinks } from "#lib/data/app.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

const folders = ["components", "utilities"];

/** Serves a sitemap listing the home page, the docs index, every docs page, and the examples. */
export const GET: RequestHandler = async (event) => {
	const origin = event.url.origin;
	const paths = ["/", "/docs", "/docs/styling"];

	// Add every folder in each docs section that has a docs page.
	for (const folder of folders) {
		const entries = await fs.readdir(`src/routes/(app)/docs/${folder}`, { withFileTypes: true });
		const names = entries.filter((entry) => entry.isDirectory() && !/[[\]]/.test(entry.name)).map((entry) => entry.name);
		paths.push(`/docs/${folder}`, ...names.sort().map((name) => `/docs/${folder}/${name}`));
	}

	// Add the examples gallery and every example page it lists.
	paths.push("/examples", ...exampleLinks.map((example) => example.href));

	const urls = paths.map((path) => `\t<url><loc>${origin}${path}</loc></url>`).join("\n");
	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
