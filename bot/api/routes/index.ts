import type { Client } from "discord.js";
import type { Route } from "../types";
import { BotController } from "../controllers/bot.controller";
import { HealthController } from "../controllers/health.controller";
import { BotService } from "../services/bot.service";
import { HealthService } from "../services/health.service";

export function createRoutes(client: Client): Route[] {
  // Initialize services
  const botService = new BotService(client);
  const healthService = new HealthService(client);

  // Initialize controllers
  const botController = new BotController(botService);
  const healthController = new HealthController(healthService);

  return [
    {
      method: "GET",
      path: "/",
      handler: healthController.getApiInfo,
    },
    {
      method: "GET",
      path: "/status",
      handler: botController.getStatus,
    },
    {
      method: "GET",
      path: "/health",
      handler: healthController.checkHealth,
    },
    {
      method: "GET",
      path: "/guilds",
      handler: botController.getGuilds,
    },
    {
      method: "GET",
      path: "/commands",
      handler: botController.getCommands,
    },
  ];
}
