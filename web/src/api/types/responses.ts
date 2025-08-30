export interface DatabaseStatusResponse {
  status: "online" | "offline";
  responseTime?: string;
  error?: string;
  timestamp: string;
}

export interface HelloResponse {
  message: string;
  method?: string;
}
