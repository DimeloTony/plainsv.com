import type { ButtonProps } from "#lib/components/ui/button/index.js";
export { default as Dialog } from "./_.svelte";
export { default as DialogTrigger } from "./trigger.svelte";
export { default as DialogContent } from "./content.svelte";

/** Dialog trigger props; renders a default button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the dialog */
	trigger?: Snippet<[{ props: { onclick: () => void } }]>;
	/** Style of the default trigger button; defaults to `default` */
	variant?: ButtonProps["variant"];
	/** Size of the default trigger button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Panel of the dialog; `class` and other attributes go on the panel, such as a width or `padding: 0` */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Dialog props; renders a modal `<dialog>` while open */
export interface Props extends CompProps<"dialog"> {
	/** Whether the dialog is shown; supports `bind:open` */
	open?: boolean;
	/** Visual style of the content panel */
	variant?: "default" | "secondary" | "outline" | "ghost";
	/** Padding, text, and radius of the content panel on the shared scale; defaults to `lg`, like shadcn */
	size?: UiSize;
	/** Corner radius of the content panel; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** The `DialogTrigger` and `DialogContent` parts */
	children: Snippet;
}

export type DialogProps = Props;
export type DialogTriggerProps = TriggerProps;
export type DialogContentProps = ContentProps;
