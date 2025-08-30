import type { ApiRequest, ApiResponse } from "../types";
import type { HealthService } from "../services/health.service";

export class HealthController {
  constructor(private healthService: HealthService) {}

  checkHealth = async (_req: ApiRequest, res: ApiResponse) => {
    try {
      const health = await this.healthService.getHealthStatus();
      return res.json(health);
    } catch (error) {
      console.error("[Controller] Error checking health:", error);
      return res.error("Health check failed", 500);
    }
  };

  getApiInfo = async (_req: ApiRequest, res: ApiResponse) => {
    return res.json({
      message: "Discord Bot Monitor API",
      version: "1.0.0",
      endpoints: [
        "GET /status - Bot status",
        "POST /deploy - Deploy slash commands",
        "GET /health - Health check",
        "GET /guilds - List all guilds",
        "GET /commands - List all commands",
      ],
    });
  };
}
