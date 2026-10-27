export { default as Textarea } from "./_.svelte";

/** Multi-line text field styled with theme tokens; grows with its content */
export interface Props extends Omit<CompProps<"textarea">, "value"> {
	/** Current value (bindable) */
	value?: CompProps<"textarea">["value"];
	/** Padding, minimum height, and text size on the shared scale */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill and can clip tall text, so use `3xl` or `4xl` to stay round and safe */
	rounded?: UiRounded;
	/** Classes merged onto the textarea */
	class?: CompProps<"textarea">["class"];
}

export type TextareaProps = Props;
