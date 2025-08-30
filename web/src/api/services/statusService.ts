import { sql } from "drizzle-orm";
import { db } from "../../../../database";
import type { DatabaseStatusResponse } from "../types/responses";

export class StatusService {
  static async checkDatabase(): Promise<DatabaseStatusResponse> {
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
      return {
        status: "offline",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
