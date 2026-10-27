import type { ButtonProps } from "#lib/components/ui/button/index.js";
import type { InputProps as BaseInputProps } from "#lib/components/ui/input/index.js";

export { default as Questionnaire } from "./_.svelte";
export { default as QuestionnaireProgress } from "./progress.svelte";
export { default as QuestionnaireItem } from "./item.svelte";
export { default as QuestionnaireTitle } from "./title.svelte";
export { default as QuestionnaireDescription } from "./description.svelte";
export { default as QuestionnaireChoices } from "./choices.svelte";
export { default as QuestionnaireChoice } from "./choice.svelte";
export { default as QuestionnaireChoiceDescription } from "./choice-description.svelte";
export { default as QuestionnaireInput } from "./input.svelte";
export { default as QuestionnaireError } from "./item-error.svelte";
export { default as QuestionnaireActions } from "./actions.svelte";
export { default as QuestionnairePrevious } from "./previous.svelte";
export { default as QuestionnaireSkip } from "./skip.svelte";
export { default as QuestionnaireNext } from "./next.svelte";
export { default as QuestionnaireSubmit } from "./submit.svelte";

/** Whether a question has an answer, was skipped, or has neither */
export type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped";

/** Keys that pick a choice: `letters` for A to Z, `numbers` for 1 to 9 */
export type QuestionnaireShortcutMode = "letters" | "numbers";

/** Position of the active question */
export interface QuestionnaireProgressState {
	/** Number of the active question, starting at 1 */
	current: number;
	/** Number of enabled questions */
	total: number;
	/** Whether the active question is the first */
	first: boolean;
	/** Whether the active question is the last */
	last: boolean;
}

/** Multi-step form that shows one question at a time; renders a `form` */
export interface Props extends CompPropsWithChild<"form"> {
	/** Name of the active question; supports `bind:item` */
	item?: string;
	/** Question to start on when `item` is not set; defaults to the first enabled question */
	defaultItem?: string;
	/** Called with the name of the question that becomes active */
	onItemChange?: (item: string) => void;
	/** Keys that pick a choice in the active question; off when omitted */
	shortcuts?: QuestionnaireShortcutMode;
	/** Text, choice, input, and button size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the choices and inputs; defaults to `lg`, like shadcn. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the form */
	class?: CompPropsWithChild<"form">["class"];
}

/** "Question 1 of 3" label, announced as a progress bar */
export interface ProgressProps extends Omit<CompProps<"div">, "children"> {
	/** Custom label; receives the position of the active question */
	children?: Snippet<[QuestionnaireProgressState]>;
	/** Classes merged onto the label */
	class?: CompProps<"div">["class"];
}

/** One question; renders a `fieldset` that shows only while it is active */
export interface ItemProps extends Omit<CompPropsWithChild<"fieldset">, "name"> {
	/** Unique name of the question, used as the form field name */
	name: string;
	/** Needs an answer to continue; optional questions can be skipped instead */
	required?: boolean;
	/** Lets several choices be picked, as checkboxes instead of radios */
	multiple?: boolean;
	/** Removes the question from the progress, navigation, validation, and submission */
	disabled?: boolean;
	/** Marks the question invalid from your own validation; show the reason in `QuestionnaireError` */
	invalid?: boolean;
	/** Called when the question becomes answered, unanswered, or skipped */
	onStatusChange?: (status: QuestionnaireItemStatus) => void;
	/** Classes merged onto the fieldset */
	class?: CompPropsWithChild<"fieldset">["class"];
}

/** Question text; renders the fieldset's `legend` */
export interface TitleProps extends CompPropsWithChild<"legend"> {
	/** Classes merged onto the legend */
	class?: CompPropsWithChild<"legend">["class"];
}

/** Muted hint under the title, linked to the question with `aria-describedby` */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the paragraph */
	class?: CompPropsWithChild<"p">["class"];
}

/** Column of choices */
export interface ChoicesProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the column */
	class?: CompPropsWithChild<"div">["class"];
}

/** One answer; a radio, or a checkbox when the question allows several */
export interface ChoiceProps extends Omit<CompPropsWithChild<"label">, "onchange"> {
	/** Value submitted for the question when this choice is picked */
	value: string;
	/** Whether the choice is picked; supports `bind:checked` */
	checked?: boolean;
	/** Picks the choice at the start, and again on reset */
	defaultChecked?: boolean;
	/** Blocks picking the choice; shortcuts skip it */
	disabled?: boolean;
	/** Called when the choice is picked or cleared; call `preventDefault` to keep the answer as it is */
	onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
	/** Corner radius of this choice; overrides the questionnaire's `rounded`. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"label">["class"];
}

/** Muted second line inside a choice */
export interface ChoiceDescriptionProps extends CompPropsWithChild<"span"> {
	/** Classes merged onto the text */
	class?: CompPropsWithChild<"span">["class"];
}

/** Free-text answer; give it a label or `aria-label`, since a placeholder is not a label */
export type InputProps = Omit<BaseInputProps, "size" | "rounded" | "name" | "form" | "files" | "value" | "type"> & {
	/** Typed answer; supports `bind:value` */
	value?: string;
	/** Answer at the start, and again on reset */
	defaultValue?: string;
	/** Kind of text the field takes; defaults to `text` */
	type?: "date" | "datetime-local" | "email" | "month" | "number" | "password" | "search" | "tel" | "text" | "time" | "url" | "week";
};

/** Message shown only while its question is invalid */
export interface ErrorProps extends Omit<CompProps<"p">, "children"> {
	/** Custom message; defaults to a prompt to answer or skip */
	children?: Snippet;
	/** Classes merged onto the message */
	class?: CompProps<"p">["class"];
}

/** Row that holds the navigation buttons */
export interface ActionsProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the row */
	class?: CompPropsWithChild<"div">["class"];
}

/** Navigation button; shows only when its action applies to the active question */
export type ActionProps = Partial<Omit<Extract<ButtonProps, { href?: undefined }>, "href" | "type">>;

export type QuestionnaireProps = Props;
export type QuestionnaireProgressProps = ProgressProps;
export type QuestionnaireItemProps = ItemProps;
export type QuestionnaireTitleProps = TitleProps;
export type QuestionnaireDescriptionProps = DescriptionProps;
export type QuestionnaireChoicesProps = ChoicesProps;
export type QuestionnaireChoiceProps = ChoiceProps;
export type QuestionnaireChoiceDescriptionProps = ChoiceDescriptionProps;
export type QuestionnaireInputProps = InputProps;
export type QuestionnaireErrorProps = ErrorProps;
export type QuestionnaireActionsProps = ActionsProps;
export type QuestionnaireActionProps = ActionProps;
