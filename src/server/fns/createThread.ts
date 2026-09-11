import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";
import { createThreadSchema } from "~/lib/validation";
import { getOrCreateAnonId, generateAnonName } from "~/server/anon";

export const createThreadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => createThreadSchema.parse(data))
  .handler(async ({ data }) => {
    // Resolve anonymous identity & deterministic tag for OP
    const anonId = await getOrCreateAnonId();
    // For a new thread, we derive the tag deterministically using the user ID and board + title timestamp seed
    const anonName = generateAnonName(anonId, `${data.boardId}:${data.title}`);

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
