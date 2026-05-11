import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

export async function GET() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  const fixedActivities = await prisma.fixedActivity.findMany({
    where: { userId: user.id },
    orderBy: { dayOfWeek: "asc" },
  });
  return NextResponse.json({ userId: user.id, profile, fixedActivities });
}

type ActivityInput = {
  dayOfWeek: number;
  activity: string;
  intensity: string;
  durationMin: number;
};

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  const body = (await req.json()) as {
    displayName?: string | null;
    age?: number | null;
    sex?: string | null;
    weightLbs?: number | null;
    heightInches?: number | null;
    goal?: string;
    fitnessLevel?: string;
    minutesPerDay?: number;
    equipment?: string;
    injuries?: string | null;
    notes?: string | null;
    fixedActivities?: ActivityInput[];
  };

  const data = {
    displayName: body.displayName ?? null,
    age: body.age ?? null,
    sex: body.sex ?? null,
    weightLbs: body.weightLbs ?? null,
    heightInches: body.heightInches ?? null,
    goal: body.goal ?? "general_fitness",
    fitnessLevel: body.fitnessLevel ?? "beginner",
    minutesPerDay: body.minutesPerDay ?? 30,
    equipment: body.equipment ?? "none",
    injuries: body.injuries ?? null,
    notes: body.notes ?? null,
  };

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });

  if (body.fixedActivities) {
    await prisma.fixedActivity.deleteMany({ where: { userId: user.id } });
    if (body.fixedActivities.length > 0) {
      await prisma.fixedActivity.createMany({
        data: body.fixedActivities.map((a) => ({
          userId: user.id,
          dayOfWeek: a.dayOfWeek,
          activity: a.activity,
          intensity: a.intensity,
          durationMin: a.durationMin,
        })),
      });
    }
  }

  // Invalidate any cached generated days so they re-generate with the new profile.
  await prisma.generatedDay.deleteMany({ where: { userId: user.id } });

  return NextResponse.json({ ok: true, profile });
}
