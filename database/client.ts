import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

const queryClient = postgres(Bun.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
