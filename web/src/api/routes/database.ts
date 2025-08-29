import { StatusService } from "../services/statusService";

export const databaseRoutes = {
  "/api/status/database": async (_req: Request): Promise<Response> => {
    const result = await StatusService.checkDatabase();

    if (result.status === "offline") {
      return Response.json(result, { status: 503 });
    }

    return Response.json(result);
  },
};
