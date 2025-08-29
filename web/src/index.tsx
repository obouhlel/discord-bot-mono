import { serve } from "bun";
import { apiRoutes } from "./api";
import index from "./index.html";

const server = serve({
  routes: {
    // API routes
    ...apiRoutes,

    // Serve index.html for all unmatched routes (frontend)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
