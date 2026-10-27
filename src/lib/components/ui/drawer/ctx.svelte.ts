import { setContext, getContext } from "svelte";
import type { Props, DrawerDirection } from "./index.js";

const CONTEXT_ID = "drawer-context";

class UseCompCtx {
	/** Whether the drawer is shown */
	open = $state(false);
	/** Unique prefix that links the drawer to its title and description by id */
	baseId = $state("");
	/** Edge the drawer slides in from */
	direction: DrawerDirection = $state("bottom");
	/** Padding, text size, and side drawer width */
	size: UiSize = $state("md");
	/** Radius of the corners facing the page */
	rounded: UiRounded = $state("lg");
	/** Called when the drawer opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Id of the `DrawerTitle` that names the drawer */
	titleId = $derived(`${this.baseId}-title`);
	/** Id of the `DrawerDescription` that describes the drawer */
	descriptionId = $derived(`${this.baseId}-description`);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Opens or closes the drawer and reports the change. */
	setOpen(open: boolean) {
		// If the state did not change: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "baseId" | "direction" | "size" | "rounded" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
