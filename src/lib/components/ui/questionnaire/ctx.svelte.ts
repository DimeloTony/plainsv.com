import { setContext, getContext, tick, untrack } from "svelte";
import type { Props, QuestionnaireItemStatus, QuestionnaireShortcutMode } from "./index.js";

const CONTEXT_ID = "questionnaire-context";
const ITEM_CONTEXT_ID = "questionnaire-item-context";
// Input types where the arrow and letter keys move the caret or type, so the questionnaire leaves them alone.
const NON_TEXT_INPUT_TYPES = ["button", "checkbox", "radio", "reset", "submit"];

/** Whether the element takes typed text, such as a text field. */
const isTextField = (element: EventTarget | null) => {
	if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true;
	if (element instanceof HTMLInputElement) return !NON_TEXT_INPUT_TYPES.includes(element.type);
	return element instanceof HTMLElement && element.isContentEditable;
};

/** Keys that pick a choice in the given mode, in order. */
const getShortcutKeys = (mode: QuestionnaireShortcutMode | null) => {
	if (mode === "letters") return Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
	if (mode === "numbers") return Array.from({ length: 9 }, (_, index) => String(index + 1));
	return [];
};

class UseCompCtx {
	/** Name of the active question */
	activeName = $state("");
	/** Keys that pick a choice, or null when shortcuts are off */
	shortcuts: QuestionnaireShortcutMode | null = $state(null);
	/** Size shared by the choices, inputs, and buttons */
	size: UiSize = $state("md");
	/** Corner radius of the choices and inputs */
	rounded: UiRounded = $state("lg");
	/** Form element, for submitting from the keyboard */
	formEl?: HTMLFormElement = $state();
	/** Questions in the order they registered */
	items: UseItemCtx[] = $state.raw([]);
	/** Called with the name of the question that becomes active */
	onItemChange?: Props["onItemChange"];
	/** Questions in page order, without the disabled ones */
	enabledItems = $derived.by(() => {
		const ordered = [...this.items].sort((a, b) => (a.element && b.element ? (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1) : 0));
		return ordered.filter((item) => !item.disabled);
	});
	/** The active question; the first enabled one when the name matches none */
	activeItem = $derived(this.enabledItems.find((item) => item.name === this.activeName) ?? this.enabledItems[0]);
	/** Position of the active question */
	progress = $derived.by(() => {
		const index = this.activeItem ? this.enabledItems.indexOf(this.activeItem) : -1;
		const total = this.enabledItems.length;
		return { current: index + 1, total, first: index === 0, last: total > 0 && index === total - 1 };
	});

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Adds a question, and returns a function that removes it. */
	registerItem(item: UseItemCtx) {
		// Untracked: it runs while the parent renders, so reading the list there would re-run that render in a loop.
		untrack(() => (this.items = [...this.items, item]));
		return () => (this.items = this.items.filter((other) => other !== item));
	}

	/** Makes a question active, then focuses it, or its first answer when it is invalid. */
	async goTo(item: UseItemCtx, focus: "item" | "invalid" = "item") {
		if (item !== this.activeItem) {
			this.activeName = item.name;
			this.onItemChange?.(item.name);
		}
		// Wait for the question to show before moving focus into it.
		await tick();
		if (focus === "invalid") item.focusInvalid();
		else item.element?.focus();
	}

	/** Goes back one question. */
	goPrevious() {
		const index = this.progress.current - 1;
		if (index > 0) void this.goTo(this.enabledItems[index - 1]);
	}

	/** Checks the active question, then goes forward one question. */
	goNext() {
		const item = this.activeItem;
		// If there is no question after this one: stay.
		if (!item || this.progress.last) return;
		// If the question needs an answer: show the error and focus the first answer.
		if (!item.validate()) return item.focusInvalid();
		void this.goTo(this.enabledItems[this.progress.current]);
	}

	/** Checks the active question, then goes forward, or submits on the last question. */
	continue() {
		const item = this.activeItem;
		if (!item) return;
		if (!item.validate()) return item.focusInvalid();
		if (this.progress.last) this.formEl?.requestSubmit();
		else void this.goTo(this.enabledItems[this.progress.current]);
	}

	/** Skips the active optional question, then goes forward, or submits on the last question. */
	skipCurrent() {
		const item = this.activeItem;
		// If there is no question or it needs an answer: it cannot be skipped.
		if (!item || item.required) return;
		item.skip();
		if (!this.progress.last) return void this.goTo(this.enabledItems[this.progress.current]);
		// Submit once the skipped answers have left the form.
		void tick().then(() => this.formEl?.requestSubmit());
	}

	/** Blocks submitting until every question is valid, then lets the submit through. */
	handleSubmit(e: SubmitEvent) {
		const invalidItem = this.enabledItems.find((item) => !item.validate());
		// If a question is not valid: stay on the form and open that question.
		if (!invalidItem) return true;
		e.preventDefault();
		void this.goTo(invalidItem, "invalid");
		return false;
	}

