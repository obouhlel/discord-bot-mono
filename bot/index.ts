import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { createApiServer } from "@api/server";
import { initializeCommands } from "@commands/commands";

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message],
});

// Initialize command registry
const commandRegistry = initializeCommands(client);

// Discord event handlers
client.on(Events.ClientReady, async (readyClient) => {
  console.info(`[Bot] Logged in as ${readyClient.user.tag}`);
  console.info(`[Bot] Connected to ${readyClient.guilds.cache.size} guilds`);

  // Deploy commands on startup
  const deployed = await commandRegistry.deploySlashCommands();
  if (deployed && Bun.env.NODE_ENV === "production") {
    console.info("[Bot] Slash commands deployed on startup");
  }
});

// Slash command handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.info(
    `[Bot] Slash command received: ${interaction.commandName} from ${interaction.user.tag}`
  );

  // Get command from registry
  const command = commandRegistry.getSlashCommand(interaction.commandName);

  if (!command) {
    console.warn(`[Bot] Unknown slash command: ${interaction.commandName}`);
    await interaction.reply({ content: "Unknown command!", ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction);
    console.info(`[Bot] Slash command executed successfully: ${interaction.commandName}`);
  } catch (error) {
    console.error(`[Bot] Error executing slash command ${interaction.commandName}:`, error);

    const errorMessage = { content: "There was an error executing this command!", ephemeral: true };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Message command handler
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const commandName = message.content.toLowerCase();

  if (!commandName) return;

  console.info(`[Bot] Message command received: ${commandName} from ${message.author.tag}`);

  const command = commandRegistry.getMessageCommand(commandName);

  if (!command) {
    console.warn(`[Bot] Unknown message command: ${commandName}`);
    return; // Silently ignore unknown message commands
  }

  const context = { client, message };

  try {
    // Check if command should execute
    const shouldExecute = await command.shouldExecute(context);
    if (!shouldExecute) return;

    await command.execute(context);
    console.info(`[Bot] Message command executed successfully: ${commandName}`);
  } catch (error) {
    console.error(`[Bot] Error executing message command ${commandName}:`, error);
    try {
      await message.reply("There was an error executing this command!");
    } catch (replyError) {
      console.error(`[Bot] Failed to send error message:`, replyError);
    }
  }
});

// Handle errors
client.on(Events.Error, (error) => {
  console.error("[Bot] Discord client error:", error);
});

client.on(Events.Warn, (info) => {
  console.warn("[Bot] Discord client warning:", info);
});

// Graceful shutdown
const handleShutdown = async () => {
  console.info("[Bot] Shutting down gracefully...");

  try {
    client.destroy();
    console.info("[Bot] Discord client disconnected");
  } catch (error) {
    console.error("[Bot] Error during shutdown:", error);
  }

  process.exit(0);
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

// Start API server
const server = createApiServer(client);
console.info(`[API] Server running at http://localhost:${server.port}`);

// Login to Discord
console.info("[Bot] Connecting to Discord...");
client.login(Bun.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error("[Bot] Failed to login:", error);
  process.exit(1);
});
