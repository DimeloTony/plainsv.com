/** Only run on server to avoid loading zod to client */
import { z } from "zod";
import type { RequestEvent } from "@sveltejs/kit";

/** Function schemas */
export const functionsSchemas = {
	toggleDarkMode: {
		in: z.object().nullish(),
		out: z.object({ isDarkMode: z.boolean() }),
		isPublic: true,
	},
	userCreate: {
		in: z.object({ email: z.email() }),
		out: z.string(),
		isPublic: true,
	},
	userDelete: {
		in: z.object({ email: z.email() }),
		out: z.string(),
		isPublic: true,
	},
	userDeletePrivate: {
		in: z.object({ email: z.email() }),
		out: z.string(),
		isPublic: false,
	},
	fileUpload: {
		in: z.custom<FormData>((value) => value instanceof FormData),
		out: z.object({ name: z.string(), size: z.number(), type: z.string() }),
		isPublic: true,
	},
	textStream: {
		in: z.object({ prompt: z.string().min(1) }),
		out: z.custom<AsyncGenerator<string>>(() => true),
		isPublic: true,
	},
};

/** Function schemas type */
export type FuncSchemas = {
	[K in keyof typeof functionsSchemas]: {
		in: z.infer<(typeof functionsSchemas)[K]["in"]>;
		out: { error: true; data: string } | { error: false; data: z.infer<(typeof functionsSchemas)[K]["out"]> };
		isPublic?: boolean;
	};
};

/** Function response type */
export type FuncResponse<K extends keyof FuncSchemas> = { error: true; data: string } | { error: false; data: z.infer<(typeof functionsSchemas)[K]["out"]> };

/** Type helper to create function response */
export type FuncHandler<K extends keyof FuncSchemas> = (props: {
	event: Omit<RequestEvent, "request"> & {
		request: Omit<RequestEvent["request"], "json"> & {
			json: () => Promise<FuncSchemas[K]["in"]>;
		};
	};
	inputData: FuncSchemas[K]["in"];
}) => FuncSchemas[K]["out"] | Promise<FuncSchemas[K]["out"]> | Promise<Response> | Response;

/** Function response data type */
export type FunctionHookErrorResData = { error: true; data: string };
