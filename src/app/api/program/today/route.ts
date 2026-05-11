import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import { generateDay, isoToday, ProfileInput, FixedActivityInput } from "@/lib/generator";

export async function GET() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return NextResponse.json({ ready: false, reason: "no_profile" }, { status: 200 });
  }
  const fixed = await prisma.fixedActivity.findMany({ where: { userId: user.id } });
  const today = isoToday();

  const cached = await prisma.generatedDay.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (cached) {
    return NextResponse.json({ ready: true, day: JSON.parse(cached.programJson) });
  }

  const day = generateDay(
    profile as unknown as ProfileInput,
    fixed as unknown as FixedActivityInput[],
    today,
    user.id,
  );

  await prisma.generatedDay.create({
    data: { userId: user.id, date: today, programJson: JSON.stringify(day) },
  });

  return NextResponse.json({ ready: true, day });
}
