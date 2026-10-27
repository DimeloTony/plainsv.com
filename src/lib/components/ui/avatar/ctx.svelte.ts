import { setContext, getContext } from "svelte";

const CONTEXT_ID = "avatar-context";

class UseCompCtx {
	/** Load state of the `AvatarImage`; the fallback shows until it is `loaded` */
	status: "loading" | "loaded" | "error" = $state("loading");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "status">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
