import { page } from "$app/state";
import { browser } from "$app/env";
import { MediaQuery } from "svelte/reactivity";
import { setContext, getContext, untrack } from "svelte";
import { toast } from "#lib/components/ui/toaster/index.js";

class UseAppCtx {
	userData: App.Locals["userData"] | null = $state(null);
	currentPage = $derived(page);
	currentPathname = $derived(page.url.pathname);
	isMounted = $state(false);
	isDarkMode = $state(false);
	isMobile = $derived(new MediaQuery("max-width: 700px").current);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}

		// If running on browser: read local cookie and set dark mode variable
		if (browser) window.cookieStore.get("theme").then((cookie) => (this.isDarkMode = cookie?.value === "dark"));

		// Set isMounted after 1 second
		$effect(() => void setTimeout(() => untrack(() => (this.isMounted = true)), 1000));

		// Toggle dark class when isDarkMode changes
		$effect.pre(() => void document.body.classList.toggle("dark", this.isDarkMode));
	}

	/** Toggle between dark and light mode */
	async toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
		await window.cookieStore.set("theme", this.isDarkMode ? "dark" : "light");
		toast.success(this.isDarkMode ? "Dark mode enabled." : "Light mode enabled.");
	}
}

export const CONTEXT_ID = "app-context";

export type AppCtxProps = Partial<Pick<InstanceType<typeof UseAppCtx>, "isDarkMode" | "isMobile" | "userData">>;

export const setAppCtx = (props: AppCtxProps) => setContext(CONTEXT_ID, new UseAppCtx(props));

export const useAppCtx = () => getContext<ReturnType<typeof setAppCtx>>(CONTEXT_ID);
