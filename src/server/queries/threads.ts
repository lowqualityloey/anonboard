import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";

export async function getThreadsByBoardSlug(slug: string) {
  const board = await prisma.board.findUnique({
    where: { slug },
  });

  if (!board) {
    return null;
  }

  const threads = await prisma.thread.findMany({
    where: {
      boardId: board.id,
      isDeleted: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      body: true,
      anonName: true,
      createdAt: true,
      updatedAt: true,
      isLocked: true,
      _count: {
        select: {
          posts: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });

  return {
    board,
    threads,
  };
}

export async function getThreadById(id: string) {
  return prisma.thread.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      board: true,
      posts: {
        where: { isDeleted: false },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          threadId: true,
          body: true,
          anonName: true,
          createdAt: true,
          isDeleted: true,
        },
      },
      _count: {
        select: {
          posts: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });
}

export const getThreadsByBoardSlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return getThreadsByBoardSlug(slug);
  });

export const getThreadByIdFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getThreadById(id);
  });

