import type { Client } from "discord.js";
import { createRoutes } from "./routes";
import { handleCors } from "./middleware/cors";
import { createResponseHelper } from "./middleware/response";
import type { ApiRequest } from "./types";

export function createApiServer(client: Client) {
  const routes = createRoutes(client);

  console.info("[API] Starting server on port 3333");

  return Bun.serve({
    port: 3333,

    async fetch(request) {
      const url = new URL(request.url);

      // Handle CORS preflight
      const corsResponse = handleCors(request);
      if (corsResponse) {
        return corsResponse;
      }

      console.info(`[API] ${request.method} ${url.pathname}`);

      // Find matching route
      const route = routes.find((r) => r.method === request.method && r.path === url.pathname);

      if (!route) {
        console.warn(`[API] Route not found: ${request.method} ${url.pathname}`);
        const res = createResponseHelper();
        return res.error("Endpoint not found", 404);
      }

      try {
        const req: ApiRequest = { request };
        const res = createResponseHelper();

        return await route.handler(req, res);
      } catch (error) {
        console.error("[API] Request handler error:", error);
        const res = createResponseHelper();
        return res.error("Internal server error", 500);
      }
    },
  });
}
