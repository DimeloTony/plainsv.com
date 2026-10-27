export { default as InputOTP } from "./_.svelte";
export { default as InputOTPGroup } from "./group.svelte";
export { default as InputOTPSlot } from "./slot.svelte";
export { default as InputOTPSeparator } from "./separator.svelte";
export { REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS } from "./patterns.js";

/** One-time code field; a transparent native input over the slots takes typing, pasting, and autofill */
export interface Props extends Omit<CompProps<"input">, "size" | "value" | "type" | "maxlength" | "pattern" | "class"> {
	/** Characters entered so far; supports `bind:value` */
	value?: string;
	/** Number of characters the code needs; match it to the number of slots */
	maxlength: number;
	/** Regular expression source the whole value must match; defaults to `REGEXP_ONLY_DIGITS` */
	pattern?: string;
	/** Called with the new value when it changes */
	onValueChange?: (value: string) => void;
	/** Called with the value once every slot is filled */
	onComplete?: (value: string) => void;
	/** Slot size, gap, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of each group's outer slots; follows `size` when omitted */
	rounded?: UiRounded;
	/** Groups, slots, and separators */
	children: Snippet;
	/** Classes merged onto the root container */
	class?: CompProps<"div">["class"];
}

/** Row of joined slots */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Box that shows the character at `index` */
export interface SlotProps extends CompProps<"div"> {
	/** Position of the character in the value, starting at 0 */
	index: number;
	/** Size of this slot; overrides the input's `size` */
	size?: UiSize;
	/** Corner radius of this slot's outer corners; overrides the input's `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the slot */
	class?: CompProps<"div">["class"];
}

/** Divider between groups; renders a dash by default */
export interface SeparatorProps extends CompProps<"div"> {
	/** Custom divider content in place of the dash */
	children?: Snippet;
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

export type InputOTPProps = Props;
export type InputOTPGroupProps = GroupProps;
export type InputOTPSlotProps = SlotProps;
export type InputOTPSeparatorProps = SeparatorProps;
