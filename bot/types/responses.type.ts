export interface DatabaseStatusResponse {
  status: "online" | "offline";
  responseTime?: string;
  error?: string;
  timestamp: string;
}
