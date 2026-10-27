import { db } from "#lib/server/mongodb/index.js";
import type { AuthDb, AuthProfile, AuthSession } from "#lib/server/auth/types.ts";

/** MongoDB version of the auth database calls, built on `db` from `src/lib/server/mongodb` */
export const authDb: AuthDb = {
	async createSession(session: AuthSession) {
		await db.createSession({ _id: session.id, byUserID: session.userId, expiresAt: session.expiresAt });
	},
	async findSession(id: string) {
		const session = await db.findSessionById(id);
		// If no session has this id: return nothing.
		if (!session) return null;
		return { id: session._id, userId: session.byUserID, expiresAt: session.expiresAt };
	},
	async updateSessionExpiry(id: string, expiresAt: Date) {
		await db.updateSessionById(id, { $set: { expiresAt } });
	},
	async deleteSession(id: string) {
		await db.deleteSessionById(id);
	},
	async findUser(id: string) {
		const user = await db.findUserById(id);
		// If no user has this id: return nothing.
		if (!user) return null;
		return { id: user._id, email: user.email, image: user.image };
	},
	async upsertUser(profile: AuthProfile) {
		const user = await db.findUser({ email: profile.email });
		// If no user has this email: create one.
		if (!user) {
			const newUser = await db.createUser({ email: profile.email, image: profile.image, createdAt: new Date(), updatedAt: new Date() });
			return { id: newUser._id, email: newUser.email, image: newUser.image };
		}
		// Else: refresh the avatar from the provider.
		await db.updateUserById(user._id, { $set: { image: profile.image, updatedAt: new Date() } });
		return { id: user._id, email: user.email, image: profile.image };
	},
};
