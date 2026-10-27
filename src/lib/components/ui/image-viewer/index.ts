// The global `Snippet` is not generic, so import the generic type to type the trigger argument.
import type { Snippet as SvSnippet } from "svelte";

export { default as ImageViewer } from "./_.svelte";

/** Props the trigger snippet spreads onto its element to open the viewer */
export interface TriggerProps {
	/** Opens the viewer */
	onclick: () => void;
	/** Mirrors the viewer's `disabled` prop */
	disabled?: boolean;
	/** Announces that the trigger opens a dialog */
	"aria-haspopup": "dialog";
}

/** Full-screen image preview with optional title editing and removal */
export interface Props extends Omit<CompProps<"dialog">, "id" | "title" | "open"> {
	/** Element that opens the viewer; spread the given props onto it */
	trigger: SvSnippet<[{ props: TriggerProps }]>;
	/** Image ID passed back to `onTitleChange` and `onRemove` */
	id: string;
	/** Image source URL */
	src: string;
	/** Image title shown in the header and used as the alt text */
	title: string;
	/** Whether the viewer is open (bindable) */
	open?: boolean;
	/** Disables the trigger and the edit, save, and delete buttons */
	disabled?: boolean;
	/** Header and action button size */
	size?: UiSize;
	/** Corner radius of the image panel; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Called with the new title after editing; shows the title header with edit controls */
	onTitleChange?: (data: { id: string; newTitle: string }) => void;
	/** Called with the image ID when the delete button is clicked; shows the title header with a delete button */
	onRemove?: (id: string) => void;
}

export type ImageViewerProps = Props;
export type ImageViewerTriggerProps = TriggerProps;
