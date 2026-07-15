import { withErrorHandler } from "@/lib/api/middleware";
import { created, ok } from "@/lib/api/responses";
import { parseBody, parseQuery } from "@/lib/api/validate";
import { postService } from "@/lib/services/post.service";
import {
  createPostSchema,
  listPostsQuerySechame,
} from "@/lib/validations/post.schema";
import { NextResponse } from "next/server";

// export const GET = withErrorHandler(async (request) => {
//   const query = await parseQuery(request, listPostsQuerySechame);
//   const { posts, meta } = await postService.listPosts(query);
//   return ok(posts, meta);
// });

export const POST = withErrorHandler(async (request) => {
  const input = await parseBody(request, createPostSchema);
  const post = await postService.createPost(input);
  return created(post, `/api/v1/posts/${post.id}`);
});

export async function GET() {
  return NextResponse.json("Hello");
}
