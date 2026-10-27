import type { ToggleProps } from "#lib/components/ui/toggle/index.js";

export { default as ToggleGroup } from "./_.svelte";
export { default as ToggleGroupItem } from "./item.svelte";

/** Selection type: `single` lets one item be pressed, `multiple` lets any number be pressed */
export type ToggleGroupType = "single" | "multiple";

/** Value shape of a selection type: one string for `single`, a list for `multiple` */
export type ToggleGroupValue<T extends ToggleGroupType> = T extends "multiple" ? string[] : string;

/** Set of toggles that share a value; the type of `value` and `onValueChange` follows `type`, even when `type` is omitted */
export interface Props<T extends ToggleGroupType = "single"> extends CompPropsWithChild<"div"> {
	/** Selection type; `single` releases the pressed item when it is pressed again; defaults to `single` */
	type?: T;
	/** Value of the pressed item, empty while none is pressed, or the values of the pressed items when `type` is `multiple`; supports `bind:value` */
	value?: ToggleGroupValue<T>;
	/** Called with the new value, or values, when an item is pressed or released */
	onValueChange?: (value: ToggleGroupValue<T>) => void;
	/** Disables every item */
	disabled?: boolean;
	/** Direction of the items; the arrow keys follow it; defaults to `horizontal` */
	orientation?: "horizontal" | "vertical";
	/** `none` joins the items into one control with shared borders; a size spaces them apart; defaults to `none` */
	spacing?: "none" | UiSize;
	/** Style of every item */
	variant?: ToggleProps["variant"];
	/** Size of every item on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the joined group, or of each item when spaced; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Toggle that adds or removes its `value` in the group */
export interface ItemProps extends CompPropsWithChild<"button"> {
	/** Value this item adds to the group while pressed */
	value: string;
	/** Style of this item; overrides the group's `variant` */
	variant?: ToggleProps["variant"];
	/** Size of this item; overrides the group's `size` */
	size?: UiSize;
	/** Corner radius of this item; overrides the group's `rounded`; joined groups keep the group radius on the outer corners, so it shows when the group is spaced */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"button">["class"];
}

export type ToggleGroupProps<T extends ToggleGroupType = "single"> = Props<T>;
export type ToggleGroupItemProps = ItemProps;
