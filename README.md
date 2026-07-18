# REST Recipe

Next.js REST API template with structured error handling, request validation, rate limiting, and Prisma-backed data access.

## Directory Structure

```ts
└── rest-recipe/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    │       └── v1/
    │           ├── health/
    │           │   └── route.ts
    │           └── posts/
    │               ├── route.ts
    │               └── [id]/
    │                   └── route.ts
    ├── lib/
    │   ├── prisma.ts
    │   ├── api/
    │   │   ├── errors.ts
    │   │   ├── handler.ts
    │   │   ├── rateLimit.ts
    │   │   ├── responses.ts
    │   │   └── validate.ts
    │   ├── services/
    │   │   └── post.service.ts
    │   ├── utils/
    │   │   └── env.ts
    │   └── validations/
    │       └── post.schema.ts
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    │       ├── migration_lock.toml
    │       └── 20260715061435_init/
    │           └── migration.sql
    ├── README.md
    ├── AGENTS.md
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── prisma.config.ts
    ├── proxy.ts
    ├── tsconfig.json

```

## Project Structure

### `app/`

Next.js App Router entry points for the UI and versioned API routes.

| File                         | Description                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`                 | Root layout. Applies global fonts, metadata, and base HTML structure for all pages.                                                 |
| `page.tsx`                   | Default landing page. Placeholder UI for local development.                                                                         |
| `globals.css`                | Global styles and Tailwind CSS imports.                                                                                             |
| `api/v1/health/route.ts`     | Health check endpoint. Returns a simple status payload and environment indicator.                                                   |
| `api/v1/posts/route.ts`      | Posts collection endpoint. Supports listing posts with pagination, filtering, and sorting (`GET`), and creating new posts (`POST`). |
| `api/v1/posts/[id]/route.ts` | Single post endpoint. Supports fetching (`GET`), partial updates (`PATCH`), and deletion (`DELETE`) by post ID.                     |

### `lib/`

Shared application logic used by API routes and services.

#### `lib/api/`

| File           | Description                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handler.ts`   | Route wrapper (`withErrorHandler`) that applies rate limiting, centralizes error handling, and maps Prisma and application errors to consistent HTTP responses. |
| `errors.ts`    | Typed API error class and factory helpers for common HTTP error cases (not found, unauthorized, validation, conflict, etc.).                                    |
| `responses.ts` | Standard response helpers for success (`ok`, `created`), failure (`fail`), and empty responses (`noContent`).                                                   |
| `validate.ts`  | Request parsing utilities. Validates JSON request bodies and query strings against Zod schemas.                                                                 |
| `rateLimit.ts` | Upstash Redis-backed rate limiting. Identifies clients by API key or IP and enforces per-route limits with standard rate limit headers.                         |

#### `lib/services/`

| File              | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `post.service.ts` | Post domain logic. Handles cursor-based listing, retrieval, creation, updates, and deletion via Prisma. |

#### `lib/validations/`

| File             | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `post.schema.ts` | Zod schemas and TypeScript types for post list queries, create payloads, and update payloads. |

#### Other

| File           | Description                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `prisma.ts`    | Singleton Prisma client configured with the PostgreSQL adapter. Reuses the client in development to avoid connection exhaustion. |
| `utils/env.ts` | Environment configuration and startup validation for required variables such as `DATABASE_URL`.                                  |

### `proxy.ts`

Next.js middleware proxy for API routes under `/api/*`. Handles CORS preflight (`OPTIONS`) requests and attaches cross-origin response headers for allowed origins. Permits configured origins in development and forwards allowed methods and headers for API clients.

### Environment Variables

```ts
NODE_ENV = "production";

DATABASE_URL =
  "postgresql://neondb_owner:asdfasdfasdfmode=require&channel_binding=require";

UPSTASH_REDIS_REST_URL = "https://your.upstash.io";
UPSTASH_REDIS_REST_TOKEN = "your-token-asdfas0jpiuhewqnaskjdbxzmcoaidhf";
```

---
