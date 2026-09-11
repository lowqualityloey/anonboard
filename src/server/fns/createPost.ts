import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";
import { createPostSchema } from "~/lib/validation";

export const createPostFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => createPostSchema.parse(data))
  .handler(async ({ data }) => {
    // Check if thread exists and is not locked/deleted
    const thread = await prisma.thread.findUnique({
      where: { id: data.threadId },
      select: { id: true, isLocked: true, isDeleted: true },
    });

    if (!thread || thread.isDeleted) {
      throw new Error("Thread not found or deleted");
    }

    if (thread.isLocked) {
      throw new Error("Thread is locked for new replies");
    }

    // Temporary anonymous name generator until Milestone 6 deterministic session cookies
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const anonName = `Anon ${randomSuffix}`;

    // Execute in transaction to insert post and bump thread updatedAt
    const [post] = await prisma.$transaction([
      prisma.post.create({
        data: {
          threadId: data.threadId,
          body: data.body,
          anonName,
        },
      }),
      prisma.thread.update({
        where: { id: data.threadId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return post;
  });
