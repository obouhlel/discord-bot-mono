import type { Client } from "discord.js";
import { CommandRegistry } from "@commands/registry";
import PingCommand from "@commands/message/ping";
import { ping } from "@commands/slash/ping";

// Create a singleton instance of the command registry
let commandRegistry: CommandRegistry | null = null;

export function initializeCommands(client: Client): CommandRegistry {
  if (!commandRegistry) {
    console.info("[Commands] Initializing command registry...");
    commandRegistry = new CommandRegistry(client);

    // Register all slash commands
    const slashCommands = [ping];
    commandRegistry.registerSlashCommands(slashCommands);

    // Register all message commands
    const messageCommands = [new PingCommand()];
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
