import { z } from "zod";

export const listPostsQuerySechame = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(10),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  search: z.string().trim().max(200).optional(),
  sort: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySechame>;
