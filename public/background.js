import { getSettings, getState, setState } from "./js/storage.js";
import {
  PROMPT_REASONS,
  GOGGINS_OVER_QUOTES,
  GOGGINS_RUNNING_QUOTES,
  pickRandom,
} from "./js/content.js";
import { computeTargetReps } from "./js/randomizer.js";

const ALARM_MAIN = "befitTimer";
const ALARM_FAIL_GRACE = "befitFailGrace";
const FAIL_GRACE_MINUTES = 1;

function todayKey() {
  return new Date().toDateString();
}

async function nextTarget(settings, state) {
  if (!settings.randomizer.enabled) {
    return { target: settings.pushupsAmount, setsDoneToday: state.setsDoneToday, lastResetDate: state.lastResetDate };
  }
  const today = todayKey();
  const setsDoneToday = state.lastResetDate === today ? state.setsDoneToday : 0;
  const target = computeTargetReps({ ...settings.randomizer, setsDoneToday });
  return { target, setsDoneToday, lastResetDate: today };
}

// Starts (or restarts) the interval alarm and pre-computes the target for the
// *next* prompt, so the idle screen's "Next: N Push-Ups" preview always
// matches what will actually be asked for when the alarm fires.
async function startMainAlarm(minutes) {
  const settings = await getSettings();
  const state = await getState();
  const { target, setsDoneToday, lastResetDate } = await nextTarget(settings, state);

  chrome.alarms.clear(ALARM_MAIN);
  // Sub-minute periods (e.g. the debug "5s timer" button) only fire on their
  // real schedule for unpacked/dev-mode extensions; Chrome clamps them to
  // 1 minute once the extension is packed/published.
  chrome.alarms.create(ALARM_MAIN, { periodInMinutes: minutes });

  const idleQuote = settings.gogginsMode ? pickRandom(GOGGINS_RUNNING_QUOTES) : "";

  await setState({
    screen: "idle",
    alarmEnd: Date.now() + minutes * 60 * 1000,
    alarmMinutes: minutes,
    target,
    idleQuote,
    setsDoneToday,
    lastResetDate,
    failEnd: null,
  });
}

async function triggerPrompt() {
  const settings = await getSettings();
  const state = await getState();

  const reason = settings.gogginsMode
    ? pickRandom(GOGGINS_OVER_QUOTES, state.promptReason)
    : pickRandom(PROMPT_REASONS);

  await setState({ screen: "prompt", promptReason: reason, failEnd: null });

  if (settings.notificationsEnabled) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "128x128.png",
      title: "be-fit",
      message: `${reason} Do ${state.target} push-ups.`,
    });
  }
}

async function completeSet() {
  const settings = await getSettings();
  const state = await getState();

  const streak = settings.gogginsMode ? state.streak + 1 : 0;
  const highScore = Math.max(state.highScore, streak);
  const setsDoneToday = (state.lastResetDate === todayKey() ? state.setsDoneToday : 0) + 1;

  await setState({ streak, highScore, setsDoneToday, lastResetDate: todayKey() });
  chrome.alarms.clear(ALARM_FAIL_GRACE);
  await startMainAlarm(settings.intervalMinutes);
}

async function failSet() {
  chrome.alarms.create(ALARM_FAIL_GRACE, { delayInMinutes: FAIL_GRACE_MINUTES });
  await setState({ screen: "fail", streak: 0, failEnd: Date.now() + FAIL_GRACE_MINUTES * 60 * 1000 });
}

async function endFailGrace() {
  const state = await getState();
  if (state.screen === "fail") {
    await setState({ screen: "prompt", failEnd: null });
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_MAIN) triggerPrompt();
  if (alarm.name === ALARM_FAIL_GRACE) endFailGrace();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    switch (message.action) {
      case "startAlarm":
        await startMainAlarm(message.minutes);
        break;
      case "completeSet":
        await completeSet();
        break;
      case "failSet":
        await failSet();
        break;
      default:
        break;
    }
    sendResponse({ ok: true });
  })();
  return true; // keep the message channel open for the async response
});

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  await startMainAlarm(settings.intervalMinutes);
});
