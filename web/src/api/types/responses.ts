export interface DatabaseStatusResponse {
  status: "online" | "offline";
  responseTime?: string;
  error?: string;
  timestamp: string;
}

export interface BotStatusResponse {
  status: "online" | "offline" | "starting";
  lastSeen: string | null;
  error?: string;
  timestamp: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    database: DatabaseStatusResponse;
    bot: BotStatusResponse;
  };
  error?: string;
}

export interface HelloResponse {
  message: string;
  method?: string;
}
