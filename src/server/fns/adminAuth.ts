import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isAuthenticatedAdmin, setAdminSession, clearAdminSession } from "~/server/auth";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const configuredPassword = process.env.ADMIN_PASSWORD || "admin";

    if (data.password !== configuredPassword) {
      throw new Error("Invalid password");
    }

    setAdminSession();
    return { success: true };
  });

export const adminLogoutFn = createServerFn({ method: "POST" }).handler(async () => {
  clearAdminSession();
  return { success: true };
});

export const checkAdminAuthFn = createServerFn({ method: "GET" }).handler(async () => {
  return { isAuthenticated: isAuthenticatedAdmin() };
});
