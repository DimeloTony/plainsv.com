import type { Attachment } from "svelte/attachments";
import type { ButtonProps } from "#lib/components/ui/button/index.js";
// The global `Snippet` is not generic, so import the generic type to type the trigger arguments.
import type { Snippet as SvSnippet } from "svelte";

export { default as PromptInput } from "./_.svelte";
export { default as PromptInputTextarea } from "./textarea.svelte";
export { default as PromptInputFiles } from "./files.svelte";
export { default as PromptInputActions } from "./actions.svelte";
export { default as PromptInputButton } from "./button.svelte";
export { default as PromptInputFilesButton } from "./files-button.svelte";
export { default as PromptInputSelect } from "./select.svelte";
export { default as PromptInputSubmit } from "./submit.svelte";
export { PROMPT_INPUT_IMAGE_TYPES } from "./ctx.svelte.js";

/** Text and files sent with the prompt */
export interface PromptInputData {
	/** Typed prompt */
	text: string;
	/** Attached files */
	files: File[];
	/** The form's submit event */
	event: SubmitEvent;
}

/** Chat prompt box with text, attached images, and actions; renders a `form` */
export interface Props extends CompPropsWithChild<"form"> {
	/** The form element; supports `bind:element` */
	element?: HTMLFormElement;
	/** Prompt text; supports `bind:text` */
	text?: string;
	/** Attached files; supports `bind:files` */
	files?: File[];
	/** Whether the prompt is being sent; supports `bind:sending` */
	sending?: boolean;
	/** Called with the text, files, and submit event instead of a native submit; return a promise to stay sending until it settles, and the prompt clears once it resolves */
	onSubmit?: (data: PromptInputData) => void | Promise<unknown>;
	/** Native submit handler; runs first, and calling `preventDefault` stops the send. Without `onSubmit`, the form posts `text` and `files` natively */
	onsubmit?: CompPropsWithChild<"form">["onsubmit"];
	/** Called when a send is blocked, such as text shorter than `minLength` or `canSubmit` set to false */
	onSubmitBlocked?: () => void;
	/** Extra condition for sending, such as being signed in; defaults to `true` */
	canSubmit?: boolean;
	/** Characters the trimmed text needs before it can be sent; defaults to `1` */
	minLength?: number;
	/** Most files that can be attached; defaults to `5` */
	maxFiles?: number;
	/** File types the picker and drop zone accept; defaults to JPEG, PNG, WebP, and GIF images */
	accept?: string[];
	/** Called for a file that is refused for its type or the file limit; shows a toast when omitted */
	onFileReject?: (file: File, reason: "type" | "limit") => void;
	/** localStorage key that keeps an unsent draft between visits; drafts are off when omitted */
	draftKey?: string;
	/** Padding, text, and control size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the box; defaults to `3xl`, with the controls one step below so they read as pills */
	rounded?: UiRounded;
	/** Classes merged onto the form */
	class?: CompPropsWithChild<"form">["class"];
}

/** Auto-growing text field; Enter sends and Shift and Enter adds a line, while touch keyboards always add a line */
export interface TextareaProps extends Omit<CompProps<"textarea">, "value"> {
	/** The textarea element; supports `bind:element` */
	element?: HTMLTextAreaElement;
	/** Form field name of the text in a native submit; defaults to `text` */
	name?: string;
	/** Starts the field one line tall at 1.5rem (24px) and grows 24px per line, whatever the box's `size`; defaults to `false` */
	compact?: boolean;
	/** Classes merged onto the textarea */
	class?: CompProps<"textarea">["class"];
}

/** Hidden file picker and a row of attached images that open in a viewer */
export interface FilesProps extends CompProps<"ul"> {
	/** The hidden file input, which holds the files for a native submit; supports `bind:element` */
	element?: HTMLInputElement;
	/** Form field name of the files in a native submit; defaults to `files` */
	name?: string;
	/** Classes merged onto the row */
	class?: CompProps<"ul">["class"];
}

/** Row of prompt controls */
export interface ActionsProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the row */
	class?: CompPropsWithChild<"div">["class"];
}

