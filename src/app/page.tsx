import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

export default async function Home() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  if (profile) {
    redirect("/today");
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Fitness catered to <span className="text-brand-600">you</span>.
        </h1>
        <p className="mt-3 max-w-prose text-slate-600">
          Tell us your weekly schedule, what you have for equipment, and where
          you're starting from. mefit will generate a daily program around your
          life — soccer nights, walks, free days, all of it. Free for everyone.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/onboarding"
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Build my program
          </Link>
          <Link
            href="/today"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            See an example day
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Feature
          title="Schedule-aware"
          body="Soccer Tue/Thu? Long walks midweek? Your plan respects what you're already doing."
        />
        <Feature
          title="Bodyweight first"
          body="Mostly equipment-free programs that work at home, in a hotel, anywhere."
        />
        <Feature
          title="No account needed"
          body="Your profile is tied to your browser. No signup, no email, no paywall."
        />
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}
