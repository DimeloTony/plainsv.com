import { tick } from "svelte";
import type { z } from "zod";
import type { FieldErrorItem } from "#lib/components/ui/field/index.js";
import type { FormOptions } from "./index.js";

/** Values, validation, and submission for a form checked by a zod schema */
export class FormState<S extends z.ZodType> {
	/** Current values; bind controls to its fields, such as `bind:value={form.values.email}` */
	values: z.input<S>;
	/** Fields the user has left at least once, by name */
	touched: Record<string, boolean> = $state({});
	/** Whether the user has tried to submit, which shows every error */
	submitted = $state(false);
	/** Whether `onSubmit` is running */
	submitting = $state(false);
	/** Schema the values are checked against */
	#schema: S;
	/** Values the form started with, for `reset` */
	#initial: z.input<S>;
	/** Called with the parsed values when a valid form is submitted */
	#onSubmit: FormOptions<S>["onSubmit"];

	/** Result of checking the current values */
	result = $derived.by(() => this.#schema.safeParse(this.values));
	/** Every error message, by dotted field path; form-level errors use an empty path */
	errors: Record<string, FieldErrorItem[]> = $derived.by(() => {
		const errors: Record<string, FieldErrorItem[]> = {};
		for (const issue of this.result.error?.issues ?? []) {
			const path = issue.path.map(String).join(".");
			(errors[path] ??= []).push({ message: issue.message });
		}
		return errors;
	});
	/** Whether the current values pass the schema */
	isValid = $derived.by(() => this.result.success);

	constructor(schema: S, options: FormOptions<S>) {
		this.#schema = schema;
		this.#initial = options.initial;
		this.#onSubmit = options.onSubmit;
		// Deep state, so binding to a nested field updates the validation.
		this.values = $state(structuredClone(options.initial));
	}

	/** Returns a field's errors once the user has left it or tried to submit; none before that. */
	errorsFor(name: string) {
		return this.submitted || this.touched[name] ? (this.errors[name] ?? []) : [];
	}

	/** Marks a field as visited, so its errors show. */
	touch(name: string) {
		this.touched[name] = true;
	}

	/** Restores the starting values, or new ones, and hides every error. */
	reset(values: z.input<S> = this.#initial) {
		this.values = structuredClone(values);
		this.touched = {};
		this.submitted = false;
	}

	/** Checks the values on submit: blocks an invalid submit, calls `onSubmit` when set, or lets the browser submit. */
	submit = async (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		// Read the form now, since the event's current target is cleared after the first await.
		const formEl = e.currentTarget;
		this.submitted = true;
		const result = this.result;
		// If the values fail the schema: stop the submit and move focus to the first invalid control.
		if (!result.success) {
			e.preventDefault();
			await tick();
			formEl.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			return;
		}
		// If there is no submit handler: let the browser submit, such as to a SvelteKit form action.
		if (!this.#onSubmit) return;
		e.preventDefault();
		this.submitting = true;
		try {
			await this.#onSubmit(result.data, e);
		} finally {
			this.submitting = false;
		}
	};
}

/** Creates the state for a form checked by a zod schema. */
export function createForm<S extends z.ZodType>(schema: S, options: FormOptions<S>) {
	return new FormState(schema, options);
}
