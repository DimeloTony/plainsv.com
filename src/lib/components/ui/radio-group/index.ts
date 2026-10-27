export { default as RadioGroup } from "./_.svelte";
export { default as RadioGroupItem } from "./item.svelte";

/** Set of options where only one can be checked */
export interface Props extends CompPropsWithChild<"div"> {
	/** Value of the checked item; supports `bind:value` */
	value?: string;
	/** Starting item when `value` is not set */
	defaultValue?: string;
	/** Called with the new value when an item is checked */
	onValueChange?: (value: string) => void;
	/** Form field name; submits the checked value */
	name?: string;
	/** Disables every item */
	disabled?: boolean;
	/** Direction the items are laid out in; the arrow keys work in both directions either way; defaults to `vertical` */
	orientation?: "horizontal" | "vertical";
	/** Circle, dot, and gap size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Circle that checks its `value` in the group; renders a `button` with `role="radio"` */
export interface ItemProps extends CompProps<"button"> {
	/** Value checked when this item is picked */
	value: string;
	/** Size of this item; overrides the group's `size` */
	size?: UiSize;
	/** Classes merged onto the item */
	class?: CompProps<"button">["class"];
}

export type RadioGroupProps = Props;
export type RadioGroupItemProps = ItemProps;
