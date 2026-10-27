import { setContext, getContext } from "svelte";
import type { FieldErrorItem } from "#lib/components/ui/field/index.js";

const CONTEXT_ID = "form-field-context";

class UseFieldCtx {
	/** Dotted path of the value */
	name = $state("");
	/** Unique prefix for the control, description, and error ids */
	baseId = $state("");
	/** Whether a `FormDescription` is mounted to describe the control */
	hasDescription = $state(false);
	/** Reads the field's shown errors */
	getErrors: () => FieldErrorItem[] = () => [];
	/** Marks the field as visited */
	touch: () => void = () => {};

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the control, referenced by the label's `for` */
	get controlId() {
		return `${this.baseId}-control`;
	}

	/** Id of the description */
	get descriptionId() {
		return `${this.baseId}-description`;
	}

	/** Id of the error message */
	get errorId() {
		return `${this.baseId}-error`;
	}

	/** Errors shown for the field */
	get errors() {
		return this.getErrors();
	}

	/** Ids that describe the control: the description, and the errors while there are any */
	get describedBy() {
		const ids = [this.hasDescription && this.descriptionId, this.errors.length > 0 && this.errorId].filter(Boolean);
		return ids.length ? ids.join(" ") : undefined;
	}
}

export type FieldCtxProps = Pick<InstanceType<typeof UseFieldCtx>, "name" | "baseId" | "getErrors" | "touch">;

export const setFieldCtx = (props: FieldCtxProps) => setContext(CONTEXT_ID, new UseFieldCtx(props));

export const useFieldCtx = () => getContext<ReturnType<typeof setFieldCtx>>(CONTEXT_ID);
