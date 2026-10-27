import { setContext, getContext } from "svelte";
import type { Props, PanelConfig } from "./index.js";

const CONTEXT_ID = "resizable-context";

class UseCompCtx {
	/** Whether the panels sit side by side or stack */
	direction: NonNullable<Props["direction"]> = $state("horizontal");
	/** Registered panels, in markup order */
	panels: PanelConfig[] = $state([]);
	/** Size of each panel in percent, by panel id */
	sizes: Record<string, number> = $state({});
	/** Whether a handle is being dragged */
	isDragging = $state(false);
	/** Called with every panel size after a resize */
	onLayoutChange?: Props["onLayoutChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Adds a panel and lays out every panel from their default sizes; returns a function that removes it. */
	registerPanel(panel: PanelConfig) {
		this.panels.push(panel);
		this.applyDefaultLayout();
		return () => {
			this.panels = this.panels.filter((registered) => registered.id !== panel.id);
			this.applyDefaultLayout();
		};
	}

	/** Gives each panel its default size, and splits the rest equally among the panels without one. */
	applyDefaultLayout() {
		const sizedTotal = this.panels.reduce((sum, panel) => sum + (panel.defaultSize ?? 0), 0);
		const unsizedCount = this.panels.filter((panel) => panel.defaultSize === undefined).length;
		const share = unsizedCount ? Math.max(100 - sizedTotal, 0) / unsizedCount : 0;
		const sizes: Record<string, number> = {};
		for (const panel of this.panels) sizes[panel.id] = panel.defaultSize ?? share;
		this.sizes = sizes;
	}

	/** Moves the boundary between two neighboring panels, keeping their total and both panels' limits. */
	resizePair(beforeId: string, afterId: string, beforeSize: number) {
		const before = this.panels.find((panel) => panel.id === beforeId);
		const after = this.panels.find((panel) => panel.id === afterId);
		// If either panel is gone: there is nothing to resize.
		if (!before || !after) return;
		const total = this.sizes[beforeId] + this.sizes[afterId];
		// The first panel stays inside its own limits and leaves the second inside its limits.
		const min = Math.max(before.minSize, total - after.maxSize);
		const max = Math.min(before.maxSize, total - after.minSize);
		const nextBefore = Math.min(Math.max(beforeSize, min), max);
		this.sizes[beforeId] = nextBefore;
		this.sizes[afterId] = total - nextBefore;
		this.onLayoutChange?.(this.panels.map((panel) => this.sizes[panel.id]));
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "direction" | "onLayoutChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
