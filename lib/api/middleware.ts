import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "../utils/jwt";
import { sendError } from "./response";

export interface RequestContext {
  params?: Promise<Record<string, string>>;
}

export interface AuthenticatedContext extends RequestContext {
  user: JWTPayload;
}

export type RouteHandler = (
  req: NextRequest,
  ctx: RequestContext,
) => Promise<NextResponse> | NextResponse;

export type AuthenticatedRouteHanlder = (
  req: NextRequest,
  ctx: AuthenticatedContext,
) => Promise<NextResponse> | NextResponse;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      console.log("API Error", err);

      //   if (err instanceof APIError) {
      //     return errorResponse(err);
      //   }

      const isDev = process.env.NODE_ENV === "development";
      const message = isDev ? err.message : "Internal server error";

      return sendError();
    }
  };
}
