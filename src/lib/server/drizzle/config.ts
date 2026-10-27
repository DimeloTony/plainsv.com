import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { defineConfig } from "drizzle-kit";

// Read the path from `DATABASE_URL`, and keep the fallback in sync with `DB_FILE` in `src/lib/server/drizzle/index.ts`.
const DB_FILE = process.env.DATABASE_URL ?? "db/db.sqlite";

// Create the database folder first, since SQLite only creates the file.
mkdirSync(dirname(DB_FILE), { recursive: true });

/** drizzle-kit settings; run it with `--config=src/lib/server/drizzle/config.ts`, and paths resolve from the project root */
export default defineConfig({
	dialect: "sqlite",
	schema: "./src/lib/server/drizzle/schema.ts",
	out: "./src/lib/server/drizzle/migrations",
	dbCredentials: { url: DB_FILE },
});
