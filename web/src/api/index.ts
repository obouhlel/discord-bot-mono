import { helloRoutes } from "./routes/hello";
import { databaseRoutes } from "./routes/database";
import { botRoutes } from "./routes/bot";
import { healthRoutes } from "./routes/health";

// Combine all API routes
export const apiRoutes = {
  ...helloRoutes,
  ...databaseRoutes,
  ...botRoutes,
  ...healthRoutes,
};

// Export types for frontend use
export type * from "./types/responses";
