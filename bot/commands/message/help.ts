import { EmbedBuilder, type TextChannel } from "discord.js";
import type { MessageCommandContext } from "@bot-types/commands/message.type";
import { MessageCommand } from "@bot-types/commands/message.type";
import { getCommandRegistry } from "../commands";

export default class HelpCommand extends MessageCommand {
  public readonly data = {
    name: "help",
    description: "Shows all available commands",
  };

  shouldExecute({ message }: MessageCommandContext): boolean {
    return message.content.toLowerCase() === "help";
  }

  async execute({ message }: MessageCommandContext): Promise<void> {
    const channel = message.channel as TextChannel;
    const commandRegistry = getCommandRegistry();
    const messageCommands = commandRegistry.getAllMessageCommands();
    const slashCommands = commandRegistry.getAllSlashCommands();

    const embed = new EmbedBuilder()
      .setTitle("📚 Command List")
      .setColor(0x0099ff)
      .setTimestamp()
      .setFooter({ text: "Discord Bot" });

    // Slash Commands
    if (slashCommands.length > 0) {
      const slashCommandList = slashCommands
        .map((cmd) => {
          const description =
            "description" in cmd.data ? cmd.data.description : "No description available";
          return `\`/${cmd.data.name}\` - ${description}`;
        })
        .join("\n");
      embed.addFields({
        name: "🔹 Slash Commands",
        value: slashCommandList || "No slash commands available",
        inline: false,
      });
    }

    // Message Commands
    if (messageCommands.length > 0) {
      const messageCommandList = messageCommands
        .map((cmd) => `\`${cmd.data.name}\` - ${cmd.data.description}`)
        .join("\n");
      embed.addFields({
        name: "💬 Message Commands",
        value: messageCommandList || "No message commands available",
        inline: false,
      });
    }

    await channel.send({ embeds: [embed] });
  }
}
