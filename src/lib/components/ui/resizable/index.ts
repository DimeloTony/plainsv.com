export { default as ResizablePanelGroup } from "./_.svelte";
export { default as ResizablePanel } from "./panel.svelte";
export { default as ResizableHandle } from "./handle.svelte";

/** Row or column of panels that share the space; drag a handle to resize the panels beside it */
export interface Props extends CompPropsWithChild<"div"> {
	/** `horizontal` places the panels side by side; `vertical` stacks them; defaults to `horizontal` */
	direction?: "horizontal" | "vertical";
	/** Called with every panel size, in percent and in order, after a resize */
	onLayoutChange?: (sizes: number[]) => void;
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** One panel; sizes are percentages of the group */
export interface PanelProps extends CompPropsWithChild<"div"> {
	/** Starting size in percent; panels without one share the rest equally */
	defaultSize?: number;
	/** Smallest size in percent the handles allow; defaults to `0` */
	minSize?: number;
	/** Largest size in percent the handles allow; defaults to `100` */
	maxSize?: number;
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Divider between two panels; drag it, or focus it and use the arrow keys */
export interface HandleProps extends CompProps<"div"> {
	/** Shows a grip in the middle of the divider */
	withHandle?: boolean;
	/** Blocks resizing with this handle */
	disabled?: boolean;
	/** Classes merged onto the handle */
	class?: CompProps<"div">["class"];
}

/** Size limits of a registered panel */
export interface PanelConfig {
	/** Id that links the panel to the handles beside it */
	id: string;
	/** Starting size in percent */
	readonly defaultSize?: number;
	/** Smallest size in percent */
	readonly minSize: number;
	/** Largest size in percent */
	readonly maxSize: number;
}

export type ResizablePanelGroupProps = Props;
export type ResizablePanelProps = PanelProps;
export type ResizableHandleProps = HandleProps;
