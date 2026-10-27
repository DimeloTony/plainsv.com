import type { ButtonProps as BaseButtonProps } from "#lib/components/ui/button/index.js";

export { default as InputGroup } from "./_.svelte";
export { default as InputGroupInput } from "./input.svelte";
export { default as InputGroupTextarea } from "./textarea.svelte";
export { default as InputGroupAddon } from "./addon.svelte";
export { default as InputGroupButton } from "./button.svelte";
export { default as InputGroupText } from "./text.svelte";

/** Bordered field that joins an input or textarea with icons, text, and buttons */
export interface Props extends CompPropsWithChild<"div"> {
	/** Height, padding, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill, so use `3xl` or `4xl` when the group stacks or holds a textarea */
	rounded?: UiRounded;
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Borderless input that fills the group */
export interface InputProps extends Omit<CompProps<"input">, "size" | "value"> {
	/** Current value; supports `bind:value` */
	value?: CompProps<"input">["value"];
	/** Classes merged onto the input */
	class?: CompProps<"input">["class"];
}

/** Borderless textarea that fills the group and grows with its content */
export interface TextareaProps extends Omit<CompProps<"textarea">, "value"> {
	/** Current value; supports `bind:value` */
	value?: CompProps<"textarea">["value"];
	/** Classes merged onto the textarea */
	class?: CompProps<"textarea">["class"];
}

/** Icons, text, or buttons beside or above the input; clicking it focuses the input */
export interface AddonProps extends CompPropsWithChild<"div"> {
	/** `inline-start` and `inline-end` sit beside the input; `block-start` and `block-end` sit above and below it; defaults to `inline-start` */
	align?: "inline-start" | "inline-end" | "block-start" | "block-end";
	/** Classes merged onto the addon */
	class?: CompPropsWithChild<"div">["class"];
}

/** Compact ghost button for an addon; defaults to `type="button"`, `variant="ghost"`, and `size="xs"` */
export type ButtonProps = BaseButtonProps;

/** Muted text or icons in an addon */
export interface TextProps extends CompPropsWithChild<"span"> {
	/** Classes merged onto the text */
	class?: CompPropsWithChild<"span">["class"];
}

export type InputGroupProps = Props;
export type InputGroupInputProps = InputProps;
export type InputGroupTextareaProps = TextareaProps;
export type InputGroupAddonProps = AddonProps;
export type InputGroupButtonProps = ButtonProps;
export type InputGroupTextProps = TextProps;
