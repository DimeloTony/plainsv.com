import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { drizzle } from "drizzle-orm/node-sqlite";
import * as schema from "./schema.js";
export { schema };

/** SQLite file path from the project root, read from `DATABASE_URL` with the same fallback as `config.ts` */
export const DB_FILE = process.env.DATABASE_URL ?? "db/db.sqlite";

// Create the database folder first, since SQLite only creates the file.
mkdirSync(dirname(DB_FILE), { recursive: true });

/** Drizzle client on Node's built-in `node:sqlite`, with `db.query` typed from the schema relations */
export const db = drizzle({ connection: DB_FILE, relations: schema.relations });

// Let reads run while a write is in progress, and enforce foreign keys such as sessions → users.
db.$client.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
