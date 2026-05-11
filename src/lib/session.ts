import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "mefit_uid";

/**
 * Reads the session id set by middleware. If for some reason no cookie is
 * present (e.g. request bypassed middleware), generates one synchronously and
 * sets it — this only succeeds in route handlers / server actions.
 */
async function readOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  try {
    jar.set({
      name: COOKIE_NAME,
      value: id,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  } catch {
    // Page renders can't set cookies. Fine — middleware will set it on next request.
  }
  return id;
}

export async function getOrCreateUser() {
  const id = await readOrCreateSessionId();
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: { id },
  });
}

export async function getCurrentUserId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}
