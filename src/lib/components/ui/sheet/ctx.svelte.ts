import { setContext, getContext } from "svelte";

const CONTEXT_ID = "sheet-context";

class UseCompCtx {
	/** Whether the sheet is shown */
	open = $state(false);
	/** Base id that links the title and description to the sheet */
	id = $state("");
	/** Content snippet registered by `SheetContent` and rendered inside the sheet */
	content?: Snippet = $state();

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "id">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
