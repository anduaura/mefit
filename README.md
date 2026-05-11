# mefit

Fitness catered to me — a free web app that generates a daily, personalized fitness program based on your schedule, goals, and fitness level.

## What it does

You tell mefit:

- About you (age, sex, height, weight — all optional)
- Your goal (general fitness, fat loss, strength, mobility)
- Your fitness level (beginner / intermediate / advanced)
- How long you have for bodyweight work per day
- What equipment you have (most plans assume none)
- Fixed weekly activities you already do (e.g. "soccer Tuesday & Thursday, 90 min, hard" or "walk Mon/Wed/Fri, easy, 30 min")

mefit generates:

- **Sport days** — pre-game warm-up + your match + post-match cool-down
- **Active recovery days** — your walk/bike + a short bodyweight circuit + cooldown
- **Free training days** — full warm-up + bodyweight strength session (themed: upper / lower / full / core) + optional conditioning finisher + cooldown

The plan is deterministic per (user, date), so reloading shows the same plan — but a new day rotates the theme and varies exercises.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Prisma + SQLite (anonymous user per browser, cookie-based — no signup)

## Run locally

```bash
npm install
npx prisma db push
npm run dev
```

Then open <http://localhost:3000>.

## Static version

There's also a self-contained static build under `static/` with the week
pre-baked for the original user (148 lb, 5'5", soccer Tue/Thu, walks/biking
other days). No build step, no server required:

```bash
# Either open static/index.html directly in a browser,
# or serve the folder locally:
cd static && python3 -m http.server 8000
```

It auto-highlights today, lets you tap to check off sets, and saves progress
in localStorage. Print-friendly too.

## Notes

- All exercise dosages and themes live in `src/lib/exercises.ts` and `src/lib/generator.ts`.
- Profile changes invalidate cached generated days so you always see fresh plans after editing.
- Not medical advice. If something hurts, stop and talk to a professional.
