/**
 * Applies pending Drizzle migrations (drizzle/*.sql) to DATABASE_URL.
 *
 * Runs as part of `npm run build`, so a deployment always brings its own
 * schema with it — no manual SQL in a database console, and no way for the
 * app to be deployed against a database that hasn't been migrated. Drizzle
 * records applied migrations in `drizzle.__drizzle_migrations`, so repeat
 * runs are no-ops.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and add your Postgres connection string.",
    );
  }

  // A dedicated single connection: migrations run DDL and should not share
  // the app's pool, and `max: 1` keeps statements strictly ordered.
  const sql = postgres(connectionString, { max: 1 });
  try {
    await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
    console.log("Migrations up to date.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:");
  console.error(error);
  process.exit(1);
});
