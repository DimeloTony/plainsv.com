import { setContext, getContext, onDestroy } from "svelte";
import type { CodeBlockData, CodeBlockHighlightLines, CodeBlockTheme } from "./index.js";

const CONTEXT_ID = "code-block-context";

class UseCompCtx {
	/** Decoded code to display and copy, with its language source and optional header `title` */
	data: CodeBlockData = $state({ code: "", lang: "bash" });
	/** Size shared by the header and code */
	size: UiSize = $state("md");
	/** Highlight theme shared with the code */
	theme: CodeBlockTheme = $state("auto");
	/** Lines to highlight, shared with the code */
	highlightLines: CodeBlockHighlightLines = $state([]);
	isCopying = $state(false);
	copyTimeout?: ReturnType<typeof setTimeout>;

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
		// Clear the copied-state timeout when the code block unmounts.
		onDestroy(() => clearTimeout(this.copyTimeout));
	}

	/** Copies the code to the clipboard and shows the copied state for one second. */
	async copyCode() {
		this.isCopying = true;
		try {
			await navigator.clipboard.writeText(this.data.code);
		} catch {
			// If the clipboard is unavailable or blocked: reset right away instead of showing success.
			this.isCopying = false;
			return;
		}
		clearTimeout(this.copyTimeout);
		this.copyTimeout = setTimeout(() => (this.isCopying = false), 1000);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "data" | "size" | "theme" | "highlightLines">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
