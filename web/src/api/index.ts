import { helloRoutes } from "./routes/hello";
import { databaseRoutes } from "./routes/database";

// Combine all API routes
export const apiRoutes = {
  ...helloRoutes,
  ...databaseRoutes,
};

// Export types for frontend use
export type * from "./types/responses";
