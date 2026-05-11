"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Activity = {
  dayOfWeek: number;
  activity: string;
  intensity: "easy" | "moderate" | "hard";
  durationMin: number;
};

type ProfileState = {
  displayName: string;
  age: string;
  sex: string;
  weightLbs: string;
  heightFeet: string;
  heightInches: string;
  goal: string;
  fitnessLevel: string;
  minutesPerDay: string;
  equipment: string;
  injuries: string;
  notes: string;
  fixedActivities: Activity[];
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const blankActivity = (): Activity => ({
  dayOfWeek: 1,
  activity: "walk",
  intensity: "easy",
  durationMin: 30,
});

const ACTIVITY_OPTIONS = [
  "soccer",
  "basketball",
  "tennis",
  "running",
  "walk",
  "bike",
  "swim",
  "yoga",
  "hike",
  "climbing",
  "other",
];

export default function OnboardingForm({
  initial,
}: {
  initial?: Partial<ProfileState> | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<ProfileState>({
    displayName: initial?.displayName ?? "",
    age: initial?.age ?? "",
    sex: initial?.sex ?? "",
    weightLbs: initial?.weightLbs ?? "",
    heightFeet: initial?.heightFeet ?? "",
    heightInches: initial?.heightInches ?? "",
    goal: initial?.goal ?? "general_fitness",
    fitnessLevel: initial?.fitnessLevel ?? "beginner",
    minutesPerDay: initial?.minutesPerDay ?? "30",
    equipment: initial?.equipment ?? "none",
    injuries: initial?.injuries ?? "",
    notes: initial?.notes ?? "",
    fixedActivities: initial?.fixedActivities ?? [],
  });

  useEffect(() => {
    if (initial?.fixedActivities && state.fixedActivities.length === 0) {
      setState((s) => ({ ...s, fixedActivities: initial.fixedActivities ?? [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof ProfileState>(key: K, value: ProfileState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function addActivity() {
    setState((s) => ({ ...s, fixedActivities: [...s.fixedActivities, blankActivity()] }));
  }

  function updateActivity(i: number, patch: Partial<Activity>) {
    setState((s) => ({
      ...s,
      fixedActivities: s.fixedActivities.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    }));
  }

  function removeActivity(i: number) {
    setState((s) => ({
      ...s,
      fixedActivities: s.fixedActivities.filter((_, idx) => idx !== i),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const heightTotalInches =
      (state.heightFeet ? parseInt(state.heightFeet, 10) * 12 : 0) +
      (state.heightInches ? parseFloat(state.heightInches) : 0);

    const payload = {
      displayName: state.displayName || null,
      age: state.age ? parseInt(state.age, 10) : null,
      sex: state.sex || null,
      weightLbs: state.weightLbs ? parseFloat(state.weightLbs) : null,
      heightInches: heightTotalInches > 0 ? heightTotalInches : null,
      goal: state.goal,
      fitnessLevel: state.fitnessLevel,
      minutesPerDay: parseInt(state.minutesPerDay || "30", 10),
      equipment: state.equipment,
      injuries: state.injuries || null,
      notes: state.notes || null,
      fixedActivities: state.fixedActivities,
    };

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (res.ok) {
      router.push("/today");
      router.refresh();
    } else {
      alert("Something went wrong saving your profile.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">About you</h2>
        <p className="mt-1 text-sm text-slate-600">
          Used to scale exercise difficulty and estimate intensity. All fields are optional.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Name (optional)">
            <input value={state.displayName} onChange={(e) => set("displayName", e.target.value)} />
          </Field>
          <Field label="Age">
            <input
              type="number"
              min={10}
              max={100}
              value={state.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>
          <Field label="Sex">
            <select value={state.sex} onChange={(e) => set("sex", e.target.value)}>
              <option value="">—</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Weight (lbs)">
            <input
              type="number"
              min={60}
              max={500}
              step="0.1"
              value={state.weightLbs}
              onChange={(e) => set("weightLbs", e.target.value)}
            />
          </Field>
          <Field label="Height (ft)">
            <input
              type="number"
              min={3}
              max={8}
              value={state.heightFeet}
              onChange={(e) => set("heightFeet", e.target.value)}
            />
          </Field>
          <Field label="Height (in)">
            <input
              type="number"
              min={0}
              max={11}
              step="0.1"
              value={state.heightInches}
              onChange={(e) => set("heightInches", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Goal & level</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary goal">
            <select value={state.goal} onChange={(e) => set("goal", e.target.value)}>
              <option value="general_fitness">General fitness</option>
              <option value="fat_loss">Fat loss</option>
              <option value="strength">Get stronger</option>
              <option value="mobility">Mobility & feel better</option>
            </select>
          </Field>
          <Field label="Fitness level">
            <select value={state.fitnessLevel} onChange={(e) => set("fitnessLevel", e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
          <Field label="Bodyweight session length (min)">
            <input
              type="number"
              min={10}
              max={90}
              step={5}
              value={state.minutesPerDay}
              onChange={(e) => set("minutesPerDay", e.target.value)}
            />
          </Field>
          <Field label="Equipment available">
            <select value={state.equipment} onChange={(e) => set("equipment", e.target.value)}>
              <option value="none">None (bodyweight only)</option>
              <option value="pullup_bar">Pull-up bar</option>
              <option value="resistance_bands">Resistance bands</option>
              <option value="dumbbells">Dumbbells</option>
            </select>
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Any injuries / things to avoid?">
            <input
              placeholder="e.g. left knee, lower back"
              value={state.injuries}
              onChange={(e) => set("injuries", e.target.value)}
            />
          </Field>
          <Field label="Notes (anything else)">
            <input
              placeholder="e.g. mornings only"
              value={state.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Weekly fixed activities</h2>
            <p className="mt-1 text-sm text-slate-600">
              Things you already do on specific days — soccer, league games, recurring walks, bike
              commutes. We'll fit your bodyweight work around these.
            </p>
          </div>
          <button
            type="button"
            onClick={addActivity}
            className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            + Add
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {state.fixedActivities.length === 0 && (
            <p className="text-sm text-slate-500">No fixed activities yet. That's fine.</p>
          )}
          {state.fixedActivities.map((a, i) => (
            <div
              key={i}
              className="grid grid-cols-2 items-end gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-5"
            >
              <Field label="Day">
                <select
                  value={a.dayOfWeek}
                  onChange={(e) => updateActivity(i, { dayOfWeek: parseInt(e.target.value, 10) })}
                >
                  {DAY_NAMES.map((n, idx) => (
                    <option key={idx} value={idx}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Activity">
                <select
                  value={a.activity}
                  onChange={(e) => updateActivity(i, { activity: e.target.value })}
                >
                  {ACTIVITY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Intensity">
                <select
                  value={a.intensity}
                  onChange={(e) =>
                    updateActivity(i, { intensity: e.target.value as Activity["intensity"] })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard (game day)</option>
                </select>
              </Field>
              <Field label="Minutes">
                <input
                  type="number"
                  min={10}
                  max={240}
                  step={5}
                  value={a.durationMin}
                  onChange={(e) => updateActivity(i, { durationMin: parseInt(e.target.value, 10) })}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeActivity(i)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save & see today's program"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
