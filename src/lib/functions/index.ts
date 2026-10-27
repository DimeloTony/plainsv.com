/** Only run on client */
import type { FuncSchemas } from "./schemas.js";

/** Read a text/event-stream response and yield the payload of each `data:` event. */
async function* readEventStream(response: Response): AsyncGenerator<string> {
	// If the response has no body: there is nothing to read.
	if (!response.body) return;
	const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
	let buffer = "";
	/** Parse a raw event into its payload, or null when it has no `data:` line. */
	const parseEvent = (event: string) => {
		if (!event.startsWith("data: ")) return null;
		const payload = event.slice(6);
		// If the payload is valid JSON: use the parsed value, otherwise keep the raw text.
		try {
			const parsed = JSON.parse(payload);
			return typeof parsed === "string" ? parsed : payload;
		} catch {
			return payload;
		}
	};
	try {
		while (true) {
			const { done, value } = await reader.read();
			// If the stream ended: flush any remaining event.
			if (done) {
				const last = parseEvent(buffer);
				if (last !== null) yield last;
				break;
			}
			buffer += value;
			const events = buffer.split("\n\n");
			buffer = events.pop() ?? "";
			for (const event of events) {
				const payload = parseEvent(event);
				if (payload !== null) yield payload;
			}
		}
	} finally {
		// Close the connection if the caller stops early.
		await reader.cancel().catch(() => {});
	}
}

/** Use functions */
export async function useFunc<K extends keyof FuncSchemas>(functionName: K, apiLoad: FuncSchemas[K]["in"], skipSleepTime = true): Promise<FuncSchemas[K]["out"]> {
	// check if it's a form post, if yes set headers to empty
	const isFormData = (apiLoad as any) instanceof FormData;
	const headers: { [key: string]: any } = isFormData ? {} : ({ "Content-Type": "application/json" } as any);
	const body = (isFormData ? apiLoad : JSON.stringify(apiLoad)) as string | FormData;
	// send request and catch any error
	try {
		const requestStartTime = Date.now();
		const request = await fetch("/api/functions", { method: "POST", headers: { ...headers, functionName }, body });
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
