import { StatusService } from "../services/statusService";

export const botRoutes = {
  "/api/status/bot": async (_req: Request): Promise<Response> => {
    const result = await StatusService.checkBot();

    if (result.status === "offline") {
      return Response.json(result, { status: 503 });
    }

    return Response.json(result);
  },
};
