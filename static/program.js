/* mefit — personalized static program
 *
 * Tailored to: 148 lb, 5'5", intermediate, fat-loss bias.
 * Weekly anchors: soccer Tue/Thu (hard, ~90 min). Walks/biking other weekdays.
 * Bodyweight at home every day.
 */

const DAYS = [
  { key: "sun", name: "Sunday",    short: "Sun" },
  { key: "mon", name: "Monday",    short: "Mon" },
  { key: "tue", name: "Tuesday",   short: "Tue" },
  { key: "wed", name: "Wednesday", short: "Wed" },
  { key: "thu", name: "Thursday",  short: "Thu" },
  { key: "fri", name: "Friday",    short: "Fri" },
  { key: "sat", name: "Saturday",  short: "Sat" },
];

// kind: warmup | main | conditioning | cooldown | sport | cardio
// item.prescription is the per-set prescription string (e.g. "12 reps", "30 sec").
// item.sets is number of working sets (omit for single-set items like a walk).
// item.freeform overrides the per-set display.

const PROGRAM = {
  sun: {
    title: "Mobility & Active Recovery",
    eyebrow: "Sunday · light",
    duration: "20 min + optional walk",
    summary:
      "Easy day. Move joints through full range, breathe slow, let the legs reset before Monday.",
    blocks: [
      {
        title: "Flow",
        kind: "main",
        note: "Move slowly. 2 rounds — second round goes a little deeper than the first.",
        items: [
          { name: "Cat-Cow",                   sets: 2, prescription: "10 reps",       desc: "On hands and knees, alternate rounding and arching the spine." },
          { name: "Bird Dog",                  sets: 2, prescription: "8 reps/side",   desc: "Extend opposite arm and leg, pause, return.", cue: "Keep hips level — no tilting." },
          { name: "World's Greatest Stretch",  sets: 2, prescription: "5 reps/side",   desc: "Lunge, drop hand inside front foot, rotate top arm to the ceiling." },
          { name: "Thoracic Rotation (Open Book)", sets: 2, prescription: "8 reps/side", desc: "Side-lying, knees stacked, rotate top arm and shoulder open to the floor behind you." },
          { name: "Half-Kneeling Hip Flexor Stretch", sets: 2, prescription: "45 sec/side", desc: "Squeeze the glute of the back leg, gentle forward shift." },
          { name: "Seated Hamstring Stretch", sets: 2, prescription: "30 sec/side",  desc: "Sit on the floor, one leg straight out, fold forward over the leg keeping a flat back. Reach for the foot — don't force it." },
          { name: "Pigeon Stretch",            sets: 2, prescription: "60 sec/side",   desc: "Front shin angled, hips square, fold forward as it loosens." },
          { name: "Child's Pose",              sets: 1, prescription: "90 sec",        desc: "Hips back to heels, arms long, breathe through the nose." },
        ],
      },
      {
        title: "Optional easy walk",
        kind: "cardio",
        note: "If the weather's nice. Pure recovery pace — flat ground, breathe through your nose if you can.",
        items: [{ name: "Walk", freeform: "20–30 min · easy pace" }],
      },
    ],
  },

  mon: {
    title: "Upper Body Push & Pull",
    eyebrow: "Monday · strength (gym)",
    duration: "~35 min + 30 min walk",
    summary:
      "Bench, pulldown, brace. Press, pull, core — balanced upper-body day at the gym. Add a 30-min easy walk later.",
    blocks: [
      {
        title: "Warm-Up",
        kind: "warmup",
        note: "About 5 minutes. Add 1–2 light warm-up sets with lighter dumbbells before working weight.",
        items: [
          { name: "Cat-Cow",            sets: 1, prescription: "10 reps" },
          { name: "Arm Circles",        sets: 1, prescription: "10 each direction" },
          { name: "Thoracic Rotation (Open Book)", sets: 1, prescription: "6 reps/side" },
          { name: "Scapular Push-Up",   sets: 1, prescription: "10 reps", desc: "In a plank, protract and retract the shoulder blades. No elbow bend." },
        ],
      },
      {
        title: "Main Lifts",
        kind: "main",
        note: "Rest 90 sec between sets. Pick a weight that leaves 1–2 reps in the tank on the last set.",
        items: [
          {
            name: "Dumbbell Bench Press",
            sets: 4,
            prescription: "8–10 reps",
            desc: "Lie on the bench, dumbbell in each hand at chest level, palms facing forward, press up until arms are straight.",
            cue: "Don't lock the elbows hard at the top. Control the lower — 2 seconds down.",
            alt: { name: "Push-Up", sets: 3, prescription: "10 reps" },
          },
          {
            name: "Wide-Grip Lat Pulldown",
            sets: 4,
            prescription: "8–10 reps",
            desc: "Slightly wider than shoulders, pull the bar to your upper chest, control the way up.",
            cue: "Drive elbows down and back. Avoid leaning excessively backward.",
            alt: { name: "Doorway Row", sets: 3, prescription: "12 reps" },
          },
          {
            name: "Forearm Plank",
            sets: 3,
            prescription: "30 sec",
            desc: "Forearms on the floor, body straight. Tuck the pelvis, squeeze the glutes.",
          },
          {
            name: "Dead Bug",
            sets: 3,
            prescription: "8 reps/side",
            desc: "On back, lower opposite arm and leg slowly, return, switch.",
            cue: "Keep low back pressed into the floor.",
          },
        ],
      },
      {
        title: "Conditioning Finisher",
        kind: "conditioning",
        note: "5 minutes total. 30 sec work / 30 sec rest × 5.",
        items: [
          { name: "Mountain Climbers", sets: 5, prescription: "30 sec on / 30 sec off", desc: "Plank position, drive knees alternately toward chest.", cue: "Hips stay low — no piking up." },
        ],
      },
      {
        title: "Cool-Down + Walk",
        kind: "cooldown",
        items: [
          { name: "Child's Pose",            sets: 1, prescription: "45 sec" },
          { name: "Seated Hamstring Stretch", sets: 1, prescription: "30 sec/side" },
          { name: "Easy walk",               freeform: "30 min · conversational pace" },
        ],
      },
    ],
  },

  tue: {
    title: "Soccer (Match Day)",
    eyebrow: "Tuesday · sport",
    duration: "~110 min total",
    summary:
      "Soccer is the workout. Warm up properly and bring the engine down with a real cool-down so Wednesday feels good.",
    blocks: [
      {
        title: "Pre-Match Warm-Up",
        kind: "warmup",
        note: "Do this in the 10 minutes before kickoff. Build heart rate up gradually.",
        items: [
          { name: "Easy jog in place / on the field", sets: 1, prescription: "2 min" },
          { name: "Leg Swings (front-back)",  sets: 1, prescription: "10/side" },
          { name: "Leg Swings (side-side)",   sets: 1, prescription: "10/side" },
          { name: "Hip Circles",              sets: 1, prescription: "10/side" },
          { name: "Walking Lunge",            sets: 1, prescription: "10 reps", desc: "Step forward into a lunge, push off, step forward again." },
          { name: "World's Greatest Stretch", sets: 1, prescription: "4/side" },
          { name: "High Knees",               sets: 1, prescription: "30 sec" },
          { name: "Skater Hops",              sets: 1, prescription: "30 sec" },
          { name: "Build-up runs",            sets: 3, prescription: "30 m · 50% → 70% → 90%", desc: "Three runs, each progressively faster. Last one near top speed but not all-out." },
        ],
      },
      {
        title: "Match",
        kind: "sport",
        note: "Hydrate at every break. Eat ~30–45 min before kickoff if you can.",
        items: [{ name: "Soccer", freeform: "~90 min · match pace" }],
      },
      {
        title: "Post-Match Cool-Down",
        kind: "cooldown",
        note: "10 minutes. Don't skip this — it's the fastest way to feel good on Wednesday.",
        items: [
          { name: "Easy walk",                sets: 1, prescription: "3 min" },
          { name: "Standing Quad Stretch",    sets: 1, prescription: "30 sec/side" },
          { name: "Seated Hamstring Stretch", sets: 1, prescription: "30 sec/side" },
          { name: "Half-Kneeling Hip Flexor Stretch", sets: 1, prescription: "45 sec/side" },
          { name: "Calf Stretch (against wall)", sets: 1, prescription: "30 sec/side" },
          { name: "Child's Pose",             sets: 1, prescription: "60 sec" },
        ],
      },
    ],
  },

  wed: {
    title: "Lower Body Strength",
    eyebrow: "Wednesday · strength (gym)",
    duration: "~40 min + 30 min bike",
    summary:
      "Legs feel tired from Tuesday — that's normal. Heavy is fine but not max. Drop a set if anything feels off.",
    blocks: [
      {
        title: "Warm-Up",
        kind: "warmup",
        note: "Wake the hips up after soccer. Then add 1–2 light warm-up sets with lighter dumbbells before working weight.",
        items: [
          { name: "Glute Bridge",      sets: 1, prescription: "15 reps", desc: "Lie on back, knees bent, drive hips up by squeezing glutes." },
          { name: "Cat-Cow",           sets: 1, prescription: "10 reps" },
          { name: "Ankle Rocks",       sets: 1, prescription: "10/side", desc: "Half-kneel, drive front knee forward over toes without lifting heel." },
          { name: "Bodyweight Squat",  sets: 1, prescription: "10 reps · slow" },
        ],
      },
      {
        title: "Main Lifts",
        kind: "main",
        note: "Rest 2 min between squat sets, 90 sec between the other lifts. If legs feel cooked, drop one set of squats.",
        items: [
          {
            name: "Dumbbell Goblet Squat",
            sets: 4,
            prescription: "8–10 reps",
            desc: "Hold one heavy dumbbell vertically against your chest with both hands cupping the top bell. Squat between the heels — elbows brush the inside of your knees at the bottom.",
            cue: "Chest tall. Depth: hip crease at or just below knee. If you don't have one heavy enough, hold a DB in each hand at your sides.",
            alt: { name: "Bodyweight Squat", sets: 3, prescription: "15 reps" },
          },
          {
            name: "Dumbbell Romanian Deadlift",
            sets: 3,
            prescription: "10 reps",
            desc: "Dumbbell in each hand in front of the thighs. Soft knees, hinge back at the hips, dumbbells travel along the legs. Feel the hamstring stretch, then drive hips forward to stand.",
            cue: "Flat back. Dumbbells stay close to the legs the whole time.",
            alt: { name: "Single-Leg Glute Bridge", sets: 3, prescription: "10 reps/side" },
          },
          {
            name: "Dumbbell Step-Ups",
            sets: 3,
            prescription: "8 reps/side",
            desc: "Dumbbell in each hand at your sides. Step full-foot onto the bench, drive through the heel to stand all the way up, control the descent.",
            cue: "Don't bounce off the back leg — make the working leg do the work.",
            alt: { name: "Reverse Lunge", sets: 3, prescription: "10 reps/side" },
          },
          {
            name: "Wall Sit",
            sets: 3,
            prescription: "30 sec",
            desc: "Back flat on a wall, thighs parallel to the floor, hold.",
          },
        ],
      },
      {
        title: "Cool-Down + Bike",
        kind: "cooldown",
        items: [
          { name: "Pigeon Stretch",          sets: 1, prescription: "45 sec/side" },
          { name: "Standing Quad Stretch",   sets: 1, prescription: "30 sec/side" },
          { name: "Easy bike",               freeform: "30 min · conversational pace, flat route" },
        ],
      },
    ],
  },

  thu: {
    title: "Soccer (Match Day)",
    eyebrow: "Thursday · sport",
    duration: "~110 min total",
    summary:
      "Same playbook as Tuesday. Eat well during the day, hydrate, get to the field 15 min early.",
    blocks: [
      {
        title: "Pre-Match Warm-Up",
        kind: "warmup",
        note: "10 minutes before kickoff.",
        items: [
          { name: "Easy jog in place / on the field", sets: 1, prescription: "2 min" },
          { name: "Leg Swings (front-back)",  sets: 1, prescription: "10/side" },
          { name: "Leg Swings (side-side)",   sets: 1, prescription: "10/side" },
          { name: "Hip Circles",              sets: 1, prescription: "10/side" },
          { name: "Walking Lunge",            sets: 1, prescription: "10 reps" },
          { name: "World's Greatest Stretch", sets: 1, prescription: "4/side" },
          { name: "High Knees",               sets: 1, prescription: "30 sec" },
          { name: "Skater Hops",              sets: 1, prescription: "30 sec" },
          { name: "Build-up runs",            sets: 3, prescription: "30 m · 50% → 70% → 90%" },
        ],
      },
      {
        title: "Match",
        kind: "sport",
        items: [{ name: "Soccer", freeform: "~90 min · match pace" }],
      },
      {
        title: "Post-Match Cool-Down",
        kind: "cooldown",
        note: "10 minutes — your future self thanks you.",
        items: [
          { name: "Easy walk",                sets: 1, prescription: "3 min" },
          { name: "Standing Quad Stretch",    sets: 1, prescription: "30 sec/side" },
          { name: "Seated Hamstring Stretch", sets: 1, prescription: "30 sec/side" },
          { name: "Half-Kneeling Hip Flexor Stretch", sets: 1, prescription: "45 sec/side" },
          { name: "Calf Stretch (against wall)", sets: 1, prescription: "30 sec/side" },
          { name: "Child's Pose",             sets: 1, prescription: "60 sec" },
        ],
      },
    ],
  },

  fri: {
    title: "Full Body",
    eyebrow: "Friday · strength + conditioning (gym)",
    duration: "~40 min + 30 min walk",
    summary:
      "Cap the week with a balanced full-body session. Keep loads moderate — you're 48 hours out from Tuesday and 24 hours past Thursday.",
    blocks: [
      {
        title: "Warm-Up",
        kind: "warmup",
        items: [
          { name: "Cat-Cow",                   sets: 1, prescription: "10 reps" },
          { name: "World's Greatest Stretch",  sets: 1, prescription: "4/side" },
          { name: "Bodyweight Squat",          sets: 1, prescription: "10 reps" },
          { name: "Push-Up (easy pace)",       sets: 1, prescription: "5 reps" },
        ],
      },
      {
        title: "Main Lifts",
        kind: "main",
        note: "Rest 60–90 sec between sets. Loads should feel ~70–75% effort — this is volume, not testing.",
        items: [
          {
            name: "Dumbbell Bench Press",
            sets: 3,
            prescription: "10 reps",
            desc: "Lighter than Monday. Dumbbell in each hand at chest, press up to straight arms, control the way down.",
            cue: "Keep elbows about 45° from the torso, not flared out wide.",
            alt: { name: "Push-Up", sets: 3, prescription: "12 reps" },
          },
          {
            name: "Dumbbell Goblet Squat",
            sets: 3,
            prescription: "10 reps",
            desc: "Same form as Wednesday, lighter weight. Focus on smooth depth and control.",
            alt: { name: "Bodyweight Squat", sets: 3, prescription: "15 reps" },
          },
          {
            name: "Seated Cable Rows",
            sets: 3,
            prescription: "10 reps",
            desc: "Chest tall, pull the handle to your sternum, control the way out.",
            cue: "Squeeze the shoulder blades together at the end of each rep.",
            alt: { name: "Doorway Row", sets: 3, prescription: "12 reps" },
          },
          {
            name: "Dumbbell Lunges",
            sets: 3,
            prescription: "8 reps/side",
            desc: "Dumbbell in each hand at your sides. Step forward (or back) into a lunge, drop the back knee just above the floor, drive through the front heel.",
            alt: { name: "Reverse Lunge", sets: 3, prescription: "10 reps/side" },
          },
          {
            name: "Bicycle Crunch",
            sets: 3,
            prescription: "20 reps total",
            desc: "Slow and controlled — feel obliques work, don't yank the neck.",
          },
        ],
      },
      {
        title: "Conditioning Finisher",
        kind: "conditioning",
        note: "6 minutes. 30 sec work / 30 sec easy. Pick whichever feels good today.",
        items: [
          { name: "Jumping Jacks", sets: 6, prescription: "30 sec on / 30 sec off" },
        ],
      },
      {
        title: "Cool-Down + Walk",
        kind: "cooldown",
        items: [
          { name: "Cat-Cow",                 sets: 1, prescription: "10 reps" },
          { name: "Child's Pose",            sets: 1, prescription: "60 sec" },
          { name: "Easy walk",               freeform: "30 min · conversational pace" },
        ],
      },
    ],
  },

  sat: {
    title: "Conditioning + Core",
    eyebrow: "Saturday · conditioning",
    duration: "~25 min",
    summary:
      "The fat-loss day. Heart rate up, abs lit, in and out in 25 minutes. Save your legs for Sunday recovery.",
    blocks: [
      {
        title: "Warm-Up",
        kind: "warmup",
        items: [
          { name: "Jumping Jacks",             sets: 1, prescription: "60 sec" },
          { name: "World's Greatest Stretch",  sets: 1, prescription: "4/side" },
          { name: "Scapular Push-Up",          sets: 1, prescription: "10 reps" },
        ],
      },
      {
        title: "Conditioning Circuit",
        kind: "conditioning",
        note: "4 rounds. 30 sec work / 15 sec rest between moves, 60 sec between rounds.",
        items: [
          { name: "High Knees",            sets: 4, prescription: "30 sec",  desc: "Run in place driving knees up to hip height." },
          { name: "Mountain Climbers",     sets: 4, prescription: "30 sec",  cue: "Hips low, fast feet." },
          { name: "Skater Hops",           sets: 4, prescription: "30 sec",  desc: "Bound side to side, land softly on one leg." },
          { name: "Jump Squat",            sets: 4, prescription: "30 sec",  desc: "Squat then explode up. Land soft into the next rep.", cue: "If knees complain, sub bodyweight squats." },
          { name: "Plank Shoulder Taps",   sets: 4, prescription: "30 sec",  desc: "In a high plank, tap opposite hand to opposite shoulder. Don't let the hips rock." },
        ],
      },
      {
        title: "Core Block",
        kind: "main",
        note: "One pass through. Move steady.",
        items: [
          { name: "Forearm Plank",     sets: 1, prescription: "45 sec" },
          { name: "Side Plank",        sets: 1, prescription: "30 sec/side" },
          { name: "Dead Bug",          sets: 1, prescription: "10 reps/side" },
          { name: "Bicycle Crunch",    sets: 1, prescription: "20 reps total" },
        ],
      },
      {
        title: "Cool-Down",
        kind: "cooldown",
        items: [
          { name: "Seated Hamstring Stretch",         sets: 1, prescription: "30 sec/side" },
          { name: "Half-Kneeling Hip Flexor Stretch", sets: 1, prescription: "45 sec/side" },
          { name: "Cat-Cow",                          sets: 1, prescription: "10 reps" },
        ],
      },
    ],
  },
};

