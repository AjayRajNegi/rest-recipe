# REST-API recipe

## 1. Directory Structure

    Contract-first, versioned API with clear separation between HTTP concerns, business logic, and data access.

```ts
src/
  app/
    api/
      v1/
        users/
          route.ts           # GET /api/v1/users, POST /api/v1/users
          [id]/
            route.ts         # GET /api/v1/users/:id, PATCH, DELETE
        posts/
          route.ts
      api-docs/
        page.tsx             # Scalar/Swagger UI rendering
  lib/
    api/
      errors.ts              # Custom error hierarchy (APIError, ValidationError, NotFoundError)
      response.ts            # Standardized envelope { success, data, error, meta }
      middleware.ts          # HOF wrappers: withAuth, withRateLimit, withValidation, withLogging
      rate-limit.ts          # Redis/Upstash limiter instances (sliding window, token bucket)
      openapi.ts             # Spec aggregation
    schemas/                 # Zod contracts (single source of truth)
      user.ts
      pagination.ts
    services/                # Business logic (no HTTP semantics)
      user.service.ts
    repositories/            # Database/ORM logic
      user.repo.ts
    utils/
      pagination.ts          # Cursor/offset helpers
      filtering.ts           # Query param → Prisma/Drizzle where clause builder
      sorting.ts             # Query param → orderBy builder
  middleware.ts              # Edge middleware: coarse IP rate limiting, auth pre-check
```
