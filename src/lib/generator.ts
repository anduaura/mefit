import { EXERCISES, Exercise, MovementPattern, byPattern, Equipment } from "./exercises";

export type ProgramBlock = {
  title: string;
  kind: "warmup" | "main" | "conditioning" | "cooldown" | "sport" | "cardio";
  notes?: string;
  items: ProgramItem[];
};

export type ProgramItem = {
  exerciseId?: string;
  name: string;
  description?: string;
  cues?: string;
  sets?: number;
  /** Per-set work. e.g. "8-10 reps" or "30 sec" */
  prescription?: string;
  /** Free-form line for non-exercise items like "Walk 30 min @ easy pace" */
  freeform?: string;
};

export type DayCategory = "rest_sport" | "active_recovery" | "free_training" | "complete_rest";

export type DayProgram = {
  date: string;
  dayOfWeek: number;
  dayName: string;
  theme: string;
  category: DayCategory;
  summary: string;
  totalMinutes: number;
  fixedActivity?: { activity: string; intensity: string; durationMin: number };
  blocks: ProgramBlock[];
};

export type ProfileInput = {
  fitnessLevel: "beginner" | "intermediate" | "advanced" | string;
  goal: "general_fitness" | "fat_loss" | "strength" | "mobility" | string;
  minutesPerDay: number;
  equipment: Equipment | string;
  injuries?: string | null;
  weightLbs?: number | null;
  heightInches?: number | null;
  age?: number | null;
};

export type FixedActivityInput = {
  dayOfWeek: number;
  activity: string;
  intensity: "easy" | "moderate" | "hard" | string;
  durationMin: number;
};

