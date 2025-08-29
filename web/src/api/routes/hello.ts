import type { HelloResponse } from "../types/responses";
import type { BunRequest } from "../types/request";

export const helloRoutes = {
  "/api/hello": {
    async GET(_req: Request): Promise<Response> {
      const response: HelloResponse = {
        message: "Hello, world!",
        method: "GET",
      };
      return Response.json(response);
    },
    async PUT(_req: Request): Promise<Response> {
      const response: HelloResponse = {
        message: "Hello, world!",
        method: "PUT",
      };
      return Response.json(response);
    },
  },

  "/api/hello/:name": async (req: BunRequest): Promise<Response> => {
    const name = req.params.name;
    const response: HelloResponse = {
      message: `Hello, ${name}!`,
    };
    return Response.json(response);
  },
};
