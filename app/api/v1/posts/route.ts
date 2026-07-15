import { withErrorHandler } from "@/lib/api/middleware";
import { ok } from "@/lib/api/responses";
import { parseQuery } from "@/lib/api/validate";
import { postService } from "@/lib/services/post.service";
import { listPostsQuerySechame } from "@/lib/validations/post.schema";

export const GET = withErrorHandler(async (request) => {
  const query = parseQuery(request, listPostsQuerySechame);
  const { posts, meta } = await postService.listPosts(query);
  return ok(posts, meta);
});
