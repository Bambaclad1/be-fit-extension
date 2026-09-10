// Thin promise wrapper around chrome.storage.local, plus the extension's
// default settings/state shape.

export const DEFAULT_SETTINGS = {
  intervalMinutes: 15,
  pushupsAmount: 10,
  volume: 25,
  gogginsMode: false,
  notificationsEnabled: true,
  randomizer: {
    enabled: false,
    maxPushups: 20,
    comfortableReps: 10,
    recoverySpeed: 0.5,
  },
};

export const DEFAULT_STATE = {
  screen: "idle", // "idle" | "prompt" | "fail"
  alarmEnd: null,
  alarmMinutes: DEFAULT_SETTINGS.intervalMinutes,
  target: DEFAULT_SETTINGS.pushupsAmount,
  promptReason: "",
  idleQuote: "",
  failEnd: null,
  streak: 0,
  highScore: 0,
  setsDoneToday: 0,
  lastResetDate: null,
};

function get(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function set(items) {
  return new Promise((resolve) => chrome.storage.local.set(items, resolve));
}

function mergeDeep(defaults, value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return value === undefined ? defaults : value;
  }
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    result[key] = mergeDeep(defaults[key], value[key]);
  }
  return result;
}

export async function getSettings() {
  const { settings } = await get("settings");
  return mergeDeep(DEFAULT_SETTINGS, settings ?? {});
}

export async function setSettings(partial) {
  const current = await getSettings();
  const next = { ...current, ...partial };
  if (partial.randomizer) {
    next.randomizer = { ...current.randomizer, ...partial.randomizer };
  }
  await set({ settings: next });
  return next;
}

export async function getState() {
  const { state } = await get("state");
  return { ...DEFAULT_STATE, ...(state ?? {}) };
}

export async function setState(partial) {
  const current = await getState();
  const next = { ...current, ...partial };
  await set({ state: next });
  return next;
}

export function onChanged(callback) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") callback(changes);
  });
}
