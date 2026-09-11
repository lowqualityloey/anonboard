import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";

export const pollThreadFn = createServerFn({ method: "GET" })
  .validator((threadId: string) => threadId)
  .handler(async ({ data: threadId }) => {
    const posts = await prisma.post.findMany({
      where: {
        threadId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        threadId: true,
        body: true,
        anonName: true,
        createdAt: true,
        isDeleted: true,
      },
    });

    return posts;
  });
