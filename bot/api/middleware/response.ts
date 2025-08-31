import { getCorsHeaders } from "@bot/api/middleware/cors";
import type { ApiResponse } from "@bot/api/types";

export function createResponseHelper(origin?: string | null): ApiResponse {
  const headers = getCorsHeaders(origin ?? null);

  return {
    json: (data: unknown, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers,
      });
    },
    error: (message: string, status = 500) => {
      return new Response(
        JSON.stringify({
          success: false,
          error: message,
        }),
        {
          status,
          headers,
        }
      );
    },
  };
}
