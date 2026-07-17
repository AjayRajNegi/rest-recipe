// app/api/v1/posts/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { postService } from "@/lib/services/post.service";

vi.mock("@/lib/services/post.service", () => ({
  postService: {
    listPosts: vi.fn(),
    getPost: vi.fn(),
    createPost: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/v1/posts", () => {
  it("returns posts with pagination meta", async () => {
    vi.mocked(postService.listPosts).mockResolvedValue({
      posts: [
        {
          id: "1",
          title: "Hello",
          content: "Some content",
          status: "PUBLISHED",
          authorId: "u1",
          author: { id: "u1", name: "Alice" },
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ],
      meta: {
        limit: 20,
        totalItems: 1,
        totalPages: 1,
        nextCursor: null,
      },
    });

    const request = new NextRequest(
      "http://localhost/api/v1/posts?status=PUBLISHED&limit=20",
    );

    const response = await GET(request, { dynamicLimit: { limit: 60 } });
    const body = await response.json();
    expect(body.meta).toEqual({
      limit: 20,
      totalItems: 1,
      totalPages: 1,
      nextCursor: null,
    });

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.meta).toEqual({ page: 1, pageSize: 20, total: 1 });
    expect(postService.listPosts).toHaveBeenCalledWith(
      expect.objectContaining({ status: "PUBLISHED", limit: 20 }),
    );
  });

  it("returns 400 for an invalid query param", async () => {
    const request = new NextRequest(
      "http://localhost/api/v1/posts?status=NOT_A_STATUS",
    );

    const response = await GET(request, { dynamicLimit: { limit: 60 } });

    expect(response.status).toBe(400);
    expect(postService.listPosts).not.toHaveBeenCalled();
  });

  it("propagates a service error as a 500 (or your handler's mapped code)", async () => {
    vi.mocked(postService.listPosts).mockRejectedValue(new Error("DB down"));

    const request = new NextRequest("http://localhost/api/v1/posts");
    const response = await GET(request, { dynamicLimit: { limit: 60 } });

    expect(response.status).toBe(500);
  });
});

// describe("POST /api/v1/posts", () => {
//   it("creates a post and returns 201 with Location header", async () => {
//     vi.mocked(postService.createPost).mockResolvedValue({
//       id: "abc123",
//       title: "New Post",
//       content: "Body text",
//       status: "DRAFT",
//     });

//     const request = new NextRequest("http://localhost/api/v1/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: "New Post", content: "Body text" }),
//     });

//     const response = await POST(request);
//     const body = await response.json();

//     expect(response.status).toBe(201);
//     expect(body.data.id).toBe("abc123");
//     expect(response.headers.get("Location")).toBe("/api/v1/posts/abc123");
//   });

//   it("returns 400 when the body fails schema validation", async () => {
//     const request = new NextRequest("http://localhost/api/v1/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: "" }), // missing/invalid fields
//     });

//     const response = await POST(request);

//     expect(response.status).toBe(400);
//     expect(postService.createPost).not.toHaveBeenCalled();
//   });
// });
