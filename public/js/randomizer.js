// "Randomized Reps" algorithm from the Figma onboarding flow:
//
//   minReps = max(comfortable, round(maxPushups * minPercent))
//   maxReps = round(maxPushups * maxPercent)
//   reps = floor(random() * (maxReps - minReps + 1) + minReps)
//
//   fatigueFactor = max(0.7, 1 - (setsDoneToday * 0.05))
//   adjustedReps = round(reps * fatigueFactor)
//
// minPercent/maxPercent bound the target rep count to a working range of the
// user's reported max. recoverySpeed (0 = quick, 1 = slow, from the onboarding
// slider) scales how fast that 0.05-per-set fatigue rate accumulates across a day.
const MIN_PERCENT = 0.4;
const MAX_PERCENT = 0.7;
const BASE_FATIGUE_RATE = 0.05;

export function computeFatigueFactor(setsDoneToday, recoverySpeed = 0.5) {
  const fatigueRate = BASE_FATIGUE_RATE * (0.6 + recoverySpeed);
  return Math.max(0.7, 1 - setsDoneToday * fatigueRate);
}

export function computeTargetReps({ maxPushups, comfortableReps, recoverySpeed = 0.5, setsDoneToday = 0 }) {
  const safeMax = Math.max(1, Number(maxPushups) || 1);
  const safeComfortable = Math.max(1, Number(comfortableReps) || 1);

  const minReps = Math.max(safeComfortable, Math.round(safeMax * MIN_PERCENT));
  const maxReps = Math.max(minReps, Math.round(safeMax * MAX_PERCENT));

  const reps = Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps;
  const fatigueFactor = computeFatigueFactor(setsDoneToday, recoverySpeed);

  return Math.max(1, Math.round(reps * fatigueFactor));
}
