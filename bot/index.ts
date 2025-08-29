import { Client, Events, GatewayIntentBits } from "discord.js";
import { db } from "../database";
import { botStatus } from "../database/schemas";
import { eq } from "drizzle-orm";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const startTime = Date.now();
let heartbeatInterval: Timer;

const updateBotStatus = async (
  status: "online" | "offline" | "starting",
  botInfo?: {
    username?: string;
    guildCount?: number;
    uptime?: string;
  }
) => {
  try {
    const existing = await db.select().from(botStatus).limit(1);

    const statusData = {
      status,
      lastHeartbeat: new Date(),
      botInfo,
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

const startHeartbeat = (readyClient: Client) => {
  const sendHeartbeat = async () => {
    const uptimeMs = Date.now() - startTime;
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);

    const uptime = `${hours}h ${minutes}m ${seconds}s`;
    const guildCount = readyClient.guilds.cache.size;

    await updateBotStatus("online", {
      username: readyClient.user?.tag,
      guildCount,
      uptime,
    });
  };

  // Initial heartbeat
  sendHeartbeat();

  // Set up interval (every 30 seconds)
  heartbeatInterval = setInterval(sendHeartbeat, 30000);
};

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  startHeartbeat(readyClient);
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

  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  await updateBotStatus("offline");

  client.destroy();
  process.exit(0);
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

// Set status to starting
updateBotStatus("starting");

client.login(Bun.env.DISCORD_BOT_TOKEN);
