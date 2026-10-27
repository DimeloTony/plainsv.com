import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "message-context";

class UseCompCtx {
	/** Style of the content bubble, after the default for `from` is applied */
	variant: NonNullable<Props["variant"]> = $state("ghost");
	/** Size of the message */
	size: UiSize = $state("md");
	/** Size of the avatar and actions, one step below the message */
	controlSize = $derived(({ xs: "xs", sm: "xs", md: "sm", lg: "md" } as const)[this.size]);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "variant" | "size">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
