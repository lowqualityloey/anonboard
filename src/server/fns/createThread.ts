import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";
import { createThreadSchema } from "~/lib/validation";

export const createThreadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => createThreadSchema.parse(data))
  .handler(async ({ data }) => {
    // Generate a temporary anonymous display name until Milestone 6 cookie hashing
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const anonName = `Anon ${randomSuffix}`;

    const thread = await prisma.thread.create({
      data: {
        boardId: data.boardId,
        title: data.title,
        body: data.body,
        anonName,
      },
      select: {
        id: true,
        boardId: true,
      },
    });

    return thread;
  });
