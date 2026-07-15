import { Prisma } from "@/app/generated/prisma/client";
import { ApiError } from "./errors";
import { fail } from "./responses";

type Handler<Ctx> = (request: Request, context: Ctx) => Promise<Response>;

const isDev = process.env.NODE_ENV !== "production";
console.log(isDev);

function logError(
  level: "info" | "warn" | "error",
  err: unknown,
  extra?: object,
) {
  console[level === "info" ? "log" : level](
    JSON.stringify({
      level,
      message: isDev && err instanceof Error ? err.message : String(err),
      stack: isDev && err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      ...extra,
    }),
  );
}

export function withErrorHandler<Ctx>(handler: Handler<Ctx>): Handler<Ctx> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (err) {
      if (err instanceof ApiError) {
        logError(err.status >= 500 ? "error" : "warn", err, { code: err.code });
        return fail(
          err.status,
          err.code,
          err.message,
          err.expose ? err.details : undefined,
        );
      }

      if (
        err instanceof Prisma.PrismaClientInitializationError ||
        err instanceof Prisma.PrismaClientRustPanicError
      ) {
        logError("error", err, { type: "DB_UNAVAILABLE" });
        return fail(
          503,
          "SERVICE_UNAVAILABLE",
          "Service temporarily unavailable",
        );
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case "P2002":
            logError("warn", err, { prismaCode: err.code });
            return fail(
              409,
              "CONFLICT",
              "A record with this value already exists.",
            );
          case "P2025":
            logError("info", err, { prismaCode: err.code });
            return fail(404, "NOT_FOUND", "Resource not found");
          case "P2003":
            logError("warn", err, { prismaCode: err.code });
            return fail(
              422,
              "INVALID_REFERENCE",
              "Referenced resource does not exist",
            );
          default:
            logError("error", err, { prismaCode: err.code, unhandled: true });
            return fail(500, "INTERNAL_ERROR", "An unexpected error occurred");
        }
      }

      if (err instanceof Prisma.PrismaClientValidationError) {
        logError("warn", err);
        return fail(400, "BAD_REQUEST", "Invalid request data");
      }

      logError("error", err);
      return fail(
        500,
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        isDev && err instanceof Error
          ? { message: err.message, stack: err.stack }
          : undefined,
      );
    }
  };
}
