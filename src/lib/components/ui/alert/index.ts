export { default as Alert } from "./_.svelte";
export { default as AlertTitle } from "./title.svelte";
export { default as AlertDescription } from "./description.svelte";
export { default as AlertAction } from "./action.svelte";

/** Alert root that holds an optional icon, the title, description, and action */
export interface Props extends CompPropsWithChild<"div"> {
	/** Visual style of the alert */
	variant?: "default" | "destructive";
	/** Padding, gap, text, and icon size on the shared scale; defaults to `lg` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the alert */
	class?: CompPropsWithChild<"div">["class"];
}

/** Alert heading text */
export interface TitleProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"div">["class"];
}

/** Supporting text under the title; may hold paragraphs */
export interface DescriptionProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"div">["class"];
}

/** Trailing content, such as a button */
export interface ActionProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the action */
	class?: CompPropsWithChild<"div">["class"];
}

export type AlertProps = Props;
export type AlertTitleProps = TitleProps;
export type AlertDescriptionProps = DescriptionProps;
export type AlertActionProps = ActionProps;
