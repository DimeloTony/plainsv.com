import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as Collapsible } from "./_.svelte";
export { default as CollapsibleTrigger } from "./trigger.svelte";
export { default as CollapsibleContent } from "./content.svelte";

/** Collapsible root that holds the open state for its trigger and content */
export interface Props extends CompPropsWithChild<"div"> {
	/** Whether the content is shown; supports `bind:open` */
	open?: boolean;
	/** Starting state when `open` is not set; defaults to `false` */
	defaultOpen?: boolean;
	/** Called when the content opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Blocks opening and closing */
	disabled?: boolean;
	/** Classes merged onto the root */
	class?: CompPropsWithChild<"div">["class"];
}

/** Props a custom trigger spreads onto the element that toggles the content */
export interface TriggerAttrs {
	/** Id of the trigger */
	id: string;
	/** Whether the content is shown */
	"aria-expanded": boolean;
	/** Id of the content */
	"aria-controls": string;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Whether the collapsible is disabled */
	disabled: boolean;
	/** Toggles the content */
	onclick: () => void;
}

/** Collapsible trigger; renders a `Button` with these props unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that toggles the content */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Visual style of the default button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Size of the default button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default button; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default button */
	class?: CompProps<"button">["class"];
}

/** Content shown while the collapsible is open; slides open and closed */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

export type CollapsibleProps = Props;
export type CollapsibleTriggerAttrs = TriggerAttrs;
export type CollapsibleTriggerProps = TriggerProps;
export type CollapsibleContentProps = ContentProps;
