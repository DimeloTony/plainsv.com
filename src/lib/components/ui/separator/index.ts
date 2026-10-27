export { default as Separator } from "./_.svelte";

/** Thin line that divides content horizontally or vertically */
export interface Props extends CompProps<"div"> {
	/** Direction of the line; `vertical` stretches to the height of a flex row; defaults to `horizontal` */
	orientation?: "horizontal" | "vertical";
	/** Hides the line from screen readers when it is only visual; set `false` to announce it as a separator; defaults to `true` */
	decorative?: boolean;
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

export type SeparatorProps = Props;
