import { Status } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";

async function main() {
  console.log("Seeding database...");

  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: "Carol Diaz",
      email: "carol@example.com",
    },
  });

  await prisma.post.create({
    data: {
      title: "Getting Started with Prisma",
      content: "Prisma makes working with databases in TypeScript a breeze.",
      status: Status.PUBLISHED,
      authorId: alice.id,
      comments: {
        create: [
          { body: "Great intro, thanks!" },
          { body: "This helped me set up my first migration." },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Advanced Query Patterns",
      content: "Let's explore nested writes, filters, and relations.",
      status: Status.PUBLISHED,
      authorId: alice.id,
      comments: {
        create: [{ body: "Could you cover raw queries next?" }],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Draft: Thoughts on Schema Design",
      content: "Still figuring out the best way to model this...",
      status: Status.DRAFT,
      authorId: bob.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Why We Archived Our Old API",
      content: "A retrospective on migrating away from REST.",
      status: Status.ARCHIVED,
      authorId: bob.id,
      comments: {
        create: [
          { body: "Interesting read, we're facing similar issues." },
          { body: "Did you consider gRPC?" },
          { body: "Following up—any update on this?" },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Anonymous Musings",
      content: "A post with no author, just to test optional relations.",
      status: Status.PUBLISHED,
      comments: {
        create: [{ body: "Who wrote this?" }],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Carol's First Post",
      content: "Hello world, this is my first post here.",
      status: Status.DRAFT,
      authorId: carol.id,
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
