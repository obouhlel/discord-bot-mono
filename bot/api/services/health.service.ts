import type { Client } from "discord.js";
import { getPostgresStatus } from "../../utils/database";

export class HealthService {
  constructor(private client: Client) {}

  async getHealthStatus() {
    console.info("[Service] Checking health status");

    const postgresStatus = await getPostgresStatus();
    const botStatus = this.client.readyAt ? "online" : "offline";

    return {
      success: true,
      timestamp: new Date().toISOString(),
      postgres: postgresStatus,
      server: "healthy",
      bot: botStatus,
    };
  }
}
