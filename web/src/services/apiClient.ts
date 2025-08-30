import type { DatabaseStatusResponse, HelloResponse } from "../api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Hello endpoints
  async getHello(): Promise<HelloResponse> {
    return this.request<HelloResponse>("/api/hello");
  }

  async putHello(): Promise<HelloResponse> {
    return this.request<HelloResponse>("/api/hello", { method: "PUT" });
  }

  async getHelloName(name: string): Promise<HelloResponse> {
    return this.request<HelloResponse>(`/api/hello/${name}`);
  }

  // Status endpoints
  async getDatabaseStatus(): Promise<DatabaseStatusResponse> {
    return this.request<DatabaseStatusResponse>("/api/status/database");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
