import { RouteHandler, withErrorHandler } from "@/lib/api/middleware";
import { sendSuccess } from "@/lib/api/response";
import { userController } from "@/lib/controller/user.controller";

const getHandler: RouteHandler = async () => {
  // Rate limit middleware
  // Validation middleware
  const res = await userController.getUser();

  return sendSuccess("User Fetched successfully", 200, res);
};

export const GET = withErrorHandler(getHandler);
