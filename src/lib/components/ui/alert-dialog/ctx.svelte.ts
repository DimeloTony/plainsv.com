import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "alert-dialog-context";

class UseCompCtx {
	/** Whether the alert dialog is shown */
	open = $state(false);
	/** Unique prefix that links the dialog to its title and description by id */
	baseId = $state("");
	/** Padding, text, width, and radius of the panel */
	size: UiSize = $state("md");
	/** Corner radius of the panel */
	rounded: UiRounded = $state("lg");
	/** Called when the alert dialog opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Id of the `AlertDialogTitle` that names the dialog */
	titleId = $derived(`${this.baseId}-title`);
	/** Id of the `AlertDialogDescription` that describes the dialog */
	descriptionId = $derived(`${this.baseId}-description`);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Opens or closes the alert dialog and reports the change. */
	setOpen(open: boolean) {
		// If the state did not change: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "baseId" | "size" | "rounded" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
