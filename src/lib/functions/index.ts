/** Only run on client */
import { createSubscriber } from "svelte/reactivity";
import type { FuncSchemas } from "./schemas.js";

/** Read a text/event-stream response and yield the payload of each `data:` event, throwing on an `error` event. */
async function* readEventStream(response: Response): AsyncGenerator<unknown> {
	// If the response has no body: there is nothing to read.
	if (!response.body) return;
	const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
	let buffer = "";
	/** Parse a raw event into its type and payload, or null when it has no `data:` line. */
	const parseEvent = (event: string) => {
		let type = "message";
		const dataLines: string[] = [];
		for (const line of event.split("\n")) {
			if (line.startsWith("event: ")) type = line.slice(7);
			else if (line.startsWith("data: ")) dataLines.push(line.slice(6));
		}
		if (dataLines.length === 0) return null;
		const payload = dataLines.join("\n");
		// If the payload is valid JSON: use the parsed value with `{ $date }` tags turned back into dates, otherwise keep the raw text.
		try {
			const data: unknown = JSON.parse(payload, (_key, value) => (value && typeof value === "object" && typeof value.$date === "string" ? new Date(value.$date) : value));
			return { type, data };
		} catch {
			return { type, data: payload };
		}
	};
	try {
		while (true) {
			const { done, value } = await reader.read();
			// If the stream ended: flush any remaining event.
			const events = done ? [buffer] : (buffer + value).split("\n\n");
			buffer = done ? "" : (events.pop() ?? "");
			for (const event of events) {
				const parsed = parseEvent(event);
				if (parsed === null) continue;
				// If the server sent an error event: stop reading and throw its message.
				if (parsed.type === "error") throw new Error(String(parsed.data));
				yield parsed.data;
			}
			if (done) break;
		}
	} finally {
		// Close the connection if the caller stops early.
		await reader.cancel().catch(() => {});
	}
}

/** Use functions */
export async function useFunc<K extends keyof FuncSchemas>(functionName: K, apiLoad: FuncSchemas[K]["in"], skipSleepTime = true, signal?: AbortSignal): Promise<FuncSchemas[K]["out"]> {
	// check if it's a form post, if yes set headers to empty
	const isFormData = (apiLoad as any) instanceof FormData;
	const headers: { [key: string]: any } = isFormData ? {} : ({ "Content-Type": "application/json" } as any);
	const body = (isFormData ? apiLoad : JSON.stringify(apiLoad)) as string | FormData;
	// send request and catch any error
	try {
		const requestStartTime = Date.now();
		const request = await fetch("/api/functions", { method: "POST", headers: { ...headers, functionName }, body, signal });
		// check if response is a text/event-stream
		const contentType: "text/event-stream" | "application/json" = request.headers.get("content-type") as any;
		if (contentType === "text/event-stream") {
			const response = { error: false, data: readEventStream(request) as any };
			return response;
		}
		// if request finish under 500 milliseconds: wait one second for better UX
		if (!skipSleepTime) {
			const elapsedTime = Date.now() - requestStartTime;
			const minWaitTime = 300;
			if (elapsedTime < minWaitTime) await new Promise((resolve) => setTimeout(resolve, minWaitTime - elapsedTime));
		}
		// return json
		const response = (await request.json()) as any;
		return response;
	} catch (err: any) {
		// return error
		const response = { error: true as const, data: err.message as string };
		return response;
	}
}

/** Value yielded by a function whose `out` schema is an async generator */
type FuncStreamItem<K extends keyof FuncSchemas> = Extract<FuncSchemas[K]["out"], { error: false }>["data"] extends AsyncGenerator<infer T> ? T : never;
/** Names of functions whose `out` schema is an async generator */
type FuncStreamName = { [K in keyof FuncSchemas]: [FuncStreamItem<K>] extends [never] ? never : K }[keyof FuncSchemas];

