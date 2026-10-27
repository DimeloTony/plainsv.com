export { default as NativeSelect } from "./_.svelte";
export { default as NativeSelectOption } from "./option.svelte";
export { default as NativeSelectOptGroup } from "./opt-group.svelte";

/** Native `select` styled like the input, with a chevron */
export interface Props extends Omit<CompPropsWithChild<"select">, "size" | "value"> {
	/** Value of the selected option; supports `bind:value` */
	value?: CompPropsWithChild<"select">["value"];
	/** Height, padding, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the wrapper that holds the select and the chevron */
	class?: CompPropsWithChild<"select">["class"];
}

/** One choice; renders an `option` */
export interface OptionProps extends CompPropsWithChild<"option"> {
	/** Classes merged onto the option */
	class?: CompPropsWithChild<"option">["class"];
}

/** Labeled group of options; renders an `optgroup` */
export interface OptGroupProps extends CompPropsWithChild<"optgroup"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"optgroup">["class"];
}

export type NativeSelectProps = Props;
export type NativeSelectOptionProps = OptionProps;
export type NativeSelectOptGroupProps = OptGroupProps;
