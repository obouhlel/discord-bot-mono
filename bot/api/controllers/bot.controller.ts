import type { ApiRequest, ApiResponse } from "../types";
import type { BotService } from "@bot/api/services/bot.service";
import { getCommandRegistry } from "@bot/commands";

export class BotController {
  constructor(private botService: BotService) {}

  getStatus = async (_req: ApiRequest, res: ApiResponse) => {
    try {
      const status = this.botService.getStatus();
      return res.json({ success: true, data: status });
    } catch (error) {
      console.error("[Controller] Error getting status:", error);
      return res.error("Failed to get bot status", 500);
    }
  };

  getGuilds = async (_req: ApiRequest, res: ApiResponse) => {
    try {
      const guilds = this.botService.getGuilds();
      return res.json({
        success: true,
        count: guilds.length,
        data: guilds,
      });
    } catch (error) {
      console.error("[Controller] Error getting guilds:", error);
      return res.error("Failed to get guilds", 500);
    }
  };

  getCommands = async (_req: ApiRequest, res: ApiResponse) => {
    try {
      const registry = getCommandRegistry();
      const commands = registry.getCommandsForAPI();

      return res.json({
        success: true,
        data: commands,
        stats: registry.getStats(),
      });
    } catch (error) {
      console.error("[Controller] Error getting commands:", error);
      return res.error("Failed to get commands", 500);
    }
  };
}
