import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as AlertDialog } from "./_.svelte";
export { default as AlertDialogTrigger } from "./trigger.svelte";
export { default as AlertDialogContent } from "./content.svelte";
export { default as AlertDialogHeader } from "./header.svelte";
export { default as AlertDialogTitle } from "./title.svelte";
export { default as AlertDialogDescription } from "./description.svelte";
export { default as AlertDialogFooter } from "./footer.svelte";
export { default as AlertDialogAction } from "./action.svelte";
export { default as AlertDialogCancel } from "./cancel.svelte";

/** Alert dialog settings shared with every part */
interface AlertDialogOptions {
	/** Whether the alert dialog is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the alert dialog opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Padding, text, width, and radius of the panel on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the panel; defaults to `lg` at every size. `pill` is a true pill and can clip tall content, so use `3xl` or `4xl` to stay round and safe */
	rounded?: UiRounded;
}

/** Alert dialog props; renders no element of its own */
export type Props = CompPropsWithChildSimple<AlertDialogOptions>;

/** Alert dialog trigger props; renders an outline button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Style of the default trigger button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Custom trigger; spread `props` onto the element that opens the alert dialog */
	trigger?: Snippet<[{ props: { "aria-haspopup": "dialog"; onclick: () => void } }]>;
	/** Size of the default trigger button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Panel shown in the modal while the alert dialog is open */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Holds the title and description */
export interface HeaderProps extends CompPropsWithChild<"header"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"header">["class"];
}

/** Heading that names the alert dialog */
export interface TitleProps extends CompPropsWithChild<"h2"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"h2">["class"];
}

/** Muted text that describes the alert dialog */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Holds the cancel and action buttons */
export interface FooterProps extends CompPropsWithChild<"footer"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"footer">["class"];
}

/** Button that confirms the action and closes the alert dialog */
export interface ActionProps extends CompPropsWithChild<"button"> {
	/** Button style; defaults to `default`, or set `destructive` for actions that delete data */
	variant?: ButtonProps["variant"];
	/** Button size; follows the alert dialog size when omitted */
	size?: ButtonProps["size"];
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the button */
	class?: CompPropsWithChild<"button">["class"];
}

/** Button that dismisses the alert dialog; focused when it opens */
export interface CancelProps extends CompPropsWithChild<"button"> {
	/** Button style; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Button size; follows the alert dialog size when omitted */
	size?: ButtonProps["size"];
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the button */
	class?: CompPropsWithChild<"button">["class"];
}

export type AlertDialogProps = Props;
export type AlertDialogTriggerProps = TriggerProps;
export type AlertDialogContentProps = ContentProps;
export type AlertDialogHeaderProps = HeaderProps;
export type AlertDialogTitleProps = TitleProps;
export type AlertDialogDescriptionProps = DescriptionProps;
export type AlertDialogFooterProps = FooterProps;
export type AlertDialogActionProps = ActionProps;
export type AlertDialogCancelProps = CancelProps;
