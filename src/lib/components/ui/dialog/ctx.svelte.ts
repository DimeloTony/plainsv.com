import { setContext, getContext } from "svelte";

const CONTEXT_ID = "dialog-context";

class UseCompCtx {
	/** Whether the dialog is shown */
	open = $state(false);
	/** Content snippet registered by `DialogContent` and rendered inside the dialog */
	content?: Snippet = $state();
	/** Classes from `DialogContent`, merged onto the panel */
	contentClass: CompProps<"div">["class"] = $state();
	/** Other attributes from `DialogContent`, spread onto the panel */
	contentAttrs: CompProps<"div"> = $state({});

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
