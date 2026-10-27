/** App core data */
export const appData = {
	name: "PlainSv",
	title: "Components, utilities, and plugins in plain Svelte",
	description: "Accessible components, utilities, and Vite plugins for Svelte 5, written the Svelte way: runes, scoped styles, and native elements, with as few packages as possible.",
	githubUrl: "https://github.com/DimeloTony/plainsv.com",
	authorUrl: "https://github.com/DimeloTony",
};

/** Main docs pages listed in the search menu */
export const pageLinks = [
	{ href: "/docs", label: "Get Started", keywords: ["install", "setup", "init"] },
	{ href: "/docs/styling", label: "Styling", keywords: ["theme", "tokens", "css", "dark mode", "variant", "size", "rounded"] },
	{ href: "/docs/components", label: "Components", keywords: ["all components"] },
	{ href: "/examples", label: "Examples", keywords: ["demos"] },
	{ href: "/docs/utilities", label: "Utilities", keywords: ["helpers", "plugins", "vite"] },
	{ href: "/docs/utilities/css", label: "CSS Utilities", keywords: ["shimmer", "scroll fade", "classes"] },
	{ href: "/docs/utilities/functions", label: "Functions", keywords: ["server functions", "zod", "validation", "remote"] },
	{ href: "/docs/utilities/auth", label: "Auth", keywords: ["sign in", "login", "oauth", "google", "github", "session"] },
	{ href: "/docs/utilities/drizzle", label: "Drizzle", keywords: ["database", "db", "sqlite", "orm", "schema", "migrations"] },
	{ href: "/docs/utilities/mongodb", label: "MongoDB", keywords: ["database", "db", "mongo", "zod", "schema"] },
	{ href: "/docs/utilities/plugins", label: "Plugins", keywords: ["vite", "svx", "markdown", "icons", "env"] },
	{ href: "/docs/deploy", label: "Deploy", keywords: ["server", "ubuntu", "nginx", "pm2", "cloudflare", "rollback", "hosting"] },
];

/** Full-screen example pages built from the registry components */
export const exampleLinks = [
	{ href: "/examples/dashboard-01", label: "Dashboard 01", description: "A dashboard with an inset sidebar, stat cards, an interactive chart, and a data table." },
	{ href: "/examples/sidebar-01", label: "Sidebar 01", description: "A simple sidebar with navigation grouped by section." },
	{ href: "/examples/sidebar-02", label: "Sidebar 02", description: "A sidebar with collapsible sections." },
	{ href: "/examples/sidebar-03", label: "Sidebar 03", description: "A sidebar with submenus." },
	{ href: "/examples/sidebar-04", label: "Sidebar 04", description: "A floating sidebar with submenus." },
	{ href: "/examples/sidebar-05", label: "Sidebar 05", description: "A sidebar with collapsible submenus." },
	{ href: "/examples/sidebar-06", label: "Sidebar 06", description: "A sidebar with submenus as dropdowns." },
	{ href: "/examples/sidebar-07", label: "Sidebar 07", description: "A sidebar that collapses to icons." },
	{ href: "/examples/sidebar-08", label: "Sidebar 08", description: "An inset sidebar with secondary navigation." },
	{ href: "/examples/sidebar-09", label: "Sidebar 09", description: "Collapsible nested sidebars." },
	{ href: "/examples/sidebar-10", label: "Sidebar 10", description: "A sidebar in a popover." },
	{ href: "/examples/sidebar-11", label: "Sidebar 11", description: "A sidebar with a collapsible file tree." },
	{ href: "/examples/sidebar-12", label: "Sidebar 12", description: "A sidebar with a calendar." },
	{ href: "/examples/sidebar-13", label: "Sidebar 13", description: "A sidebar in a dialog." },
	{ href: "/examples/sidebar-14", label: "Sidebar 14", description: "A sidebar on the right." },
	{ href: "/examples/sidebar-15", label: "Sidebar 15", description: "A left and right sidebar." },
	{ href: "/examples/sidebar-16", label: "Sidebar 16", description: "A sidebar with a sticky site header." },
	{ href: "/examples/login-01", label: "Login 01", description: "A simple login form in a card." },
	{ href: "/examples/login-02", label: "Login 02", description: "A two column login page with a cover image." },
	{ href: "/examples/login-03", label: "Login 03", description: "A login card with social logins on a muted background." },
	{ href: "/examples/login-04", label: "Login 04", description: "A login card split into a form and a cover image." },
	{ href: "/examples/login-05", label: "Login 05", description: "A simple email login with social logins." },
	{ href: "/examples/signup-01", label: "Signup 01", description: "A simple sign up form in a card." },
	{ href: "/examples/signup-02", label: "Signup 02", description: "A two column sign up page with a cover image." },
	{ href: "/examples/signup-03", label: "Signup 03", description: "A sign up card on a muted background." },
	{ href: "/examples/signup-04", label: "Signup 04", description: "A sign up card split into a form and a cover image." },
	{ href: "/examples/signup-05", label: "Signup 05", description: "A simple email sign up with social sign ups." },
];

// Each folder under the components docs with a `+page.svelte` or `+page.svx` is a component docs page.
// Escape the `(app)` route group, since glob patterns read bare parentheses as syntax and match nothing.
// Only the paths are read, so `?raw` keeps the pages and their component CSS out of this chunk's lazy imports,
// which would otherwise stop SvelteKit from linking that CSS in the page head and flash unstyled components.
const componentDocsPages = import.meta.glob("/src/routes/\\(app\\)/docs/components/*/+page.{svelte,svx}", { query: "?raw", import: "default" });

/** Component docs pages, sorted by name */
export const componentLinks = Object.keys(componentDocsPages)
	.map((path) => {
		const slug = path.split("/").at(-2) ?? "";
		const label = slug
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
		return { href: `/docs/components/${slug}`, label };
	})
	.sort((a, b) => a.label.localeCompare(b.label));

/** Utility docs pages, in the order they appear in the nav */
export const utilityLinks = [
	{ href: "/docs/utilities/css", label: "CSS Utilities", description: "Shimmer and scroll-fade classes in plain CSS." },
	{ href: "/docs/utilities/functions", label: "Functions", description: "Type-safe server functions validated with Zod." },
	{ href: "/docs/utilities/auth", label: "Auth", description: "Google or GitHub sign in with any database." },
	{ href: "/docs/utilities/drizzle", label: "Drizzle", description: "Drizzle ORM on Node's built-in SQLite." },
	{ href: "/docs/utilities/mongodb", label: "MongoDB", description: "A typed MongoDB client with Zod collection schemas." },
	{ href: "/docs/utilities/plugins", label: "Plugins", description: "Vite plugins for .svx pages, icons, and env files." },
];

/** Top-level nav items; each opens a panel of its pages on hover */
export const mainNavLinks = [
	{ href: "/docs/components", label: "Components", links: componentLinks },
	{ href: "/docs/utilities", label: "Utilities", links: utilityLinks },
];
