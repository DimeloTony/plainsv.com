/** Only run on server */
import { z } from "zod";
import { functionsSchemas } from "./schemas.js";
import type { RequestHandler } from "@sveltejs/kit";
import type { FuncSchemas, FunctionHookErrorResData } from "./schemas.js";

const moduleFiles = import.meta.glob("#lib/functions/handlers/*.ts", { eager: true });
const handlers: Record<keyof FuncSchemas, Function> = {} as Record<keyof FuncSchemas, Function>;
const functions: (keyof FuncSchemas)[] = [];
// Loop all functions exported by file
for (const handlerModule of Object.values(moduleFiles)) {
	// handlerModule is an object with multiple exported functions
	if (handlerModule && typeof handlerModule === "object") {
		// Get all exported functions from this module
		for (const [exportName, exportedFunction] of Object.entries(handlerModule)) {
			// Only add if it's actually a function
			if (typeof exportedFunction === "function") {
				handlers[exportName as keyof FuncSchemas] = exportedFunction;
				functions.push(exportName as keyof FuncSchemas);
			}
		}
	}
}

/** Convert zod error to string */
const convertZodErrorToString = (functionName: keyof FuncSchemas, error: z.ZodError) => {
	const errors: { message: string; path: string[] }[] = JSON.parse(error.message);
	return errors.map((err) => `${err.message} from function '${functionName}' field '${err.path[0]}'`).join("\n");
};

/** Handle all request to this POST server endpoint */
const POST: RequestHandler = async (event) => {
	const functionName = event.request.headers.get("functionName") as null | keyof FuncSchemas;

	// Check if functionName header was provided
	if (!functionName) {
		const response = { error: true as const, data: "header 'functionName' it's required" as string };
		return Response.json(response);
	}

	// Check if function exists was exported from folder handlers
	if (!(functionName in handlers)) {
		const error: FunctionHookErrorResData = { error: true, data: `Function '${functionName}' does not exists` };
		return Response.json(error);
	}

	// Check if current request to function is permitted (if not public and no user data)
	if (!functionsSchemas[functionName].isPublic && !event.locals.userData) {
		const error: FunctionHookErrorResData = { error: true, data: `Function '${functionName}' is not a public function. If public, set it inside schema using isPublic:true.` };
		return Response.json(error);
	}

	// Validate input data (we do it on the server side to avoid importing zod to the client)
	const isFormData = (functionsSchemas[functionName].in.def.type as string) === "custom";
	const request = event.request.clone();
	const inputData = await request[isFormData ? "formData" : "json"]();
	const parseRes = functionsSchemas[functionName].in.safeParse(inputData);
	// If not validated, return error
	if (!parseRes.success) {
		const error = convertZodErrorToString(functionName, parseRes.error);
		const response = { error: true, data: error };
		return Response.json(response);
	}

	// Handle function
	const handlerResponse = handlers[functionName]({ event, inputData });
	const outputData: FuncSchemas[typeof functionName]["out"] = !(handlerResponse instanceof Promise) ? handlerResponse : await handlerResponse;

	// If returning raw response: return it as it's
	if (outputData instanceof Response) return outputData;
	const headers = new Headers({ "content-type": "application/json" });

	// If returning an async generator: stream each yielded value as a server-sent event, skipping output validation since streamed schemas are `z.custom`
	if (!outputData.error && outputData.data && typeof outputData.data === "object" && Symbol.asyncIterator in outputData.data) {
		const generator = outputData.data as AsyncGenerator<unknown>;
		const stream = new ReadableStream<string>({
			// Runs each time the client is ready for the next event
			async pull(controller) {
				try {
					const { done, value } = await generator.next();
					// If the generator finished: end the stream
					if (done) return controller.close();
					// Tag dates as `{ $date }`, since `toJSON` turns them into strings before the replacer sees them
					const payload = JSON.stringify(value, function (this: Record<string, unknown>, key: string, val: unknown) {
						return this[key] instanceof Date ? { $date: this[key].toISOString() } : val;
					});
					controller.enqueue(`data: ${payload}\n\n`);
				} catch (err) {
					// If the generator threw: send the message as an error event and end the stream
					const message = err instanceof Error ? err.message : String(err);
					controller.enqueue(`event: error\ndata: ${JSON.stringify(message)}\n\n`);
					controller.close();
				}
			},
			// Stop the generator when the client disconnects, which runs its `finally` block on its next yield
			async cancel() {
				await generator.return(undefined);
			},
		});
		return new Response(stream.pipeThrough(new TextEncoderStream()), { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
	}

	// if not returning error: validate output
	if (!outputData.error) {
		const parseRes = functionsSchemas[functionName]["out"].safeParse(outputData.data);
		// if output was not validated: return error
		if (!parseRes.success) {
			const error = convertZodErrorToString(functionName, parseRes.error);
			return new Response(JSON.stringify({ error: true, data: error }), { headers });
		}
	}

	const response = new Response(JSON.stringify(outputData), { headers });
	return response;
};

export { POST, functions };