	/** Restores every question's default answers and opens the starting question. */
	reset(defaultItem?: string) {
		for (const item of this.items) item.reset();
		const start = this.enabledItems.find((item) => item.name === defaultItem) ?? this.enabledItems[0];
		if (start) void this.goTo(start);
	}

	/** Handles the questionnaire keys: arrows, Enter, Cmd or Ctrl and Enter, and choice shortcuts. */
	handleKeydown(e: KeyboardEvent) {
		const item = this.activeItem;
		// If another handler took the key, text is being composed, or there is no question: leave it.
		if (e.defaultPrevented || e.isComposing || !item || !(e.target instanceof Element)) return;
		const target = e.target;
		// Cmd or Ctrl and Enter continues from anywhere in the question.
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
			e.preventDefault();
			if (!e.repeat) this.continue();
			return;
		}
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		// Up and down move between the answers.
		if ((e.key === "ArrowUp" || e.key === "ArrowDown") && item.moveAnswerFocus(target, e.key === "ArrowDown" ? 1 : -1)) {
			e.preventDefault();
			return;
		}
		// Left and right move between questions, unless they would move a caret or a radio selection.
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !isTextField(target) && !(target instanceof HTMLInputElement && target.type === "radio")) {
			e.preventDefault();
			if (e.repeat) return;
			if (e.key === "ArrowLeft") this.goPrevious();
			else if (item.status !== "unanswered") this.goNext();
			return;
		}
		// Enter on an answer continues once that answer is picked or filled.
		if (e.key === "Enter") {
			const answer = item.getAnswerElement(target);
			if (!answer) return;
			e.preventDefault();
			if (!e.repeat && item.isAnswerFilled(answer)) this.continue();
			return;
		}
		// A shortcut key picks its choice, unless the key is typing into a field.
		if (!this.shortcuts || isTextField(target) || e.key.length !== 1) return;
		const key = this.shortcuts === "letters" ? e.key.toUpperCase() : e.key;
		const choice = item.getChoiceByShortcut(key);
		if (!choice) return;
		e.preventDefault();
		if (e.repeat) return;
		choice.focus();
		choice.click();
	}
}

class UseItemCtx {
	/** Unique name of the question */
	name = $state("");
	/** Whether the question needs an answer */
	required = $state(false);
	/** Whether several choices can be picked */
	multiple = $state(false);
	/** Whether the question is left out of the questionnaire */
	disabled = $state(false);
	/** Invalid state set from outside validation */
	invalidProp = $state(false);
	/** Unique prefix for the ids of the question's parts */
	baseId = $state("");
	/** The fieldset */
	element?: HTMLFieldSetElement = $state();
	/** Answers in the order they registered */
	answers: Answer[] = $state.raw([]);
	/** Ids of the picked choices and filled inputs */
	selectedIds: string[] = $state([]);
	/** Whether the question was skipped */
	skipped = $state(false);
	/** Whether validation ran, so errors only show after an attempt to continue */
	attempted = $state(false);
	/** Ids of the descriptions, for `aria-describedby` */
	descriptionIds: string[] = $state([]);
	/** Ids of the error messages, for `aria-describedby` while invalid */
	errorIds: string[] = $state([]);
	/** The questionnaire this question belongs to */
	root?: UseCompCtx;
	/** Ids picked at the start, restored on reset */
	defaultIds: string[] = [];
	/** Answers that are not disabled */
	enabledAnswers = $derived(this.answers.filter((answer) => !answer.disabled));
	/** Whether the question is answered, unanswered, or skipped */
	status: QuestionnaireItemStatus = $derived(this.skipped ? "skipped" : this.enabledAnswers.some((answer) => this.selectedIds.includes(answer.id)) ? "answered" : "unanswered");
	/** Whether the question can be left: answered, skipped while optional, or disabled */
	isValid = $derived(this.disabled || (this.skipped && !this.required) || (!this.invalidProp && this.status === "answered"));
	/** Whether to show the question as invalid */
	isInvalid = $derived(!this.disabled && !(this.skipped && !this.required) && (this.invalidProp || (this.attempted && !this.isValid)));
	/** Whether this is the active question */
	isActive = $derived(!this.disabled && this.root?.activeItem === this);
	/** Shortcut key of each enabled choice, in order */
	shortcutById = $derived.by(() => {
		const keys = getShortcutKeys(this.root?.shortcuts ?? null);
		const choices = this.enabledAnswers.filter((answer) => answer.kind === "choice");
		return new Map(choices.slice(0, keys.length).map((choice, index) => [choice.id, keys[index]]));
	});

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Adds an answer, picked at the start when `selected` is set, and returns a function that removes it. */
	registerAnswer(answer: Answer, selected: boolean) {
		// Untracked: it runs while the question renders, so reading the lists there would re-run that render in a loop.
		untrack(() => {
			this.answers = [...this.answers, answer];
			if (!selected) return;
			this.defaultIds = this.multiple ? [...this.defaultIds, answer.id] : [answer.id];
			this.selectedIds = [...this.defaultIds];
		});
		return () => {
			this.answers = this.answers.filter((other) => other !== answer);
			this.defaultIds = this.defaultIds.filter((id) => id !== answer.id);
			if (this.selectedIds.includes(answer.id)) this.selectedIds = this.selectedIds.filter((id) => id !== answer.id);
		};
	}

