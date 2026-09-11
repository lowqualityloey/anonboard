import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/db";

type BoardsResult = Awaited<ReturnType<typeof fetchBoardsFromDb>>;

const BOARDS_CACHE_TTL_MS = 60_000; // 60 seconds

let cachedBoards: BoardsResult | null = null;
let cachedBoardsTimestamp = 0;
let inflightBoardsPromise: Promise<BoardsResult> | null = null;

async function fetchBoardsFromDb() {
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

/**
 * Invalidates the in-memory boards cache.
 * Call this after mutations that change board metadata or thread counts.
 */
export function invalidateBoardsCache() {
  cachedBoards = null;
  cachedBoardsTimestamp = 0;
  inflightBoardsPromise = null;
}

export async function getBoards() {
  const now = Date.now();
  if (cachedBoards && now - cachedBoardsTimestamp < BOARDS_CACHE_TTL_MS) {
    return cachedBoards;
  }

  if (inflightBoardsPromise) {
    return inflightBoardsPromise;
  }

  inflightBoardsPromise = fetchBoardsFromDb()
    .then((data) => {
      cachedBoards = data;
      cachedBoardsTimestamp = Date.now();
      inflightBoardsPromise = null;
      return data;
    })
    .catch((err) => {
      inflightBoardsPromise = null;
      throw err;
    });

  return inflightBoardsPromise;
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

