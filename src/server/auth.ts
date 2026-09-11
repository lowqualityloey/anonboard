import { createHmac } from "crypto";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const ADMIN_COOKIE_NAME = "anonboard_admin_session";
const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || "anonboard-fallback-secret-development-only";
}

function signSession(data: string): string {
  const secret = getSessionSecret();
  const signature = createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${signature}`;
}

function verifySignature(signedValue: string): boolean {
  const lastDot = signedValue.lastIndexOf(".");
  if (lastDot === -1) return false;

  const data = signedValue.slice(0, lastDot);
  const signature = signedValue.slice(lastDot + 1);
  const expectedSignature = createHmac("sha256", getSessionSecret()).update(data).digest("hex");

  return signature === expectedSignature;
}

export function isAuthenticatedAdmin(): boolean {
  const sessionCookie = getCookie(ADMIN_COOKIE_NAME);
  if (!sessionCookie) {
    return false;
  }
  return verifySignature(sessionCookie);
}

export function setAdminSession(): void {
  const timestamp = Date.now().toString();
  const signed = signSession(`admin:${timestamp}`);

  setCookie(ADMIN_COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export function clearAdminSession(): void {
  deleteCookie(ADMIN_COOKIE_NAME, {
    path: "/",
  });
}
