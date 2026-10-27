export { default as Label } from "./_.svelte";

/** Accessible caption for a form control */
export interface Props extends CompPropsWithChild<"label"> {
	/** Text size on the shared scale */
	size?: UiSize;
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"label">["class"];
}

export type LabelProps = Props;