/** Button props without the link form, plus the bindable element */
type ButtonAttrs = Partial<Omit<Extract<ButtonProps, { href?: undefined }>, "href">> & {
	/** The button element; supports `bind:element` */
	element?: HTMLButtonElement;
};

/** Pill button for a prompt action; disabled while sending. `size` and `rounded` default to one step below the box */
export type ButtonActionProps = ButtonAttrs;

/** Props a custom trigger spreads onto its element, including the attachment behind `bind:element` */
export interface PromptInputTriggerAttrs {
	/** `button` for the files trigger, `submit` for the send trigger */
	type: "button" | "submit";
	/** Whether the trigger is blocked, such as while sending */
	disabled: boolean;
	/** Accessible name of the trigger */
	"aria-label": string;
	/** Opens the file picker on the files trigger */
	onclick?: (e: MouseEvent & { currentTarget: EventTarget & HTMLElement }) => void;
	/** Shares the element through the part's `bind:element` */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Icon button that opens the file picker; disabled while sending or at the file limit. `size` and `rounded` default to one step below the box */
export type FilesButtonProps = Omit<ButtonAttrs, "element" | "onclick"> & {
	/** The button, or the custom trigger's element; supports `bind:element` */
	element?: HTMLElement;
	/** Called on click before the picker opens; call `preventDefault` to keep it closed */
	onclick?: (e: MouseEvent & { currentTarget: EventTarget & HTMLElement }) => void;
	/** Tooltip text and accessible name; defaults to "Add images" */
	tooltip?: string;
	/** Custom trigger in place of the icon button; spread `props` onto it, and the tooltip still shows */
	trigger?: SvSnippet<[{ props: PromptInputTriggerAttrs }]>;
};

/** Option picker for the prompt, such as the AI model */
export interface SelectProps extends Omit<CompProps<"button">, "name" | "disabled" | "class" | "children"> {
	/** Options to pick from, as value to label */
	options: Record<string, string>;
	/** Picked option; supports `bind:selected`; defaults to the first option */
	selected?: string;
	/** Whether the list is shown; supports `bind:open` */
	open?: boolean;
	/** Name of the hidden form field */
	name?: string;
	/** Blocks form submission until an option is picked; needs `name` */
	required?: boolean;
	/** Blocks picking; also blocked while sending */
	disabled?: boolean;
	/** Called when an option is picked */
	onSelectedChange?: (selected: string) => void;
	/** Called when the list opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** The trigger button; supports `bind:element` */
	element?: HTMLButtonElement;
	/** Visual style of the trigger; defaults to `ghost` */
	variant?: "default" | "secondary" | "ghost";
	/** Trigger height and item size; defaults to one size below the prompt box */
	size?: UiSize;
	/** Corner radius of the trigger, list, and items; defaults to one step below the box's radius, so they read as pills when the box is `2xl` or rounder */
	rounded?: UiRounded;
	/** Text shown before an option is picked */
	placeholder?: string;
	/** Classes merged onto the trigger */
	class?: CompProps<"button">["class"];
}

/** Send button; shows a spinner while sending and stays disabled until the prompt can be sent. `size` and `rounded` default to one step below the box */
export type SubmitProps = Omit<ButtonAttrs, "type" | "children" | "element"> & {
	/** The button, or the custom trigger's element; supports `bind:element` */
	element?: HTMLElement;
	/** Custom icon or label in place of the arrow */
	children?: Snippet;
	/** Custom trigger in place of the send button; spread `props` onto it, and use `sending` and `ready` for its look */
	trigger?: SvSnippet<[{ props: PromptInputTriggerAttrs; sending: boolean; ready: boolean }]>;
};

export type PromptInputProps = Props;
export type PromptInputTextareaProps = TextareaProps;
export type PromptInputFilesProps = FilesProps;
export type PromptInputActionsProps = ActionsProps;
export type PromptInputButtonProps = ButtonActionProps;
export type PromptInputFilesButtonProps = FilesButtonProps;
export type PromptInputSelectProps = SelectProps;
export type PromptInputSubmitProps = SubmitProps;
