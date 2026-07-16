import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ApiError } from "./errors";
import { config } from "../utils/env";

const redis = new Redis({
  url: config.rateLimit.url,
  token: config.rateLimit.token,
});

const limiterCache = new Map<number, Ratelimit>();

function getLimiter(limit: number): Ratelimit {
  let limiter = limiterCache.get(limit);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(limit, "1 m"),
      prefix: "api:v1",
      analytics: true,
    });
  }
  limiterCache.set(limit, limiter);
  return limiter;
}

function resolveClientId(request: Request): string {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) return `key:${apiKey}`;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) return `ip:${ip}`;

  console.warn("[rateLimit] request had no api key or IP");
  return "anonymous";
}

export async function enforceRateLimit(
  request: Request,
  dynamicLimit: { limit: number },
) {
  const id = resolveClientId(request);
  const limiter = getLimiter(dynamicLimit.limit);

  let result;
  try {
    result = await limiter.limit(id);
  } catch (err) {
    console.error("[rateLimit] backend error, failing open", err);
    return {};
  }

  const { success, limit, remaining, reset } = result;

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(reset / 1000)),
  };

  if (!success) {
    const retryAfterSeconds = Math.max(
      0,
      Math.ceil((reset - Date.now()) / 1000),
    );
    // headers["Retry-After"] = String(retryAfterSeconds);
    throw new ApiError(
      429,
      "RATE_LIMITED",
      "Too many requests. Please retry later.",
      { retryAfterSeconds },
      //   TODO : Modify Error class to accept headers
      //   headers,
    );
  }

  return headers;
}
