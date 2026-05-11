/* Maps an exercise name to a "how to do it" visual demo.
 *
 *   id  -> a folder id in yuhonas/free-exercise-db (public domain). Two JPGs
 *          per exercise live at /exercises/<id>/0.jpg and /1.jpg.
 *   yt  -> a YouTube search query used as a fallback "Watch demo" link,
 *          always present for every exercise.
 *
 * For exercises that have no good free-exercise-db match (rare mobility /
 * warm-up moves, doorway-row at home, etc.), we leave `id` null and rely on
 * the YouTube fallback only.
 */
const DEMO_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

const DEMOS = {
  // Mobility / warm-up
  "cat-cow":                          { id: "Cat_Stretch",                       yt: "cat cow stretch how to" },
  "bird dog":                         { id: null,                                yt: "bird dog exercise proper form" },
  "world's greatest stretch":         { id: "Worlds_Greatest_Stretch",           yt: "world's greatest stretch how to" },
  "thoracic rotation (open book)":    { id: null,                                yt: "open book thoracic rotation stretch" },
  "half-kneeling hip flexor stretch": { id: "Kneeling_Hip_Flexor",               yt: "half kneeling hip flexor stretch" },
  "standing hamstring stretch":       { id: "Hamstring_Stretch",                 yt: "standing hamstring stretch" },
  "pigeon stretch":                   { id: null,                                yt: "pigeon stretch how to" },
  "child's pose":                     { id: "Childs_Pose",                       yt: "child's pose stretch" },
  "standing quad stretch":            { id: null,                                yt: "standing quad stretch how to" },
  "calf stretch (against wall)":      { id: "Calf_Stretch_Hands_Against_Wall",   yt: "calf stretch against wall" },
  "ankle rocks":                      { id: "Ankle_Circles",                     yt: "ankle rocks half kneeling mobility" },

  // Dynamic warm-up
  "arm circles":                      { id: "Arm_Circles",                       yt: "arm circles warm up" },
  "scapular push-up":                 { id: null,                                yt: "scapular push up how to" },
  "easy jog in place / on the field": { id: null,                                yt: "jog in place warm up" },
  "leg swings (front-back)":          { id: null,                                yt: "leg swings forward backward warm up" },
  "leg swings (side-side)":           { id: null,                                yt: "leg swings side to side warm up" },
  "hip circles":                      { id: null,                                yt: "hip circles warm up" },
  "walking lunge":                    { id: "Bodyweight_Walking_Lunge",          yt: "walking lunge how to" },
  "high knees":                       { id: null,                                yt: "high knees exercise proper form" },
  "skater hops":                      { id: null,                                yt: "skater hops lateral bounds" },
  "build-up runs":                    { id: null,                                yt: "build up sprints warm up" },

  // Strength
  "push-up":                          { id: "Pushups",                           yt: "push up proper form" },
  "doorway row":                      { id: "Inverted_Row",                      yt: "doorway row at home no equipment" },
  "forearm plank":                    { id: "Plank",                             yt: "forearm plank proper form" },
  "side plank":                       { id: null,                                yt: "side plank proper form" },
  "plank shoulder taps":              { id: null,                                yt: "plank shoulder taps how to" },
  "dead bug":                         { id: "Dead_Bug",                          yt: "dead bug exercise how to" },
  "bicycle crunch":                   { id: null,                                yt: "bicycle crunch proper form" },
  "glute bridge":                     { id: "Butt_Lift_Bridge",                  yt: "glute bridge how to" },
  "single-leg glute bridge":          { id: "Single_Leg_Glute_Bridge",           yt: "single leg glute bridge how to" },
  "bodyweight squat":                 { id: "Bodyweight_Squat",                  yt: "bodyweight squat proper form" },
  "reverse lunge":                    { id: "Crossover_Reverse_Lunge",           yt: "reverse lunge bodyweight form" },
  "wall sit":                         { id: null,                                yt: "wall sit proper form" },
  "jump squat":                       { id: "Freehand_Jump_Squat",               yt: "jump squat form" },

  // Conditioning
  "mountain climbers":                { id: "Mountain_Climbers",                 yt: "mountain climbers proper form" },
  "jumping jacks":                    { id: null,                                yt: "jumping jacks exercise" },
};

/** Normalize a display name to the key shape used in DEMOS. */
function demoKey(name) {
  return String(name)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-")
    .trim();
}

function lookupDemo(name) {
  const k = demoKey(name);
  if (DEMOS[k]) return DEMOS[k];
  // Strip a trailing parenthetical descriptor and try again.
  // e.g. "Push-Up (easy pace)" -> "push-up"
  const stripped = k.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (stripped !== k && DEMOS[stripped]) return DEMOS[stripped];
  return null;
}
