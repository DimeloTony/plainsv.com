import { page } from "$app/state";
import { MediaQuery } from "svelte/reactivity";
import { setContext, getContext, untrack } from "svelte";
import { toast } from "#lib/components/ui/toaster/index.js";
import { useFunc } from "#lib/functions/index.js";

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
		// Set isMounted after 1 second
		$effect(() => {
			setTimeout(() => untrack(() => (this.isMounted = true)), 1000);
		});
		// Add and remove dark class to body whenever `isDarkMode` changes
		$effect(() => {
			document.body.classList.toggle("dark", this.isDarkMode);
		});
	}

	/** Toggle between dark and light mode */
	async toggleDarkMode() {
		try {
			const response = await useFunc("toggleDarkMode", null);
			// If the server rejects the change: show its error message.
			if (response.error) return void toast.error(response.data);
			// If the theme is saved: update the app context and confirm the selected mode.
			this.isDarkMode = response.data.isDarkMode;
			toast.success(response.data.isDarkMode ? "Dark mode enabled." : "Light mode enabled.");
		} catch {
			// If the request fails: show an error instead of confirming the theme change.
			toast.error("Something went wrong updating the theme.");
		}
	}
}

export const CONTEXT_ID = "app-context";

export type AppCtxProps = Pick<InstanceType<typeof UseAppCtx>, "isDarkMode" | "isMobile" | "userData">;

export const setAppCtx = (props: AppCtxProps) => setContext(CONTEXT_ID, new UseAppCtx(props));

export const useAppCtx = () => getContext<ReturnType<typeof setAppCtx>>(CONTEXT_ID);
