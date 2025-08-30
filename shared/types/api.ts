// Shared types used across bot and web applications

export interface DatabaseStatusResponse {
  status: "online" | "offline";
  responseTime?: string;
  error?: string;
  timestamp: string;
}
