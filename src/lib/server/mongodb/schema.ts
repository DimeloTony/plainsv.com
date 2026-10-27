import { z } from "zod";

/** Application Database collections Schemas */
export const dbCollectionsSchema = {
	/** App data and other data */
	appData: z.discriminatedUnion("_id", [
		z.object({
			_id: z.literal("config"),
			data: z.object({
				maintenanceMessage: z.string(),
			}),
		}),
	]),

	/** User collection schema */
	user: z.object({
		_id: z.string(),
		email: z.string(),
		image: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),

	/** Session collection schema */
	session: z.object({
		_id: z.string().describe("Session id"),
		expiresAt: z.date(),
		byUserID: z.string(),
	}),
};

/** Application Database collections Schemas type */
export type DbCollectionsSchema = {
	[K in keyof typeof dbCollectionsSchema]: z.infer<(typeof dbCollectionsSchema)[K]>;
};
