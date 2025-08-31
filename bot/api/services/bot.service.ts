import type { Client } from "discord.js";
import { getBotStatus } from "@utils/bot-status";
import { getCommandRegistry } from "@bot/commands";

export class BotService {
  constructor(private client: Client) {}

  getStatus() {
    console.info("[Service] Getting bot status");
    return getBotStatus(this.client);
  }

  async deployCommands() {
    console.info("[Service] Deploying slash commands");
    try {
      const registry = getCommandRegistry();
      const result = await registry.deploySlashCommands();

      if (result) {
        console.info("[Service] Commands deployed successfully");
        return { success: true, message: "Commands deployed successfully" };
      } else {
        console.error("[Service] Failed to deploy commands");
        return { success: false, message: "Failed to deploy commands" };
      }
    } catch (error) {
      console.error("[Service] Failed to deploy commands:", error);
      throw error;
    }
  }

  getGuilds() {
    console.info("[Service] Fetching guilds");
    return this.client.guilds.cache.map((guild) => ({
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      joinedAt: guild.joinedAt?.toISOString(),
    }));
  }

  getCommands() {
    console.info("[Service] Fetching commands");
    return (
      this.client.application?.commands.cache.map((cmd) => ({
        id: cmd.id,
        name: cmd.name,
        description: cmd.description,
        type: cmd.type,
      })) || []
    );
  }
}
