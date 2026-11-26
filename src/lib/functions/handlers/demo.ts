import type { FuncHandler } from "#lib/functions/schemas.js";

/** Create user */
export const userCreate: FuncHandler<"userCreate"> = async ({ event, inputData }) => {
	const email = inputData.email;
	// This is pointless since input data gets checked before getting here
	if (!email) return { error: true, data: "Please provide user's email." };
	// Create user and return message
	return { error: false, data: `User with email ${email} created.` };
};

/** Delete user */
export const userDelete: FuncHandler<"userDelete"> = async ({ event, inputData }) => {
	const email = inputData.email;
	// This is pointless since input data gets checked before getting here
	if (!email) return { error: true, data: "Please provide user's email." };
	// Create user and return message
	return { error: false, data: `User with email ${email} deleted.` };
};

/** Delete user */
export const userDeletePrivate: FuncHandler<"userDeletePrivate"> = async ({ event, inputData }) => {
	const email = inputData.email;
	// This is pointless since input data gets checked before getting here
	if (!email) return { error: true, data: "Please provide user's email." };
	// Create user and return message
	return { error: false, data: `User with email ${email} deleted.` };
};

/** Read an uploaded file from form data */
export const fileUpload: FuncHandler<"fileUpload"> = async ({ inputData }) => {
	const file = inputData.get("file");
	// If no file was sent: return an error.
	if (!(file instanceof File) || !file.size) return { error: true, data: "Please choose a file to upload." };
	// Return the file details without saving the file
	return { error: false, data: { name: file.name, size: file.size, type: file.type || "unknown" } };
};

/** Stream a reply one word at a time */
export const textStream: FuncHandler<"textStream"> = async ({ inputData }) => {
	const words = `You said "${inputData.prompt}". This reply is streamed from the server one word at a time.`.split(" ");
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			// Send each word as a server-sent event, then close the stream
			for (const word of words) {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(`${word} `)}\n\n`));
				await new Promise((resolve) => setTimeout(resolve, 80));
			}
			controller.close();
		},
	});
	return new Response(stream, { headers: { "content-type": "text/event-stream" } });
};

/** Stream a random price every second, like a live ticker */
export const liveTicker: FuncHandler<"liveTicker"> = async ({ event, inputData }) => {
	/** Yield a new price each second, ending after a minute so idle docs tabs do not keep a stream open */
	async function* ticker() {
		let price = 100;
		for (let count = 1; count <= 60; count++) {
			// If testing errors: throw on the third event, so the client gets an error mid-stream
			if (inputData.throwError && count === 3) throw new Error("Ticker failed on purpose.");
			price = Math.round((price + (Math.random() - 0.5) * 2) * 100) / 100;
			yield { count, price, time: new Date() };
			// Wait a second, or stop right away when the client disconnects
			await new Promise((resolve) => {
				const timeout = setTimeout(resolve, 1000);
				event.request.signal.addEventListener("abort", () => {
					clearTimeout(timeout);
					resolve(null);
				}, { once: true });
			});
			// If the client disconnected: end the generator
			if (event.request.signal.aborted) return;
		}
	}
	return { error: false, data: ticker() };
};
