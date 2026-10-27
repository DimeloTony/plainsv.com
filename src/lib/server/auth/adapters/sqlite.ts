import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "#lib/server/drizzle/index.js";
import type { AuthDb, AuthProfile, AuthSession } from "#lib/server/auth/types.js";
const { users, sessions } = schema;

/** SQLite version of the auth database calls, built on the Drizzle utility in `src/lib/server/drizzle` */
export const authDb: AuthDb = {
	async createSession(session: AuthSession) {
		await db.insert(sessions).values(session);
	},
	async findSession(id: string) {
		const session = await db.query.sessions.findFirst({ where: { id } });
		// If no session has this id: return nothing.
		return session ?? null;
	},
	async updateSessionExpiry(id: string, expiresAt: Date) {
		await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, id));
	},
	async deleteSession(id: string) {
		await db.delete(sessions).where(eq(sessions.id, id));
	},
	async findUser(id: string) {
		const user = await db.query.users.findFirst({ where: { id }, columns: { id: true, email: true, image: true } });
		// If no user has this id: return nothing.
		return user ?? null;
	},
	async upsertUser(profile: AuthProfile) {
		const now = new Date();
		// Insert a new user, or refresh the avatar when the email already exists.
		const [user] = await db
			.insert(users)
			.values({ id: randomUUID(), email: profile.email, image: profile.image, createdAt: now, updatedAt: now })
			.onConflictDoUpdate({ target: users.email, set: { image: profile.image, updatedAt: now } })
			.returning({ id: users.id, email: users.email, image: users.image });
		// If SQLite returned no row: the insert failed, so stop sign in.
		if (!user) throw new Error(`Could not save the user ${profile.email}.`);
		return user;
	},
};
