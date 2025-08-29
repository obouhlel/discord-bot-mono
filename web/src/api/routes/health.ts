import { StatusService } from "../services/statusService";
import type { HealthResponse } from "../types/responses";

export const healthRoutes = {
  "/api/status/health": async (_req: Request): Promise<Response> => {
    try {
      // Check database and bot in parallel
      const [databaseStatus, botStatusData] = await Promise.all([
        StatusService.checkDatabase(),
        StatusService.checkBot(),
      ]);

      // Determine overall health
      const dbHealthy = databaseStatus.status === "online";
      const botHealthy = botStatusData.status === "online";

      let overallStatus: "healthy" | "degraded" | "unhealthy";
      if (dbHealthy && botHealthy) {
        overallStatus = "healthy";
      } else if (dbHealthy || botHealthy) {
        overallStatus = "degraded";
      } else {
        overallStatus = "unhealthy";
      }

      const response: HealthResponse = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services: {
          database: databaseStatus,
          bot: botStatusData,
        },
      };

      return Response.json(response);
    } catch (error) {
      const response: HealthResponse = {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: "offline",
            error: "Service unavailable",
            timestamp: new Date().toISOString(),
          },
          bot: {
            status: "offline",
            lastSeen: null,
            error: "Service unavailable",
            timestamp: new Date().toISOString(),
          },
        },
      };

      return Response.json(response, { status: 503 });
    }
  },
};
