export { default as Input } from "./_.svelte";

/** Text field styled with theme tokens; renders a file picker when `type="file"` */
export interface Props extends Omit<CompProps<"input">, "size" | "value" | "files"> {
	/** Current value (bindable) */
	value?: CompProps<"input">["value"];
	/** Selected files when `type="file"` (bindable) */
	files?: FileList | null;
	/** Height, padding, and text size on the shared scale */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the input */
	class?: CompProps<"input">["class"];
}

export type InputProps = Props;