// -------- render --------

const $ = (sel) => document.querySelector(sel);

function todayKey() {
  const dow = new Date().getDay();
  return DAYS[dow].key;
}

const STORAGE_KEY = "mefit-static-checks-v1";
let checks = loadChecks();

function loadChecks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveChecks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  } catch {}
}
function checkKey(dayKey, blockIdx, itemIdx, setIdx) {
  return `${dayKey}/${blockIdx}/${itemIdx}/${setIdx}`;
}

function renderDayTabs(activeKey) {
  const tabs = $("#day-tabs");
  const today = todayKey();
  tabs.innerHTML = DAYS.map((d) => {
    const isToday = d.key === today;
    const isActive = d.key === activeKey;
    const kind = PROGRAM[d.key].eyebrow.split("·")[1]?.trim() ?? "";
    return `
      <button class="day-tab ${isActive ? "active" : ""} ${isToday ? "today" : ""}" data-day="${d.key}" aria-label="${d.name}">
        <span class="dt-name">${d.short}</span>
        <span class="dt-kind">${kind}</span>
      </button>
    `;
  }).join("");

  tabs.querySelectorAll(".day-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDay(btn.dataset.day);
    });
  });
}

function renderDay(dayKey) {
  const day = PROGRAM[dayKey];
  const meta = DAYS.find((d) => d.key === dayKey);
  const isToday = dayKey === todayKey();
  $("#today-heading").textContent = isToday ? "Today" : meta.name;
  $("#today-sub").textContent = isToday
    ? `${meta.name} · ${day.title}`
    : "Peeking ahead — tap the dot to jump back to today";

  renderDayTabs(dayKey);

  const view = $("#day-view");
  view.innerHTML = `
    <header class="day-header">
      <div class="row">
        <div>
          <p class="eyebrow">${day.eyebrow}</p>
          <h2>${day.title}</h2>
        </div>
        <p class="duration">${day.duration}</p>
      </div>
      <p class="summary">${day.summary}</p>
    </header>
    ${day.blocks.map((b, i) => renderBlock(dayKey, b, i)).join("")}
  `;

  // wire set buttons
  view.querySelectorAll(".set-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      checks[k] = !checks[k];
      btn.classList.toggle("done", checks[k]);
      saveChecks();
    });
  });
}

