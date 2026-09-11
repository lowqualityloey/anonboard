import { createHash, randomUUID } from "crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const ANON_COOKIE_NAME = "anon_id";
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

/**
 * Retrieves the existing `anon_id` cookie or issues a new persistent random UUID cookie.
 */
export async function getOrCreateAnonId(): Promise<string> {
  const existingId = getCookie(ANON_COOKIE_NAME);
  if (existingId) {
    return existingId;
  }

  const newId = randomUUID();
  setCookie(ANON_COOKIE_NAME, newId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_IN_SECONDS,
  });

  return newId;
}

/**
 * Computes deterministic `Anon [hash]` per user-thread pairing.
 * Invariant 4: `Anon ` + `hash(anon_id + threadId).slice(0, 4)`.
 * Same user in the same thread always receives the identical tag.
 * The same user in a different thread receives a different tag.
 */
export function generateAnonName(anonId: string, threadOrBoardId: string): string {
  const hash = createHash("sha256")
    .update(`${anonId}:${threadOrBoardId}`)
    .digest("hex")
    .slice(0, 4);

  return `Anon ${hash}`;
}
