import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";
import { createPostSchema } from "~/lib/validation";
import { getOrCreateAnonId, generateAnonName } from "~/server/anon";

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

    // Resolve anonymous identity & deterministic tag for this thread
    const anonId = await getOrCreateAnonId();
    const anonName = generateAnonName(anonId, data.threadId);

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
