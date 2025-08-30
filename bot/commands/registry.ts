import { Collection, type Client, type RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import type { SlashCommand } from "../types/commands/slash.type";
import type { MessageCommand } from "../types/commands/message.type";
import type { CommandsAPIData, CommandStats, SerializedCommandData } from "../types/api";

export class CommandRegistry {
  private slashCommands: Collection<string, SlashCommand>;
  private messageCommands: Collection<string, MessageCommand>;
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.slashCommands = new Collection();
    this.messageCommands = new Collection();
  }

  // Register a slash command
  registerSlashCommand(command: SlashCommand): void {
    const name = command.data.name;
    if (this.slashCommands.has(name)) {
      console.warn(`[Registry] Slash command "${name}" already registered, overwriting`);
    }
    this.slashCommands.set(name, command);
    console.info(`[Registry] Registered slash command: ${name}`);
  }

  // Register a message command
  registerMessageCommand(command: MessageCommand): void {
    const name = command.data.name;
    if (this.messageCommands.has(name)) {
      console.warn(`[Registry] Message command "${name}" already registered, overwriting`);
    }
    this.messageCommands.set(name, command);
    console.info(`[Registry] Registered message command: ${name}`);
  }

  // Register multiple commands at once
  registerSlashCommands(commands: SlashCommand[]): void {
    commands.forEach((cmd) => this.registerSlashCommand(cmd));
  }

  registerMessageCommands(commands: MessageCommand[]): void {
    commands.forEach((cmd) => this.registerMessageCommand(cmd));
  }

  // Get commands
  getSlashCommand(name: string): SlashCommand | undefined {
    return this.slashCommands.get(name);
  }

  getMessageCommand(name: string): MessageCommand | undefined {
    return this.messageCommands.get(name);
  }

  getAllSlashCommands(): SlashCommand[] {
    return Array.from(this.slashCommands.values());
  }

  getAllMessageCommands(): MessageCommand[] {
    return Array.from(this.messageCommands.values());
  }

  // Get formatted command list for API
  getCommandsForAPI(): CommandsAPIData {
    const serializeCommand = (cmd: SlashCommand): SerializedCommandData => {
      return "toJSON" in cmd.data && typeof cmd.data.toJSON === "function"
        ? (cmd.data.toJSON() as SerializedCommandData)
        : (cmd.data as unknown as SerializedCommandData);
    };

    const slash = this.getAllSlashCommands().map((cmd) => {
      const data = serializeCommand(cmd);
      return {
        type: "slash" as const,
        name: data.name || "unknown",
        description: data.description || "No description provided",
        options: data.options || [],
      };
    });

    const message = this.getAllMessageCommands().map((cmd) => ({
      type: "message" as const,
      name: cmd.data.name,
      description: cmd.data.description || "No description provided",
      aliases: [],
    }));

    return {
      slash,
      message,
      total: slash.length + message.length,
    };
  }

  // Deploy slash commands to Discord
  async deploySlashCommands(): Promise<boolean> {
    try {
      console.info("[Registry] Deploying slash commands to Discord...");

      if (!this.client.application) {
        console.error("[Registry] Client application not ready");
        return false;
      }

      const commands: RESTPostAPIApplicationCommandsJSONBody[] = this.getAllSlashCommands().map(
        (cmd) => {
          if ("toJSON" in cmd.data && typeof cmd.data.toJSON === "function") {
            return cmd.data.toJSON() as RESTPostAPIApplicationCommandsJSONBody;
          }
          // Fallback - this shouldn't happen with properly built commands
          throw new Error(`Command ${cmd.data} does not have a toJSON method`);
        }
      );

      await this.client.application.commands.set(commands);

      console.info(`[Registry] Successfully deployed ${commands.length} slash commands`);
      return true;
    } catch (error) {
      console.error("[Registry] Failed to deploy slash commands:", error);
      return false;
    }
  }

  // Get command statistics
  getStats(): CommandStats {
    return {
      slashCommands: this.slashCommands.size,
      messageCommands: this.messageCommands.size,
      total: this.slashCommands.size + this.messageCommands.size,
      commands: {
        slash: Array.from(this.slashCommands.keys()),
        message: Array.from(this.messageCommands.keys()),
      },
    };
  }
}
