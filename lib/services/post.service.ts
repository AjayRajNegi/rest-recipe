import { Prisma } from "@/app/generated/prisma/client";
import prisma from "../prisma";
import { ListPostsQuery } from "../validations/post.schema";

export const postService = {
  async listPosts(query: ListPostsQuery) {
    const { page, limit, status, search, sort, order } = query;

    const where: Prisma.PostWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [totalItems, posts] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
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

    return {
      posts,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  },
};
