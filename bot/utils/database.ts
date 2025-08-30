import { db } from "../../database";
import { sql } from "drizzle-orm";
import type { DatabaseStatusResponse } from "@shared/types/api";

export async function getPostgresStatus(): Promise<DatabaseStatusResponse> {
  try {
    const start = Date.now();
    await db.execute(sql`SELECT 1 as health_check`);
    const responseTime = Date.now() - start;

    return {
      status: "online",
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      status: "offline",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
