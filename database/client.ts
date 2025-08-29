import { drizzle } from "drizzle-orm/postgres-js";

// You can specify any property from the postgres-js connection options
export const db = drizzle({
  connection: {
    url: Bun.env.DATABASE_URL,
    ssl: Bun.env.NODE_ENV === "production",
  },
});

export type Database = typeof db;
