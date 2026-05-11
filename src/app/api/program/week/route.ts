import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import {
  generateWeek,
  isoStartOfWeek,
  isoToday,
  ProfileInput,
  FixedActivityInput,
} from "@/lib/generator";

export async function GET() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return NextResponse.json({ ready: false, reason: "no_profile" }, { status: 200 });
  }
  const fixed = await prisma.fixedActivity.findMany({ where: { userId: user.id } });
  const start = isoStartOfWeek(isoToday());
  const days = generateWeek(
    profile as unknown as ProfileInput,
    fixed as unknown as FixedActivityInput[],
    start,
    user.id,
  );
  return NextResponse.json({ ready: true, start, days });
}
