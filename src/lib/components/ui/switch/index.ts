export { default as Switch } from "./_.svelte";

/** On and off toggle; renders a `button` with `role="switch"` */
export interface Props extends CompProps<"button"> {
	/** Whether the switch is on; supports `bind:checked` */
	checked?: boolean;
	/** Starting state when `checked` is not set; defaults to `false` */
	defaultChecked?: boolean;
	/** Called with the new state when the switch is toggled */
	onCheckedChange?: (checked: boolean) => void;
	/** Form field name; submits `value` while the switch is on */
	name?: string;
	/** Value submitted with the form while on; defaults to `"on"` */
	value?: string;
	/** Color of the track while on */
	variant?: "default" | "destructive";
	/** Switch size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the track and thumb; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the switch */
	class?: CompProps<"button">["class"];
}

export type SwitchProps = Props;
