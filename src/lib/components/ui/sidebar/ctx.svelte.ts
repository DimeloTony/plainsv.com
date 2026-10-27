import { setContext, getContext } from "svelte";
import type { ProviderProps, Props } from "./index.js";

const CONTEXT_ID = "sidebar-context";

class UseCompCtx {
	/** Whether the desktop sidebar is expanded */
	open = $state(true);
	/** Whether the mobile sidebar drawer is shown */
	openMobile = $state(false);
	/** Whether the screen is narrower than 48rem, where the sidebar becomes a drawer */
	isMobile = $state(false);
	/** How the sidebar collapses, set by `Sidebar` */
	collapsible: NonNullable<Props["collapsible"]> = $state("offcanvas");
	/** Edge the sidebar sits on, set by `Sidebar` */
	side: NonNullable<Props["side"]> = $state("left");
	/** Called when the desktop sidebar expands or collapses */
	onOpenChange?: ProviderProps["onOpenChange"];
	/** `expanded` or `collapsed`, for styling */
	state = $derived(this.open ? "expanded" : "collapsed");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Whether the desktop sidebar is collapsed to its icons */
	get isIconCollapsed() {
		return !this.isMobile && !this.open && this.collapsible === "icon";
	}

	/** Expands or collapses the desktop sidebar and reports the change. */
	setOpen(open: boolean) {
		// If the state did not change: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}

	/** Toggles the drawer on mobile, or the desktop sidebar otherwise. */
	toggle() {
		if (this.isMobile) this.openMobile = !this.openMobile;
		else this.setOpen(!this.open);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
