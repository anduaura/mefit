# mefit — repo notes for Claude Code

A free, personalized daily fitness program web app. Two builds live side-by-side:

1. **Full-stack MVP** (`src/`, `prisma/`) — Next.js 15 + Prisma/SQLite. Generates programs around a user's fixed weekly activities. Anonymous via an httpOnly cookie set in middleware — no signup.
2. **Personalized static site** (`static/`) — hand-tuned 7-day plan for the project owner (148 lb, 5'5", soccer Tue/Thu, walks/biking other days, bodyweight at home, fat-loss bias). Pure HTML/CSS/JS, no build step. Deployed to GitHub Pages via `.github/workflows/pages.yml`.

## Run locally

```bash
# Full-stack
npm install
npx prisma db push     # creates prisma/dev.db
npm run dev            # http://localhost:3000

# Static (any of these work)
open static/index.html
cd static && python3 -m http.server 8000
```

## Directory layout

```
src/
  middleware.ts             # sets the mefit_uid cookie (UUID) on first request
  app/
    page.tsx                # marketing / redirect to /today once profile exists
    onboarding/page.tsx     # multi-section profile form (re-used by /profile)
    today/page.tsx          # generates + caches today's program
    week/page.tsx           # 7-day view with collapsible blocks
    profile/page.tsx        # editable profile (saving regenerates plans)
    api/
      profile/route.ts      # GET/POST profile + fixed activities
      program/today/route.ts
      program/week/route.ts
  lib/
    db.ts                   # Prisma singleton (dev hot-reload safe)
    session.ts              # getOrCreateUser() — reads cookie, upserts User
    exercises.ts            # 40+ bodyweight moves, tagged pattern/difficulty/equipment/dosage
    generator.ts            # deterministic per-(user, date) program builder
  components/
    Nav.tsx
    OnboardingForm.tsx
    DayProgramView.tsx
prisma/schema.prisma         # User / Profile / FixedActivity / GeneratedDay
static/
  index.html                # personalized week, no framework
  styles.css                # mobile-first, print-friendly
  program.js                # baked-in PROGRAM data + localStorage set-checkoffs
.github/workflows/pages.yml  # deploys static/ to GitHub Pages on push to main
```

## How the generator decides each day

`src/lib/generator.ts:generateDay()` classifies a date into one of three buckets:

- `rest_sport` — fixed activity exists with intensity `"hard"`. Returns warm-up + the sport + cool-down. **No bodyweight strength on these days.**
- `active_recovery` — fixed activity exists with `easy`/`moderate` intensity (a walk, bike, etc.). Returns warm-up + the cardio + a short bodyweight circuit (themed) + cool-down.
- `free_training` — no fixed activity. Returns warm-up + themed bodyweight main + optional conditioning finisher (auto-added for `fat_loss` goal or sessions ≥ 30 min) + cool-down.

Theme rotates by `dayOfYear % 4`: Upper / Lower / Full / Core. Selection within each pattern is seeded by `hash(userId + isoDate)` so reloads are stable but new days vary.

Dosage scales with `fitnessLevel`:

| Level         | Sets | Reps used         | Difficulty floor | ceiling |
|---------------|------|-------------------|------------------|---------|
| beginner      | 2    | low end of range  | 1                | 3       |
| intermediate  | 3    | mid               | 2                | 4       |
| advanced      | 4    | high end of range | 3                | 5       |

`filterByLevelAndEquipment()` will drop the floor as a fallback if the level filter would leave the pool empty (e.g. so warm-up always has difficulty-1 mobility regardless of level).

## Caching of generated days

`prisma.GeneratedDay` stores `programJson` keyed by `(userId, date)`. Saving the profile (`POST /api/profile`) calls `prisma.generatedDay.deleteMany` for that user so the next page load regenerates with the new profile. The `/api/program/week` endpoint deliberately bypasses the cache — it always regenerates the full week from scratch.

## Session model

- `src/middleware.ts` sets `mefit_uid` (UUID v4) as an httpOnly cookie if not present.
- `src/lib/session.ts:getOrCreateUser()` reads the cookie and `prisma.user.upsert`s by id, so middleware + route handlers + server components all stay consistent.
- **Page renders cannot call `cookies().set()`** — only middleware, route handlers, or server actions can. Session writes are confined to those surfaces.

## Static site data shape

`static/program.js` defines `PROGRAM` as `{ [dayKey]: { title, eyebrow, duration, summary, blocks: [{ title, kind, note?, items: [...] }] } }`. To swap exercises, edit that object directly — no build step. Items can be:

- A normal exercise: `{ name, sets, prescription, desc?, cue? }`
- A free-form line (walk, soccer, etc.): `{ name, freeform: "30 min · easy pace" }`

Set check-offs are stored in `localStorage` under `mefit-static-checks-v1` keyed by `dayKey/blockIdx/itemIdx/setIdx`.

## Deploys

- **Static site → GitHub Pages.** `.github/workflows/pages.yml` runs on push to `main` and uses the Pages Actions flow (so `static/` can stay nested instead of moving to `/docs`). Repo **Settings → Pages → Source** must be set to **GitHub Actions** once, manually. Final URL: `https://anduaura.github.io/mefit/`.
- **Full-stack app** is not deployed yet. Picking Vercel would be the path of least resistance (Prisma + Postgres on the same dashboard), but the current SQLite setup is local-only.

## Conventions

- TypeScript everywhere in `src/`. `strict: true` in `tsconfig.json`.
- Tailwind utility classes; only one custom color palette (`brand`) defined in `tailwind.config.ts`.
- Tabs not used; 2-space indent matches the existing code.
- No emojis in source files, no unprompted README/doc files.
- Prefer editing existing files. The static site is intentionally vanilla — no React or framework. Keep it that way unless explicitly asked.

## Things to be careful about

- **Don't reintroduce `cookies().set()` in a page render** — it'll 500. The middleware handles cookie creation; server code only reads + upserts the user.
- **Empty-pool footguns in the generator.** Some patterns (e.g. `pull` with `equipment: "none"` at advanced level) can shrink to one option. The fallback in `filterByLevelAndEquipment` keeps things working but variety can suffer; if you add equipment-gated exercises, double-check the fallback still hits.
- **`POST /api/profile` invalidates cached generated days.** Don't remove that — otherwise an edited profile won't visibly change today's plan.
- **The static site is not auto-generated.** It mirrors the algorithm's output for one specific persona but is hand-tuned. Don't try to "sync" the two — they serve different audiences.

## Branch / PR state & merge policy

- Active branch for ongoing work: `claude/fitness-program-generator-cTSrW`.
- **Direct pushes to `main` are blocked** (HTTP 403, branch protection on). The user wants changes to land on `main` automatically — to honor that, follow this loop on every change without asking:
  1. Commit on the feature branch.
  2. `git push origin claude/fitness-program-generator-cTSrW` (retry with exponential backoff on network failure).
  3. Open a PR via `mcp__github__create_pull_request` (base `main`).
  4. Merge it via `mcp__github__merge_pull_request` (method `merge`).
- The Pages workflow (`.github/workflows/pages.yml`) runs on every push to `main`, so the merge step is what makes a change "go live" on `https://anduaura.github.io/mefit/`.
- Commit messages: do **not** include the `https://claude.ai/code/...` trailer (per user direction).
