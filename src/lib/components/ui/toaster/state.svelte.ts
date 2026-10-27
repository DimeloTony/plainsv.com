import type { ToastData, ToastId, ToastOptions, ToastPromiseOptions, ToastType } from "./index.js";

// Milliseconds a closing toast stays in the list so its exit can play.
export const EXIT_DURATION = 200;

/** Every toast on the page, shared by all toasters, newest first */
class ToastState {
	/** Toasts in the list, newest first */
	toasts: ToastData[] = $state([]);
	/** Next generated id */
	#nextId = 1;

	/** Adds a toast, or updates the toast with the same id in place; returns its id. */
	add(title: string, type: ToastType, options: ToastOptions = {}) {
		const { id = this.#nextId++, ...rest } = options;
		const existing = this.toasts.find((toast) => toast.id === id);
		// If the id is already in the list: update that toast and restart its timer.
		if (existing) {
			Object.assign(existing, rest, { title, type, updatedAt: Date.now(), dismissed: false });
			return id;
		}
		this.toasts.unshift({ ...rest, id, title, type, updatedAt: Date.now(), dismissed: false });
		return id;
	}

	/** Closes one toast, or every toast when `id` is omitted; `auto` marks a close after the duration. */
	dismiss(id?: ToastId, auto = false) {
		const toasts = id === undefined ? this.toasts : this.toasts.filter((toast) => toast.id === id);
		for (const toast of toasts) {
			// If the toast is already closing: skip it, so its callbacks run once.
			if (toast.dismissed) continue;
			toast.dismissed = true;
			if (auto) toast.onAutoClose?.(toast);
			else toast.onDismiss?.(toast);
			// Remove it once the exit has played, unless an update reopened it in the meantime.
			setTimeout(() => {
				if (toast.dismissed) this.toasts = this.toasts.filter((item) => item !== toast);
			}, EXIT_DURATION);
		}
	}
}

export const toastState = new ToastState();

/** Shows a toast and returns its id; the type helpers and `promise` and `dismiss` hang off it. */
export const toast = Object.assign((title: string, options?: ToastOptions) => toastState.add(title, "default", options), {
	/** Shows a toast without an icon. */
	message: (title: string, options?: ToastOptions) => toastState.add(title, "default", options),
	/** Shows a toast with a check icon. */
	success: (title: string, options?: ToastOptions) => toastState.add(title, "success", options),
	/** Shows a toast with an info icon. */
	info: (title: string, options?: ToastOptions) => toastState.add(title, "info", options),
	/** Shows a toast with a warning icon. */
	warning: (title: string, options?: ToastOptions) => toastState.add(title, "warning", options),
	/** Shows a toast with an error icon. */
	error: (title: string, options?: ToastOptions) => toastState.add(title, "error", options),
	/** Shows a toast with a spinner that stays open until it is updated or dismissed. */
	loading: (title: string, options?: ToastOptions) => toastState.add(title, "loading", options),
	/** Shows a loading toast that turns into a success or error toast when the promise settles; returns its id. */
	promise: <T>(promise: Promise<T> | (() => Promise<T>), { loading, success, error, ...options }: ToastPromiseOptions<T>) => {
		const id = toastState.add(loading, "loading", options);
		// Accept a function so the work only starts once the toast is shown.
		const pending = typeof promise === "function" ? promise() : promise;
		pending.then(
			(value) => toastState.add(typeof success === "function" ? success(value) : success, "success", { ...options, id }),
			(reason: unknown) => toastState.add(typeof error === "function" ? error(reason) : error, "error", { ...options, id }),
		);
		return id;
	},
	/** Closes one toast by id, or every toast when the id is omitted. */
	dismiss: (id?: ToastId) => toastState.dismiss(id),
});