	/** Picks or clears an answer; picking one clears a skip, and a single-answer question keeps only the newest pick. */
	select(id: string, selected: boolean) {
		const isSelected = this.selectedIds.includes(id);
		// If the answer is already in that state: nothing changes.
		if (selected === isSelected) return;
		if (!selected) return void (this.selectedIds = this.selectedIds.filter((other) => other !== id));
		this.skipped = false;
		this.selectedIds = this.multiple ? [...this.selectedIds, id] : [id];
	}

	/** Marks the question as tried, and returns whether it can be left. */
	validate() {
		this.attempted = true;
		return this.isValid;
	}

	/** Clears the answers and marks an optional question as skipped. */
	skip() {
		if (this.required) return;
		this.selectedIds = [];
		this.skipped = true;
	}

	/** Restores the default answers and clears the skip and validation state. */
	reset() {
		this.attempted = false;
		this.skipped = false;
		this.selectedIds = [...this.defaultIds];
		for (const answer of this.answers) answer.reset?.();
	}

	/** Focuses the picked or filled answer, the first answer, or the question itself. */
	focusInvalid() {
		const answers = this.enabledAnswers.map((answer) => this.getElement(answer.id)).filter((element) => element !== null);
		const filled = answers.find((element) => this.isAnswerFilled(element));
		(filled ?? answers[0] ?? this.element)?.focus();
	}

	/** Finds the input element of an answer by its id. */
	getElement(id: string) {
		return this.element?.querySelector<HTMLInputElement>(`#${CSS.escape(id)}`) ?? null;
	}

	/** Returns the target when it is one of the question's enabled answers. */
	getAnswerElement(target: Element) {
		return this.enabledAnswers.some((answer) => answer.id === target.id) && target instanceof HTMLInputElement ? target : null;
	}

	/** Whether an answer element is a picked choice or a filled input. */
	isAnswerFilled(element: HTMLInputElement) {
		if (element.type === "checkbox" || element.type === "radio") return element.checked;
		return this.selectedIds.includes(element.id) && element.value.trim().length > 0;
	}

	/** Finds the choice input for a shortcut key. */
	getChoiceByShortcut(key: string) {
		const id = [...this.shortcutById].find(([, shortcut]) => shortcut === key)?.[0];
		return id ? this.getElement(id) : null;
	}

	/** Moves focus to the next or previous answer, wrapping at the ends; returns whether it moved. */
	moveAnswerFocus(target: Element, step: 1 | -1) {
		const elements = this.enabledAnswers.map((answer) => this.getElement(answer.id)).filter((element) => element !== null);
		const index = elements.findIndex((element) => element === target);
		// If the target is not an answer or the question itself, or is a field with text in it: leave the key alone.
		if (!elements.length || (index < 0 && target !== this.element)) return false;
		if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && isTextField(target) && target.value.trim().length > 0) return false;
		const next = index < 0 ? (elements.find((element) => this.isAnswerFilled(element)) ?? (step === 1 ? elements[0] : elements.at(-1))) : elements[(index + step + elements.length) % elements.length];
		// Between two radios, the browser's own arrow keys already move and pick.
		if (!next || next === target || (index >= 0 && target instanceof HTMLInputElement && target.type === "radio" && next.type === "radio")) return false;
		next.focus();
		if (next.type === "radio") next.click();
		return true;
	}

	/** Records a description id, and returns a function that removes it. */
	registerDescription(id: string) {
		// Untracked, so the effect that calls this does not depend on the list it changes.
		untrack(() => (this.descriptionIds = [...this.descriptionIds, id]));
		return () => (this.descriptionIds = this.descriptionIds.filter((other) => other !== id));
	}

	/** Records an error id, and returns a function that removes it. */
	registerError(id: string) {
		// Untracked, so the effect that calls this does not depend on the list it changes.
		untrack(() => (this.errorIds = [...this.errorIds, id]));
		return () => (this.errorIds = this.errorIds.filter((other) => other !== id));
	}
}

/** One answer control registered with its question */
export interface Answer {
	/** Id of the answer's input element */
	id: string;
	/** A choice or a typed answer */
	kind: "choice" | "input";
	/** Whether the answer is disabled */
	readonly disabled: boolean;
	/** Restores the answer's own default, such as an input's text */
	reset?: () => void;
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "activeName" | "shortcuts" | "size" | "rounded" | "onItemChange">;
export type ItemCtxProps = Pick<InstanceType<typeof UseItemCtx>, "name" | "required" | "multiple" | "disabled" | "invalidProp" | "baseId">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

/** Creates the question's state, linked to its questionnaire. */
export const setItemCtx = (props: ItemCtxProps) => {
	const item = new UseItemCtx(props);
	item.root = useCompCtx();
	return setContext(ITEM_CONTEXT_ID, item);
};

export const useItemCtx = () => getContext<ReturnType<typeof setItemCtx>>(ITEM_CONTEXT_ID);
