import { corsHeaders } from "./cors";
import type { ApiResponse } from "../types";

export function createResponseHelper(): ApiResponse {
  return {
    json: (data: unknown, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: corsHeaders,
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
          headers: corsHeaders,
        }
      );
    },
  };
}
