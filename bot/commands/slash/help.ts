import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { getCommandRegistry } from "@bot/commands";

export const help = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

  async execute(interaction: ChatInputCommandInteraction) {
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

    await interaction.reply({ embeds: [embed] });
  },
};
