import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";

if (!Bun.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const queryClient = postgres(Bun.env.DATABASE_URL);
export const db = drizzle({ client: queryClient });

try {
  await db.execute(sql`SELECT 1 as health_check`);
} catch (error) {
  console.error("Failed to connect to database");
  console.error(error);
}

export type Database = typeof db;
