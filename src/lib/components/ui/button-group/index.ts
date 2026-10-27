export { default as ButtonGroup } from "./_.svelte";
export { default as ButtonGroupSeparator } from "./separator.svelte";
export { default as ButtonGroupText } from "./text.svelte";

/** Row or column of buttons, inputs, and selects joined into one control */
export interface Props extends CompPropsWithChild<"div"> {
	/** Direction the children are joined in; defaults to `horizontal` */
	orientation?: "horizontal" | "vertical";
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Line between joined children that share a fill, such as two default buttons */
export interface SeparatorProps extends CompProps<"div"> {
	/** Matches the group direction; `vertical` for a horizontal group; defaults to `vertical` */
	orientation?: "horizontal" | "vertical";
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

/** Bordered text joined with the other children, such as a unit or a prefix */
export interface TextProps extends CompPropsWithChild<"div"> {
	/** Height, padding, and text size on the shared scale; match it to the buttons; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the text */
	class?: CompPropsWithChild<"div">["class"];
}

export type ButtonGroupProps = Props;
export type ButtonGroupSeparatorProps = SeparatorProps;
export type ButtonGroupTextProps = TextProps;
