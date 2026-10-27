import { redirect } from "@sveltejs/kit";
import { deleteSession } from "#lib/server/auth/session.js";
import type { RequestHandler } from "./$types";

/** Signs the user out and goes home */
export const GET: RequestHandler = async (event) => {
	await deleteSession(event);
	return redirect(302, "/");
};
