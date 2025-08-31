import type { Client } from "discord.js";
import type { Route } from "@bot/api/types";
import { BotController } from "@bot/api/controllers/bot.controller";
import { HealthController } from "@bot/api/controllers/health.controller";
import { BotService } from "@bot/api/services/bot.service";
import { HealthService } from "@bot/api/services/health.service";

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
