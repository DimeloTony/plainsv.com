export { default as Checkbox } from "./_.svelte";

/** Checked, unchecked, or mixed toggle; renders a `button` with `role="checkbox"` */
export interface Props extends CompProps<"button"> {
	/** Whether the checkbox is checked; supports `bind:checked` */
	checked?: boolean;
	/** Starting state when `checked` is not set; defaults to `false` */
	defaultChecked?: boolean;
	/** Shows the mixed state, such as for a partly selected group; cleared on the next toggle and supports `bind:indeterminate` */
	indeterminate?: boolean;
	/** Called with the new state when the checkbox is toggled */
	onCheckedChange?: (checked: boolean) => void;
	/** Form field name; submits `value` while the checkbox is checked */
	name?: string;
	/** Value submitted with the form while checked; defaults to `"on"` */
	value?: string;
	/** Color of the box while checked or mixed */
	variant?: "default" | "destructive";
	/** Box and icon size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the box; a small radius scaled to the box when omitted, like shadcn */
	rounded?: UiRounded;
	/** Classes merged onto the checkbox */
	class?: CompProps<"button">["class"];
}

export type CheckboxProps = Props;