function renderBlock(dayKey, b, blockIdx) {
  return `
    <section class="block">
      <div class="block-head">
        <h3>${b.title}</h3>
        <span class="block-kind" data-kind="${b.kind}">${b.kind}</span>
      </div>
      ${b.note ? `<p class="block-note">${b.note}</p>` : ""}
      <ul class="items">
        ${b.items.map((it, i) => renderItem(dayKey, blockIdx, i, it)).join("")}
      </ul>
    </section>
  `;
}

function renderItem(dayKey, blockIdx, itemIdx, item) {
  const sets = item.sets ?? 1;
  const showSets = !item.freeform;
  const setButtons = showSets
    ? `<div class="sets" role="group" aria-label="${item.name} sets">${
        Array.from({ length: sets }, (_, s) => {
          const k = checkKey(dayKey, blockIdx, itemIdx, s);
          const done = !!checks[k];
          return `<button type="button" class="set-btn ${done ? "done" : ""}" data-key="${k}" aria-label="Set ${s + 1}">${s + 1}</button>`;
        }).join("")
      }</div>`
    : "";

  const presc = item.freeform
    ? `<p class="freeform">${item.freeform}</p>`
    : `<span class="prescription">${item.sets ? `${item.sets} × ` : ""}${item.prescription ?? ""}</span>`;

  return `
    <li class="item">
      <div class="body">
        <div class="title-row">
          <span class="name">${item.name}</span>
          ${item.freeform ? "" : presc}
        </div>
        ${item.freeform ? presc : ""}
        ${item.desc ? `<p class="desc">${item.desc}</p>` : ""}
        ${item.cue ? `<p class="cue">↪ ${item.cue}</p>` : ""}
        ${renderAlt(item)}
        ${renderDemo(item)}
        ${setButtons}
      </div>
    </li>
  `;
}

