import { z } from "zod";

export const listPostsQuerySechame = z.object({
  // For offset pagination:
  // page: z.coerce.number().int().min(1).default(1),

  // For cursor pagination
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(10),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  search: z.string().trim().max(200).optional(),
  sort: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  authorId: z.string().uuid(),
});

export const updatePostSchema = createPostSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type ListPostsQuery = z.infer<typeof listPostsQuerySechame>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
