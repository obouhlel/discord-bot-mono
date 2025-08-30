export interface ApiRequest {
  request: Request;
  params?: Record<string, string>;
}

export interface ApiResponse {
  json: (data: unknown, status?: number) => Response;
  error: (message: string, status?: number) => Response;
}

export type RouteHandler = (req: ApiRequest, res: ApiResponse) => Promise<Response> | Response;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
}
