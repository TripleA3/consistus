import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

declare global {
  var __fanneroSql: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and add your Postgres connection string.",
    );
  }
  return postgres(connectionString, { max: 10 });
}

// Reuse the connection across hot reloads in dev so `next dev` doesn't leak
// a new pool on every file save.
const sql = globalThis.__fanneroSql ?? createClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.__fanneroSql = sql;
}

export const db = drizzle(sql, { schema });
