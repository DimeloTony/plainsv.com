import adapter from "@sveltejs/adapter-node";
import devPlugin from "#lib/server/plugins/dev/index.js";
import svxPlugin from "#lib/server/plugins/svx/index.js";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
	return {
		plugins: [
			// Point registry links at the local DOMAIN_URL on dev
			devPlugin({ replace: { "https://plainsv.com/r/": `${process.env.DOMAIN_URL}/r/` } }),
			svxPlugin(),
			sveltekit({
				// inlineStyleThreshold: 10240,
				adapter: adapter(),
				extensions: [".svelte", ".svx"],
				// Use the live domain from .env.production for the prerendered sitemap and llms.txt, instead of http://sveltekit-prerender
				paths: { origin: process.env.DOMAIN_URL },
				compilerOptions: {
					// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
					runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
					warningFilter: (warning) => (warning.code === "state_referenced_locally" ? false : true),
				},
			}),
		],
	};
});