/** Live function stream that connects while a template or effect reads it, like a SvelteKit `query.live` */
class FuncLive<K extends FuncStreamName> {
	#functionName: K;
	#apiLoad: FuncSchemas[K]["in"];
	#current: { error: true; data: string } | { error: false; data: FuncStreamItem<K> } | undefined = undefined;
	#connected = false;
	#controller: AbortController | null = null;
	#update = () => {};
	#subscribe: () => void;
	#eventListeners = new Set<(data: FuncStreamItem<K>) => void>();
	#errorListeners = new Set<(message: string) => void>();

	constructor(functionName: K, apiLoad: FuncSchemas[K]["in"]) {
		this.#functionName = functionName;
		this.#apiLoad = apiLoad;
		// Connect on the first read inside an effect, and abort when the last reader is destroyed
		this.#subscribe = createSubscriber((update) => {
			this.#update = update;
			this.#connect();
			return () => {
				this.#controller?.abort();
				this.#controller = null;
			};
		});
	}

	/** Latest response: `{ error: false, data }` for each yielded value, `{ error: true, data: message }` on failure, or undefined before the first one */
	get current() {
		this.#subscribe();
		return this.#current;
	}

	/** Whether the stream is open */
	get connected() {
		this.#subscribe();
		return this.#connected;
	}

	/** Close the current stream and open a new one */
	reconnect() {
		this.#connect();
	}

	/** Run a callback for every value the server sends, and return a function that removes it */
	onEvent(callback: (data: FuncStreamItem<K>) => void) {
		// Subscribe like the getters, so calling it inside an effect keeps the stream open even when nothing else reads it
		this.#subscribe();
		this.#eventListeners.add(callback);
		return () => {
			this.#eventListeners.delete(callback);
		};
	}

	/** Run a callback with the message when the call or the stream fails, and return a function that removes it */
	onError(callback: (message: string) => void) {
		// Subscribe like the getters, so calling it inside an effect keeps the stream open even when nothing else reads it
		this.#subscribe();
		this.#errorListeners.add(callback);
		return () => {
			this.#errorListeners.delete(callback);
		};
	}

	/** Close the current stream, keeping the last value until `reconnect` */
	disconnect() {
		this.#controller?.abort();
		this.#controller = null;
		this.#connected = false;
		this.#update();
	}

	/** Open the stream and store each value it yields */
	async #connect() {
		// Abort any open stream, so only one connection runs at a time
		this.#controller?.abort();
		const controller = new AbortController();
		this.#controller = controller;

		const response = await useFunc(this.#functionName, this.#apiLoad, true, controller.signal);
		// If aborted while connecting: a newer connection or the cleanup owns the state.
		if (controller.signal.aborted) return;
		// If the call failed: keep its error response.
		if (response.error) {
			this.#current = response;
			this.#update();
			for (const listener of this.#errorListeners) listener(response.data);
			return;
		}

		this.#connected = true;
		this.#update();
		try {
			// The generic `K` hides the narrowed type, so name the generator type `FuncStreamItem` gives
			for await (const value of response.data as AsyncGenerator<FuncStreamItem<K>>) {
				this.#current = { error: false, data: value };
				this.#update();
				// Run the event callbacks after `current` is set, so they can read it too
				for (const listener of this.#eventListeners) listener(value);
			}
		} catch (err) {
			// If the stream failed and was not aborted: store the error, since aborting throws too.
			if (!controller.signal.aborted) {
				const message = err instanceof Error ? err.message : String(err);
				this.#current = { error: true, data: message };
				for (const listener of this.#errorListeners) listener(message);
			}
		} finally {
			// If this is still the active connection: mark it closed.
			if (this.#controller === controller || this.#controller === null) {
				this.#connected = false;
				this.#update();
			}
		}
	}
}

/** Use a streamed function as live state: read `.current`, `.connected`, and call `.reconnect()` */
export function useFuncLive<K extends FuncStreamName>(functionName: K, apiLoad: FuncSchemas[K]["in"]) {
	return new FuncLive(functionName, apiLoad);
}
