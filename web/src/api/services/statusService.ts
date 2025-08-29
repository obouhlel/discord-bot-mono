import { sql } from "drizzle-orm";
import { db } from "../../../../database";
import { botStatus } from "../../../../database/schemas";
import type { BotStatusResponse, DatabaseStatusResponse } from "../types/responses";

export class StatusService {
  static async checkDatabase(): Promise<DatabaseStatusResponse> {
    try {
      const start = Date.now();
      await db.execute(sql`SELECT 1`);
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

  static async checkBot(): Promise<BotStatusResponse> {
    try {
      const result = await db.select().from(botStatus).limit(1);

      if (result.length === 0) {
        return {
          status: "offline",
          lastSeen: null,

          timestamp: new Date().toISOString(),
        };
      }

      const botData = result[0]!;
      const lastHeartbeat = new Date(botData.lastHeartbeat);
      const now = new Date();
      const timeDiff = now.getTime() - lastHeartbeat.getTime();

      // Consider bot offline if no heartbeat for more than 2 minutes
      const isOnline = timeDiff < 2 * 60 * 1000;

      return {
        status: isOnline ? botData.status : "offline",
        lastSeen: lastHeartbeat.toISOString(),
        timestamp: now.toISOString(),
      };
    } catch (error) {
      return {
        status: "offline",
        lastSeen: null,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
