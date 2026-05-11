import Link from "next/link";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import {
  generateDay,
  isoToday,
  ProfileInput,
  FixedActivityInput,
  DayProgram,
} from "@/lib/generator";
import DayProgramView from "@/components/DayProgramView";

export default async function TodayPage() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  if (!profile) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Let's set you up first</h1>
        <p className="mt-2 text-sm text-slate-600">
          We need a quick profile to tailor today's program.
        </p>
        <Link
          href="/onboarding"
          className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Set up profile
        </Link>
      </div>
    );
  }

  const fixed = await prisma.fixedActivity.findMany({ where: { userId: user.id } });
  const today = isoToday();

  let day: DayProgram;
  const cached = await prisma.generatedDay.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (cached) {
    day = JSON.parse(cached.programJson) as DayProgram;
  } else {
    day = generateDay(
      profile as unknown as ProfileInput,
      fixed as unknown as FixedActivityInput[],
      today,
      user.id,
    );
    await prisma.generatedDay.create({
      data: { userId: user.id, date: today, programJson: JSON.stringify(day) },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        <Link href="/week" className="text-sm text-brand-700 hover:underline">
          See the week →
        </Link>
      </div>
      <DayProgramView day={day} />
    </div>
  );
}
