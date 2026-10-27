export { default as Field } from "./_.svelte";
export { default as FieldSet } from "./field-set.svelte";
export { default as FieldLegend } from "./legend.svelte";
export { default as FieldGroup } from "./group.svelte";
export { default as FieldContent } from "./content.svelte";
export { default as FieldLabel } from "./label.svelte";
export { default as FieldTitle } from "./title.svelte";
export { default as FieldDescription } from "./description.svelte";
export { default as FieldSeparator } from "./separator.svelte";
export { default as FieldError } from "./field-error.svelte";

/** One error, such as a zod issue; only `message` is shown */
export interface FieldErrorItem {
	/** Text shown to the user */
	message?: string;
}

/** One form control with its label, description, and error */
export interface Props extends CompPropsWithChild<"div"> {
	/** `vertical` stacks the label above the control; `horizontal` places them side by side; `responsive` switches to a row when the `FieldGroup` is wide enough; defaults to `vertical` */
	orientation?: "vertical" | "horizontal" | "responsive";
	/** Colors the label and error in the destructive color */
	invalid?: boolean;
	/** Dims the label and description */
	disabled?: boolean;
	/** Classes merged onto the field */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group of related fields with a legend; renders a `fieldset` */
export interface SetProps extends CompPropsWithChild<"fieldset"> {
	/** Classes merged onto the fieldset */
	class?: CompPropsWithChild<"fieldset">["class"];
}

/** Heading of a `FieldSet`; renders a `legend` */
export interface LegendProps extends CompPropsWithChild<"legend"> {
	/** `legend` is a section heading; `label` matches the field label size */
	variant?: "legend" | "label";
	/** Classes merged onto the legend */
	class?: CompPropsWithChild<"legend">["class"];
}

/** Stack of fields; a container that responsive fields measure */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Label and description beside a control in a horizontal field */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** Label for the field's control; wrap a whole `Field` in it to make a selectable card */
export interface LabelProps extends CompPropsWithChild<"label"> {
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"label">["class"];
}

/** Title styled like the label, for content that is not a label, such as inside a selectable card */
export interface TitleProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"div">["class"];
}

/** Muted helper text; links inside are underlined */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Line between fields, with optional text in the middle */
export interface SeparatorProps extends CompProps<"div"> {
	/** Text shown in the middle of the line, such as "Or continue with" */
	children?: Snippet;
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

/** Error message announced to screen readers; renders nothing without errors */
export interface ErrorProps extends CompProps<"div"> {
	/** Errors to list, such as zod issues; repeated messages are shown once */
	errors?: (FieldErrorItem | undefined)[];
	/** Custom error content in place of `errors` */
	children?: Snippet;
	/** Classes merged onto the error */
	class?: CompProps<"div">["class"];
}

export type FieldProps = Props;
export type FieldSetProps = SetProps;
export type FieldLegendProps = LegendProps;
export type FieldGroupProps = GroupProps;
export type FieldContentProps = ContentProps;
export type FieldLabelProps = LabelProps;
export type FieldTitleProps = TitleProps;
export type FieldDescriptionProps = DescriptionProps;
export type FieldSeparatorProps = SeparatorProps;
export type FieldErrorProps = ErrorProps;
