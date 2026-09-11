import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";

export async function getBoards() {
  return prisma.board.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          threads: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });
}

export async function getBoardBySlug(slug: string) {
  return prisma.board.findUnique({
    where: { slug },
  });
}

export const getBoardsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getBoards();
  }
);

export const getBoardBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return getBoardBySlug(slug);
  });

