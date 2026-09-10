// Static copy pulled from the be-fit Figma file (design/be-fit-ui-design).

export const IDLE_QUOTE = {
  text: "When you think that you are done, you're only 40% in to what your body's capable of doing",
  author: "David Goggins",
};

// Reason lines shown above "Do N push-ups." on the normal prompt screen.
export const PROMPT_REASONS = [
  "Prove yourself strength.",
  "it's time to take a break.",
  "get your focus back.",
  "It's time to stop being soft. Hit the floor.",
  "Your excuses don't build muscle. Push-ups do.",
  "Level up your body.",
  "prove it.",
  "one push-up at a time.",
  "the floor's been waiting.",
  "Gravity is mocking you. prove it wrong.",
  "Those push-ups won't do themselves.",
  "show your chair who's the boss.",
];

export const GOGGINS_RUNNING_QUOTES = [
  "Tick… tick… your excuses are dying.",
  "Each second = one more rep you owe.",
  "The clock's moving. Are you?",
  "Every second you wait, you get softer.",
  "You're not tired. You're just lazy.",
  "Discipline is built here. In the silence.",
  "The old you hopes you quit.",
  "Comfort's whispering. Break its jaw.",
  "You said you wanted change. Prove it.",
  "Pain's coming. Smile at it.",
  "Every second of doubt is weakness growing.",
  "Countdown to war. Get ready.",
  "Future you is watching this timer too.",
];

export const GOGGINS_OVER_QUOTES = [
  "Stop being soft. Drop 20.",
  "Weaklings scroll. You push.",
  "Discipline > excuses. Prove it.",
  "Most people quit. Be the exception.",
  "Comfort makes cowards.",
  "No one's coming to save you. push.",
  "Earn your oxygen.",
  "Your future self is watching. Disappointed.",
  "Quit crying, start sweating.",
  "Pain is the price of progress.",
  "Excuses don't do push-ups.",
  "Lazy minds make weak bodies.",
  "The floor is waiting. Move.",
  "Be stronger than your mood.",
  "Fear the regret, not the reps.",
];

export const GOGGINS_FAIL_MESSAGE =
  "Oh you failed? Boo-fucking hoo-hoo. I will give you a minute to gather yourself and you'd damn better again.";

export function pickRandom(list, exclude) {
  const pool = exclude && list.length > 1 ? list.filter((item) => item !== exclude) : list;
  return pool[Math.floor(Math.random() * pool.length)];
}
