import type { Client } from "discord.js";
import { CommandRegistry } from "@commands/registry";
import PingCommand from "@commands/message/ping";
import HelpCommand from "@commands/message/help";
import { ping } from "@commands/slash/ping";
import { help } from "@commands/slash/help";

// Create a singleton instance of the command registry
let commandRegistry: CommandRegistry | null = null;

export function initializeCommands(client: Client): CommandRegistry {
  if (!commandRegistry) {
    console.info("[Commands] Initializing command registry...");
    commandRegistry = new CommandRegistry(client);

    // Register all slash commands
    const slashCommands = [help, ping];
    commandRegistry.registerSlashCommands(slashCommands);

    // Register all message commands
    const messageCommands = [new HelpCommand(), new PingCommand()];
    commandRegistry.registerMessageCommands(messageCommands);

    const stats = commandRegistry.getStats();
    console.info(
      `[Commands] Loaded ${stats.total} commands (${stats.slashCommands} slash, ${stats.messageCommands} message)`
    );
  }

  return commandRegistry;
}

export function getCommandRegistry(): CommandRegistry {
  if (!commandRegistry) {
    throw new Error("Command registry not initialized. Call initializeCommands first.");
  }
  return commandRegistry;
}

// Export for backwards compatibility
export function buildMessageCommands() {
  return getCommandRegistry().getAllMessageCommands();
}

export function buildSlashCommand() {
  return getCommandRegistry().getAllSlashCommands();
}