function renderAlt(item) {
  if (!item.alt) return "";
  const a = item.alt;
  const dose = a.sets ? `${a.sets} × ${a.prescription ?? ""}` : a.prescription ?? "";
  return `
    <p class="alt">
      <span class="alt-label">No gym today?</span>
      <span class="alt-name">${a.name}</span>
      <span class="alt-presc">${dose}</span>
    </p>
  `;
}

function renderDemo(item) {
  if (item.freeform) return "";
  const demo = typeof lookupDemo === "function" ? lookupDemo(item.name) : null;
  if (!demo) return "";

  const safeName = String(item.name).replace(/"/g, "&quot;");
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(demo.yt)}`;
  const imgs = demo.id
    ? `
      <div class="demo-imgs" aria-label="${safeName} demonstration">
        <img loading="lazy" decoding="async" alt="${safeName} — start position"
             src="${DEMO_IMAGE_BASE}/${demo.id}/0.jpg" />
        <img loading="lazy" decoding="async" alt="${safeName} — end position"
             src="${DEMO_IMAGE_BASE}/${demo.id}/1.jpg" />
      </div>`
    : "";

  return `
    <div class="demo">
      ${imgs}
      <a class="demo-link" href="${ytUrl}" target="_blank" rel="noopener noreferrer">
        Watch demo on YouTube
        <span aria-hidden>↗</span>
      </a>
    </div>
  `;
}

// -------- init --------

document.addEventListener("DOMContentLoaded", () => {
  renderDay(todayKey());

  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("Clear all checked sets across all days?")) return;
    checks = {};
    saveChecks();
    renderDay(
      document.querySelector(".day-tab.active")?.dataset.day || todayKey(),
    );
  });
});
