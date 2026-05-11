import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import OnboardingForm from "@/components/OnboardingForm";

export default async function ProfilePage() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  const fixedActivities = await prisma.fixedActivity.findMany({
    where: { userId: user.id },
    orderBy: { dayOfWeek: "asc" },
  });

  const initial = profile
    ? {
        displayName: profile.displayName ?? "",
        age: profile.age?.toString() ?? "",
        sex: profile.sex ?? "",
        weightLbs: profile.weightLbs?.toString() ?? "",
        heightFeet: profile.heightInches ? Math.floor(profile.heightInches / 12).toString() : "",
        heightInches: profile.heightInches ? (profile.heightInches % 12).toString() : "",
        goal: profile.goal,
        fitnessLevel: profile.fitnessLevel,
        minutesPerDay: profile.minutesPerDay.toString(),
        equipment: profile.equipment,
        injuries: profile.injuries ?? "",
        notes: profile.notes ?? "",
        fixedActivities: fixedActivities.map((a) => ({
          dayOfWeek: a.dayOfWeek,
          activity: a.activity,
          intensity: a.intensity as "easy" | "moderate" | "hard",
          durationMin: a.durationMin,
        })),
      }
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Your profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Saving will regenerate today's and the rest of this week's programs.
        </p>
      </header>
      <OnboardingForm initial={initial} />
    </div>
  );
}
