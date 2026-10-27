export { default as Toaster } from "./_.svelte";
export { toast } from "./state.svelte.js";

/** Corner of the viewport, or the middle of its top or bottom edge, that the toasts stack from */
export type ToasterPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

/** Kind of toast; each kind except `default` shows its own icon */
export type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading";

/** Id of a toast; pass it back to `toast` to update the toast, or to `toast.dismiss` to close it */
export type ToastId = string | number;

/** Button shown at the end of a toast */
export interface ToastAction {
	/** Button text */
	label: string;
	/** Called on click; the toast closes afterwards unless the handler calls `preventDefault` */
	onClick?: (e: MouseEvent) => void;
}

/** Settings for one toast */
export interface ToastOptions {
	/** Id of an existing toast to update in place, or a custom id for a new one */
	id?: ToastId;
	/** Muted text under the title */
	description?: string;
	/** Milliseconds before the toast closes; `Infinity` keeps it open; follows the toaster's `duration` when omitted */
	duration?: number;
	/** Whether a swipe or `toast.dismiss` can close the toast; defaults to `true` */
	dismissible?: boolean;
	/** Shows a close button in the corner; follows the toaster's `closeButton` when omitted */
	closeButton?: boolean;
	/** Tints error toasts with the destructive color; follows the toaster's `richColors` when omitted */
	richColors?: boolean;
	/** Main button, such as Undo */
	action?: ToastAction;
	/** Secondary button that closes the toast, such as Cancel */
	cancel?: ToastAction;
	/** Icon in place of the type's icon */
	icon?: Snippet;
	/** Id of the `Toaster` that shows the toast; toasts without one show in toasters without an `id` */
	toasterId?: string;
	/** Classes merged onto the toast */
	class?: string;
	/** Called when the toast is closed by a swipe, a button, or `toast.dismiss` */
	onDismiss?: (toast: ToastData) => void;
	/** Called when the toast closes after its duration */
	onAutoClose?: (toast: ToastData) => void;
}

/** A toast in the list, as the toaster reads it */
export interface ToastData extends Omit<ToastOptions, "id"> {
	/** Unique id */
	id: ToastId;
	/** Main text */
	title: string;
	/** Kind of toast, which sets its icon */
	type: ToastType;
	/** Time of the last create or update, which restarts the close timer */
	updatedAt: number;
	/** Whether the toast is closing; it plays its exit before it is removed */
	dismissed: boolean;
}

/** Messages and settings for `toast.promise`; the success and error messages can read the result */
export interface ToastPromiseOptions<T> extends Omit<ToastOptions, "id"> {
	/** Title while the promise is pending */
	loading: string;
	/** Title once the promise resolves, or a function of its value */
	success: string | ((value: T) => string);
	/** Title once the promise rejects, or a function of its error */
	error: string | ((error: unknown) => string);
}

/** Area that shows the toasts; place it once in the root layout */
export interface Props extends CompProps<"section"> {
	/** Shows only the toasts whose `toasterId` matches; leave it out for the main toaster */
	id?: string;
	/** Where the toasts stack; defaults to `bottom-right` */
	position?: ToasterPosition;
	/** Keeps the toasts spread out instead of stacked; they always spread while hovered or focused */
	expand?: boolean;
	/** Number of toasts shown at once; older ones wait behind; defaults to `3` */
	visibleToasts?: number;
	/** Milliseconds each toast stays open; defaults to `4000` */
	duration?: number;
	/** Shows a close button on every toast */
	closeButton?: boolean;
	/** Tints error toasts with the destructive color */
	richColors?: boolean;
	/** Space between spread-out toasts, and how far stacked toasts peek out, on the shared scale; defaults to `md` */
	gap?: UiSize;
	/** Padding, text, and icon size of the toasts on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the toasts; defaults to `lg`. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Keys that move focus to the toasts: modifier names such as `altKey`, then a key code; defaults to Alt+T */
	hotkey?: string[];
	/** Classes merged onto the region */
	class?: CompProps<"section">["class"];
}

/** Internal toast item rendered by the toaster */
export interface ToastItemProps {
	/** The toast to show */
	toast: ToastData;
	/** Place in the stack among the toasts still open, with 0 at the front */
	index: number;
	/** Pixels from the stack edge to this toast while spread out */
	offset: number;
}

export type ToasterProps = Props;
