import { defineRelations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Users who signed in with an OAuth provider */
export const users = sqliteTable("users", {
	/** User id */
	id: text().primaryKey(),
	/** Verified email, used to match returning users */
	email: text().notNull().unique(),
	/** Avatar URL from the provider */
	image: text().notNull(),
	/** When the user first signed in */
	createdAt: integer({ mode: "timestamp_ms" }).notNull(),
	/** When the user last signed in */
	updatedAt: integer({ mode: "timestamp_ms" }).notNull(),
});

/** Login sessions; deleting a user deletes their sessions */
export const sessions = sqliteTable("sessions", {
	/** SHA-256 hash of the session cookie token */
	id: text().primaryKey(),
	/** Id of the user who owns the session */
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	/** When the session stops being valid */
	expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
});

/** Links between tables, used by `db.query` to load related rows */
export const relations = defineRelations({ users, sessions }, (r) => ({
	users: {
		/** Sessions the user owns */
		sessions: r.many.sessions(),
	},
	sessions: {
		/** User who owns the session */
		user: r.one.users({ from: r.sessions.userId, to: r.users.id }),
	},
}));
