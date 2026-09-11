import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "~/server/db";
import { isAuthenticatedAdmin } from "~/server/auth";

const deleteThreadSchema = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
});

const deletePostSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
});

const lockThreadSchema = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
  isLocked: z.boolean(),
});

export const adminSoftDeleteThreadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => deleteThreadSchema.parse(data))
  .handler(async ({ data }) => {
    if (!isAuthenticatedAdmin()) {
      throw new Error("Unauthorized: Admin session required");
    }

    const thread = await prisma.thread.update({
      where: { id: data.threadId },
      data: { isDeleted: true },
    });

    return thread;
  });

export const adminSoftDeletePostFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => deletePostSchema.parse(data))
  .handler(async ({ data }) => {
    if (!isAuthenticatedAdmin()) {
      throw new Error("Unauthorized: Admin session required");
    }

    const post = await prisma.post.update({
      where: { id: data.postId },
      data: { isDeleted: true },
    });

    return post;
  });

export const adminToggleLockThreadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => lockThreadSchema.parse(data))
  .handler(async ({ data }) => {
    if (!isAuthenticatedAdmin()) {
      throw new Error("Unauthorized: Admin session required");
    }

    const thread = await prisma.thread.update({
      where: { id: data.threadId },
      data: { isLocked: data.isLocked },
    });

    return thread;
  });

export const getAdminModerationListFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isAuthenticatedAdmin()) {
    return {
      isAuthenticated: false,
      threads: [],
      recentPosts: [],
    };
  }

  const [threads, recentPosts] = await Promise.all([
    prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        board: true,
        _count: {
          select: { posts: true },
        },
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        thread: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
  ]);

  return {
    isAuthenticated: true,
    threads,
    recentPosts,
  };
});
