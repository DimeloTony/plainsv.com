export { default as Accordion } from "./_.svelte";
export { default as AccordionItem } from "./item.svelte";
export { default as AccordionTrigger } from "./trigger.svelte";
export { default as AccordionContent } from "./content.svelte";

/** Accordion root that holds the open items and shares the style with its parts */
export interface Props extends CompPropsWithChild<"div"> {
	/** Values of the open items; supports `bind:value` */
	value?: string[];
	/** Items open at the start when `value` is not set */
	defaultValue?: string[];
	/** Called with the open values when an item opens or closes */
	onValueChange?: (value: string[]) => void;
	/** Lets several items be open at once; by default opening one closes the others */
	multiple?: boolean;
	/** Blocks opening and closing every item */
	disabled?: boolean;
	/** Visual style; `outline` wraps the items in a bordered box */
	variant?: "default" | "outline";
	/** Padding and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the box and focus rings; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the accordion */
	class?: CompPropsWithChild<"div">["class"];
}

/** Section with a trigger and its collapsible content */
export interface ItemProps extends CompPropsWithChild<"div"> {
	/** Value that identifies the item in the open values */
	value: string;
	/** Blocks opening and closing the item; the arrow keys skip it */
	disabled?: boolean;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Props a custom trigger spreads onto the element that opens and closes its item */
export interface TriggerAttrs {
	/** Id that names the content */
	id: string;
	/** Whether the item is open */
	"aria-expanded": boolean;
	/** Id of the content */
	"aria-controls": string;
	/** Whether the item is disabled; the arrow keys skip it */
	disabled: boolean;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Marks the element as a trigger that the up and down arrows move between */
	"data-accordion-trigger": true;
	/** Opens or closes the item */
	onclick: () => void;
	/** Moves focus between the triggers with the arrows, Home, and End */
	onkeydown: (e: KeyboardEvent) => void;
}

/** Heading button that opens and closes its item; renders a button with a chevron unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens and closes the item */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Classes merged onto the default trigger */
	class?: CompProps<"button">["class"];
}

/** Region shown while its item is open */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

export type AccordionProps = Props;
export type AccordionItemProps = ItemProps;
export type AccordionTriggerProps = TriggerProps;
export type AccordionTriggerAttrs = TriggerAttrs;
export type AccordionContentProps = ContentProps;
