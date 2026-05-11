import Link from "next/link";
import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import {
  generateWeek,
  isoStartOfWeek,
  isoToday,
  ProfileInput,
  FixedActivityInput,
} from "@/lib/generator";

export default async function WeekPage() {
  const user = await getOrCreateUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  if (!profile) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Set up your profile first</h1>
        <Link
          href="/onboarding"
          className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Get started
        </Link>
      </div>
    );
  }

  const fixed = await prisma.fixedActivity.findMany({ where: { userId: user.id } });
  const start = isoStartOfWeek(isoToday());
  const days = generateWeek(
    profile as unknown as ProfileInput,
    fixed as unknown as FixedActivityInput[],
    start,
    user.id,
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">This week</h1>
      <p className="text-sm text-slate-600">
        Click any day to see the full program. Sport days frame your match with warm-up and
        cool-down; cardio days add a short bodyweight circuit; free days are bodyweight sessions.
      </p>
      <div className="grid gap-3">
        {days.map((d) => (
          <article
            key={d.date}
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {d.dayName} · {d.date}
                </p>
                <h2 className="text-lg font-semibold">{d.theme}</h2>
              </div>
              <p className="text-sm text-slate-500">~{d.totalMinutes} min</p>
            </div>
            <p className="mt-1 text-sm text-slate-600">{d.summary}</p>

            <details className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
              <summary className="cursor-pointer select-none font-medium text-slate-700">
                Show {d.blocks.length} blocks
              </summary>
              <div className="mt-2 space-y-2">
                {d.blocks.map((b, i) => (
                  <div key={i}>
                    <p className="font-medium text-slate-700">
                      {b.title}{" "}
                      <span className="ml-1 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
                        {b.kind}
                      </span>
                    </p>
                    <ul className="ml-4 list-disc text-slate-600">
                      {b.items.map((it, j) => (
                        <li key={j}>
                          {it.name}
                          {it.freeform
                            ? ` — ${it.freeform}`
                            : it.prescription
                              ? ` — ${it.sets ?? ""}${it.sets ? " × " : ""}${it.prescription}`
                              : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