// ---------------- helpers ----------------

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(rng() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function difficultyCeiling(level: string): number {
  if (level === "advanced") return 5;
  if (level === "intermediate") return 4;
  return 3;
}

function difficultyFloor(level: string): number {
  if (level === "advanced") return 3;
  if (level === "intermediate") return 2;
  return 1;
}

function dosageFor(ex: Exercise, level: string): { sets: number; prescription: string } {
  const [lo, hi] = ex.dosage;
  let sets = 3;
  let low = lo;
  let high = hi;

  if (level === "beginner") {
    sets = 2;
    high = Math.round(lo + (hi - lo) * 0.5);
  } else if (level === "advanced") {
    sets = 4;
    low = Math.round(lo + (hi - lo) * 0.5);
  }

  const unit = ex.unit === "reps" ? "reps" : "sec";
  const prescription = low === high ? `${low} ${unit}` : `${low}–${high} ${unit}`;
  return { sets, prescription };
}

function filterByLevelAndEquipment(
  list: Exercise[],
  level: string,
  equipment: string,
  opts: { applyFloor?: boolean } = {},
): Exercise[] {
  const ceil = difficultyCeiling(level);
  const floor = opts.applyFloor === false ? 1 : difficultyFloor(level);
  const equipOk = (e: Exercise) =>
    e.equipment === "none" || e.equipment === equipment || equipment === "all";
  const filtered = list.filter((e) => e.difficulty <= ceil && e.difficulty >= floor && equipOk(e));
  if (filtered.length === 0) {
    // Fallback: drop the floor so we never end up empty.
    return list.filter((e) => e.difficulty <= ceil && equipOk(e));
  }
  return filtered;
}

function toItem(ex: Exercise, level: string): ProgramItem {
  const d = dosageFor(ex, level);
  return {
    exerciseId: ex.id,
    name: ex.name,
    description: ex.description,
    cues: ex.cues,
    sets: d.sets,
    prescription: d.prescription,
  };
}

// ---------------- main entry ----------------

export function generateWeek(
  profile: ProfileInput,
  fixed: FixedActivityInput[],
  weekStartISO: string, // ISO date, e.g. "2026-05-11"
  userId: string,
): DayProgram[] {
  const start = new Date(weekStartISO + "T00:00:00");
  const days: DayProgram[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    days.push(generateDay(profile, fixed, iso, userId));
  }
  return days;
}

export function generateDay(
  profile: ProfileInput,
  fixed: FixedActivityInput[],
  isoDate: string,
  userId: string,
): DayProgram {
  const d = new Date(isoDate + "T00:00:00");
  const dow = d.getDay();
  const seed = hashString(`${userId}:${isoDate}`);
  const rng = mulberry32(seed);

  const todays = fixed.filter((f) => f.dayOfWeek === dow);
  const heavy = todays.find((f) => f.intensity === "hard");

  if (heavy) {
    return buildSportDay(profile, heavy, isoDate, dow, rng);
  }
  if (todays.length > 0) {
    return buildActiveRecoveryDay(profile, todays, isoDate, dow, rng);
  }
  return buildFreeTrainingDay(profile, isoDate, dow, rng);
}

// ---------------- day builders ----------------

function warmupBlock(rng: () => number, profile: ProfileInput, intense = false): ProgramBlock {
  const mobility = filterByLevelAndEquipment(
    byPattern("mobility"),
    profile.fitnessLevel,
    profile.equipment,
    { applyFloor: false },
  );
  const cond = filterByLevelAndEquipment(
    byPattern("conditioning"),
    profile.fitnessLevel,
    profile.equipment,
    { applyFloor: false },
  ).filter((e) => e.difficulty <= 2);
  const items: ProgramItem[] = [];

  const picks = pickN(rng, mobility, Math.min(2, mobility.length));
  for (const p of picks) items.push({ ...toItem(p, profile.fitnessLevel), sets: 1 });

  if (cond.length && intense) {
    const c = pick(rng, cond);
    items.push({ ...toItem(c, profile.fitnessLevel), sets: 1 });
  }

  return {
    title: "Warm-Up",
    kind: "warmup",
    notes: "Move easy. Goal is to raise temperature and prep joints — not to fatigue.",
    items,
  };
}

function cooldownBlock(rng: () => number, profile: ProfileInput): ProgramBlock {
  const mobility = byPattern("mobility");
  const picks = pickN(rng, mobility, 3);
  return {
    title: "Cool-Down",
    kind: "cooldown",
    notes: "Slow nasal breathing. ~5 minutes total.",
    items: picks.map((p) => ({ ...toItem(p, profile.fitnessLevel), sets: 1 })),
  };
}

function buildSportDay(
  profile: ProfileInput,
  fixed: FixedActivityInput,
  isoDate: string,
  dow: number,
  rng: () => number,
): DayProgram {
  const warmup = warmupBlock(rng, profile, true);
  warmup.title = `Pre-${capitalize(fixed.activity)} Warm-Up`;
  warmup.notes = "Do this in the 10 minutes before your match.";

  const sport: ProgramBlock = {
    title: capitalize(fixed.activity),
    kind: "sport",
    notes: `Your main session today. Have fun and hydrate well.`,
    items: [
      {
        name: capitalize(fixed.activity),
        freeform: `${fixed.durationMin} min — match/play pace`,
      },
    ],
  };

  const cooldown = cooldownBlock(rng, profile);
  cooldown.title = "Post-Match Cool-Down";

  return {
    date: isoDate,
    dayOfWeek: dow,
    dayName: DAY_NAMES[dow],
    theme: "Sport day",
    category: "rest_sport",
    summary: `${capitalize(fixed.activity)} is the workout. Bracket it with mobility to recover faster.`,
    totalMinutes: fixed.durationMin + 15,
    fixedActivity: { activity: fixed.activity, intensity: fixed.intensity, durationMin: fixed.durationMin },
    blocks: [warmup, sport, cooldown],
  };
}

function buildActiveRecoveryDay(
  profile: ProfileInput,
  todays: FixedActivityInput[],
  isoDate: string,
  dow: number,
  rng: () => number,
): DayProgram {
  const cardio = todays[0];
  const warmup = warmupBlock(rng, profile, false);

  const cardioBlock: ProgramBlock = {
    title: capitalize(cardio.activity),
    kind: "cardio",
    notes: "Conversational pace. You should be able to talk in short sentences.",
    items: [
      {
        name: capitalize(cardio.activity),
        freeform: `${cardio.durationMin} min — ${cardio.intensity} effort`,
      },
    ],
  };

  const main = buildMainBlock(profile, isoDate, rng, "short");
  const cooldown = cooldownBlock(rng, profile);

  return {
    date: isoDate,
    dayOfWeek: dow,
    dayName: DAY_NAMES[dow],
    theme: themeName(themeOfDay(isoDate)),
    category: "active_recovery",
    summary: `Easy ${cardio.activity} plus a short bodyweight circuit.`,
    totalMinutes: cardio.durationMin + Math.min(profile.minutesPerDay, 25),
    fixedActivity: { activity: cardio.activity, intensity: cardio.intensity, durationMin: cardio.durationMin },
    blocks: [warmup, cardioBlock, main, cooldown],
  };
}

function buildFreeTrainingDay(
  profile: ProfileInput,
  isoDate: string,
  dow: number,
  rng: () => number,
): DayProgram {
  const warmup = warmupBlock(rng, profile, false);
  const main = buildMainBlock(profile, isoDate, rng, "full");
  const finisher = buildConditioningFinisher(profile, rng);
  const cooldown = cooldownBlock(rng, profile);

  const blocks: ProgramBlock[] = [warmup, main];
  if (profile.goal === "fat_loss" || profile.minutesPerDay >= 30) blocks.push(finisher);
  blocks.push(cooldown);

  return {
    date: isoDate,
    dayOfWeek: dow,
    dayName: DAY_NAMES[dow],
    theme: themeName(themeOfDay(isoDate)),
    category: "free_training",
    summary: `Full bodyweight session focused on ${themeName(themeOfDay(isoDate)).toLowerCase()}.`,
    totalMinutes: profile.minutesPerDay,
    blocks,
  };
}

// ---------------- block builders ----------------

type Theme = "upper" | "lower" | "full" | "core";

function themeOfDay(isoDate: string): Theme {
  const d = new Date(isoDate + "T00:00:00");
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const themes: Theme[] = ["upper", "lower", "full", "core"];
  return themes[dayOfYear % themes.length];
}

function themeName(t: Theme): string {
  switch (t) {
    case "upper":
      return "Upper Body";
    case "lower":
      return "Lower Body";
    case "full":
      return "Full Body";
    case "core":
      return "Core & Stability";
  }
}

function patternsForTheme(theme: Theme): MovementPattern[] {
  switch (theme) {
    case "upper":
      return ["push", "pull", "core"];
    case "lower":
      return ["squat", "hinge", "lunge"];
    case "full":
      return ["push", "squat", "pull", "lunge", "core"];
    case "core":
      return ["core", "hinge", "core"];
  }
}

function buildMainBlock(
  profile: ProfileInput,
  isoDate: string,
  rng: () => number,
  size: "short" | "full",
): ProgramBlock {
  const theme = themeOfDay(isoDate);
  const patterns = patternsForTheme(theme);
  const maxExercises = size === "short" ? Math.min(3, patterns.length) : Math.min(5, patterns.length);

  const seen = new Set<string>();
  const items: ProgramItem[] = [];
  for (const p of patterns) {
    if (items.length >= maxExercises) break;
    const pool = filterByLevelAndEquipment(byPattern(p), profile.fitnessLevel, profile.equipment).filter(
      (e) => !seen.has(e.id),
    );
    if (!pool.length) continue;
    const ex = pick(rng, pool);
    seen.add(ex.id);
    items.push(toItem(ex, profile.fitnessLevel));
  }

  return {
    title: `Main — ${themeName(theme)}`,
    kind: "main",
    notes:
      profile.goal === "strength"
        ? "Move with control. Rest 60–90 sec between sets."
        : "Move with control. Rest ~45 sec between sets, or as a circuit with 60 sec rest after a full round.",
    items,
  };
}

function buildConditioningFinisher(profile: ProfileInput, rng: () => number): ProgramBlock {
  const pool = filterByLevelAndEquipment(
    byPattern("conditioning"),
    profile.fitnessLevel,
    profile.equipment,
  );
  const picks = pickN(rng, pool, 3);
  return {
    title: "Conditioning Finisher",
    kind: "conditioning",
    notes: "3 rounds. 30 sec work, 15 sec rest. Move with intent.",
    items: picks.map((p) => {
      const item = toItem(p, profile.fitnessLevel);
      item.sets = 3;
      item.prescription = "30 sec on / 15 sec off";
      return item;
    }),
  };
}

// ---------------- utils ----------------

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function isoToday(timeZone = "UTC"): string {
  const now = new Date();
  // Use local server time; for an MVP this is fine.
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isoStartOfWeek(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  const dow = d.getDay();
  d.setDate(d.getDate() - dow); // Sunday start
  return d.toISOString().slice(0, 10);
}
