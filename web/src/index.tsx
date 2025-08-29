import { serve } from "bun";
import { sql } from "drizzle-orm";
import { db } from "../../database";
import { botStatus } from "../../database/schemas";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(_req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(_req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/status/database": async (_req) => {
      try {
        const start = Date.now();
        await db.execute(sql`SELECT 1`);
        const responseTime = Date.now() - start;

        return Response.json({
          status: "online",
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return Response.json(
          {
            status: "offline",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
          { status: 503 }
        );
      }
    },

    "/api/status/bot": async (_req) => {
      try {
        const result = await db.select().from(botStatus).limit(1);

        if (result.length === 0) {
          return Response.json({
            status: "offline",
            lastSeen: null,
            botInfo: null,
          });
        }

        const botData = result[0]!;
        const lastHeartbeat = new Date(botData.lastHeartbeat);
        const now = new Date();
        const timeDiff = now.getTime() - lastHeartbeat.getTime();

        // Consider bot offline if no heartbeat for more than 2 minutes
        const isOnline = timeDiff < 2 * 60 * 1000;

        return Response.json({
          status: isOnline ? botData.status : "offline",
          lastSeen: lastHeartbeat.toISOString(),
          botInfo: botData.botInfo,
          timestamp: now.toISOString(),
        });
      } catch (error) {
        return Response.json(
          {
            status: "offline",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
          { status: 503 }
        );
      }
    },

    "/api/status/health": async (_req) => {
      try {
        // Check database
        const dbStart = Date.now();
        let databaseStatus;
        try {
          await db.execute(sql`SELECT 1`);
          const dbResponseTime = Date.now() - dbStart;
          databaseStatus = {
            status: "online",
            responseTime: `${dbResponseTime}ms`,
          };
        } catch (dbError) {
          databaseStatus = {
            status: "offline",
            error: dbError instanceof Error ? dbError.message : "Unknown error",
          };
        }

        // Check bot
        let botStatusData;
        try {
          const result = await db.select().from(botStatus).limit(1);

          if (result.length === 0) {
            botStatusData = {
              status: "offline",
              lastSeen: null,
              botInfo: null,
            };
          } else {
            const botData = result[0]!;
            const lastHeartbeat = new Date(botData.lastHeartbeat);
            const timeDiff = Date.now() - lastHeartbeat.getTime();
            const isOnline = timeDiff < 2 * 60 * 1000;

            botStatusData = {
              status: isOnline ? botData.status : "offline",
              lastSeen: lastHeartbeat.toISOString(),
              botInfo: botData.botInfo,
            };
          }
        } catch (botError) {
          botStatusData = {
            status: "offline",
            error: botError instanceof Error ? botError.message : "Unknown error",
          };
        }

        // Determine overall health
        const dbHealthy = databaseStatus.status === "online";
        const botHealthy = botStatusData.status === "online";

        let overallStatus: "healthy" | "degraded" | "unhealthy";
        if (dbHealthy && botHealthy) {
          overallStatus = "healthy";
        } else if (dbHealthy || botHealthy) {
          overallStatus = "degraded";
        } else {
          overallStatus = "unhealthy";
        }

        return Response.json({
          status: overallStatus,
          timestamp: new Date().toISOString(),
          services: {
            database: databaseStatus,
            bot: botStatusData,
          },
        });
      } catch (error) {
        return Response.json(
          {
            status: "unhealthy",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
          { status: 503 }
        );
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
