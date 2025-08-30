import type { Client } from "discord.js";

export function getBotStatus(client: Client) {
  const status = {
    online: client.readyAt !== null,
    uptime: client.uptime ? Math.floor(client.uptime / 1000) : 0,
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    ping: client.ws.ping,
    readyAt: client.readyAt?.toISOString() || null,
    user: client.user
      ? {
          username: client.user.username,
          id: client.user.id,
          discriminator: client.user.discriminator,
        }
      : null,
  };

  return status;
}
