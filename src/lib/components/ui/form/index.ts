import type { z } from "zod";
import type { FormState } from "./state.svelte.js";
import type { FieldProps } from "#lib/components/ui/field/index.js";

export { default as Form } from "./_.svelte";
export { default as FormField } from "./field.svelte";
export { default as FormControl } from "./control.svelte";
export { default as FormLabel } from "./label.svelte";
export { default as FormDescription } from "./description.svelte";
export { default as FormFieldErrors } from "./errors.svelte";
export { createForm, FormState } from "./state.svelte.js";

/** Options for `createForm` */
export interface FormOptions<S extends z.ZodType> {
	/** Values the form starts with; also used by `reset` */
	initial: z.input<S>;
	/** Called with the parsed values when a valid form is submitted; without it, a valid form submits natively */
	onSubmit?: (data: z.output<S>, e: SubmitEvent) => unknown;
}

/** Form element wired to the state; blocks invalid submits */
export interface Props<S extends z.ZodType> extends CompPropsWithChild<"form"> {
	/** State from `createForm` */
	form: FormState<S>;
	/** Classes merged onto the form */
	class?: CompPropsWithChild<"form">["class"];
}

/** One form field; a `Field` that knows its name, ids, and errors */
export interface FieldItemProps<S extends z.ZodType> extends FieldProps {
	/** State from `createForm` */
	form: FormState<S>;
	/** Dotted path of the value, such as `email` or `address.city` */
	name: string;
}

/** Attributes to spread onto the field's control */
export interface ControlAttrs {
	/** Id the label points at */
	id: string;
	/** Name the form submits the value under */
	name: string;
	/** Shows the invalid ring while the field has errors */
	"aria-invalid": boolean | undefined;
	/** Ids of the description and the errors */
	"aria-describedby": string | undefined;
	/** Marks the field as visited when focus leaves it, so its errors show */
	onblur: () => void;
}

/** Hands the control attributes to its child */
export interface ControlProps {
	/** Renders the control; spread `props` onto it */
	children: Snippet<[{ props: ControlAttrs }]>;
}

export type FormProps<S extends z.ZodType> = Props<S>;
export type FormFieldProps<S extends z.ZodType> = FieldItemProps<S>;
export type FormControlProps = ControlProps;
