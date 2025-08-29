import { Client, Events, GatewayIntentBits } from "discord.js";
import { db } from "../database";
import { botStatus } from "../database/schemas";
import { eq } from "drizzle-orm";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const updateBotStatus = async (status: "online" | "offline" | "starting") => {
  try {
    const existing = await db.select().from(botStatus).limit(1);

    const statusData = {
      status,
      lastHeartbeat: new Date(),
    };

    if (existing.length === 0) {
      await db.insert(botStatus).values(statusData);
    } else {
      await db.update(botStatus).set(statusData).where(eq(botStatus.id, existing[0]!.id));
    }
  } catch (error) {
    console.error("Failed to update bot status:", error);
  }
};

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  updateBotStatus("online");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

// Handle graceful shutdown
const handleShutdown = async () => {
  console.log("Shutting down bot...");

  await updateBotStatus("offline");

  client.destroy();
  process.exit(0);
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

updateBotStatus("starting");

client.login(Bun.env.DISCORD_BOT_TOKEN);
