export { default as AIAction } from "./_.svelte";
export { default as AIActionContent } from "./content.svelte";

/** One step of an AI response, such as "Searching the web", with an icon and optional details that expand below it */
export interface Props extends CompProps<"div"> {
	/** Status text beside the icon */
	title: string;
	/** Icon shown before the title; a chevron replaces it while an expandable step is hovered or focused */
	icon: Component;
	/** Details shown below the title, usually an `AIActionContent`; makes the step expandable */
	children?: Snippet;
	/** Whether the details are shown; supports `bind:open`; defaults to `true` when there are details */
	open?: boolean;
	/** Called when the details open or close */
	onOpenChange?: (open: boolean) => void;
	/** Stops the title shimmer once the step has finished */
	done?: boolean;
	/** Text and icon size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the root */
	class?: CompProps<"div">["class"];
}

/** Details of the step, indented under the title with a line beside them; slides open and closed */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the details */
	class?: CompPropsWithChild<"div">["class"];
}

export type AIActionProps = Props;
export type AIActionContentProps = ContentProps;
