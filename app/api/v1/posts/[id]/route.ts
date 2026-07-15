import { withErrorHandler } from "@/lib/api/middleware";
import { noContent, ok } from "@/lib/api/responses";
import { parseBody } from "@/lib/api/validate";
import { postService } from "@/lib/services/post.service";
import { updatePostSchema } from "@/lib/validations/post.schema";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(async (_req, { params }: Ctx) => {
  const { id } = await params;
  return ok(await postService.getPost(id));
});

export const PATCH = withErrorHandler(async (request, { params }: Ctx) => {
  const { id } = await params;
  const input = await parseBody(request, updatePostSchema);
  return ok(await postService.updatePost(id, input));
});

export const DELETE = withErrorHandler(async (_req, { params }: Ctx) => {
  const { id } = await params;
  await postService.deletePost(id);
  return noContent();
});
