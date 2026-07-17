import { Prisma } from "@/app/generated/prisma/client";
import prisma from "../prisma";
import {
  CreatePostInput,
  ListPostsQuery,
  UpdatePostInput,
} from "../validations/post.schema";
import { NotFound } from "../api/errors";

export const postService = {
  async listPosts(query: ListPostsQuery) {
    const { cursor, limit, status, search, sort, order } = query;

    const where: Prisma.PostWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Cursor Pagination
    const [totalItems, posts] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { [sort]: order },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    let nextCursor: string | null = null;

    if (posts.length > limit) {
      const nextItem = posts.pop()!;
      nextCursor = nextItem.id;
    }

    return {
      posts,
      meta: {
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        nextCursor,
      },
    };

    // Offset Pagination
    // const [totalItems, posts] = await prisma.$transaction([
    //   prisma.post.count({ where }),
    //   prisma.post.findMany({
    //     where,
    //     orderBy: { [sort]: order },
    //     skip: (page - 1) * limit,
    //     take: limit,
    //     include: {
    //       author: {
    //         select: {
    //           id: true,
    //           name: true,
    //         },
    //       },
    //     },
    //   }),
    // ]);

    // return {
    //   page,
    //   posts,
    //   meta: {
    //     limit,
    //     totalItems,
    //     totalPages: Math.ceil(totalItems / limit),
    //   },
    // };
  },

  async getPost(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw NotFound("Post");
    }

    return { post };
  },

  async createPost(input: CreatePostInput) {
    return prisma.post.create({ data: input });
  },

  async updatePost(id: string, input: UpdatePostInput) {
    return prisma.post.update({ where: { id }, data: input });
  },
  async deletePost(id: string) {
    return prisma.post.delete({ where: { id } });
  },
};
