export { default as Toggle } from "./_.svelte";

/** Two-state button that stays pressed until clicked again; renders a `button` with `aria-pressed` */
export interface Props extends CompPropsWithChild<"button"> {
	/** Whether the toggle is pressed; supports `bind:pressed` */
	pressed?: boolean;
	/** Starting state when `pressed` is not set; defaults to `false` */
	defaultPressed?: boolean;
	/** Called with the new state when the toggle is pressed or released */
	onPressedChange?: (pressed: boolean) => void;
	/** `default` is transparent until pressed; `outline` adds a border */
	variant?: "default" | "outline";
	/** Height, padding, text, and icon size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the toggle */
	class?: CompPropsWithChild<"button">["class"];
}

export type ToggleProps = Props;
