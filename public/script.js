import { getSettings, setSettings, getState, onChanged } from "./js/storage.js";
import { IDLE_QUOTE, GOGGINS_FAIL_MESSAGE } from "./js/content.js";

let settings = null;
let state = null;

const el = (id) => document.getElementById(id);

const dom = {
  gogginsBadge: el("gogginsBadge"),
  screens: {
    idle: el("screen-idle"),
    prompt: el("screen-prompt"),
    fail: el("screen-fail"),
  },
  timer: el("timer"),
  nextQuota: el("nextQuota"),
  idleQuoteText: el("idleQuoteText"),
  idleQuoteAuthor: el("idleQuoteAuthor"),
  promptReason: el("promptReason"),
  promptHeadline: el("promptHeadline"),
  promptQuoteText: el("promptQuoteText"),
  doneBtn: el("doneBtn"),
  failBtn: el("failBtn"),
  failMessage: el("failMessage"),
  failCountdown: el("failCountdown"),
  failTask: el("failTask"),

  settingsBtn: el("settingsBtn"),
  settingsMenu: el("settingsMenu"),
  intervalTimer: el("intervalTimer"),
  intervalValue: el("intervalValue"),
  pushupsAmount: el("pushupsAmount"),
  pushupsValue: el("pushupsValue"),
  volume: el("volume"),
  volumeValue: el("volumeValue"),
  saveBtn: el("saveBtn"),
  randomizerBtn: el("randomizerBtn"),
  randomizerDesc: el("randomizerDesc"),
  randomizerDisableBtn: el("randomizerDisableBtn"),
  gogginsToggle: el("gogginsToggle"),
  notificationsToggle: el("notificationsToggle"),
  gogginsExtras: el("gogginsExtras"),
  highScoreValue: el("highScoreValue"),

  onboarding: el("onboarding"),
  onboardingStep: el("onboardingStep"),
  onboardingBack: el("onboardingBack"),
  onboardingContinue: el("onboardingContinue"),
  maxPushupsInput: el("maxPushupsInput"),
  comfortableRepsInput: el("comfortableRepsInput"),
  recoverySpeedInput: el("recoverySpeedInput"),
  recoverySpeedLabel: el("recoverySpeedLabel"),

  debugFastTimerBtn: el("debugFastTimerBtn"),
};

function formatClock(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function pluralize(count) {
  return count === 1 ? "push-up" : "push-ups";
}

function showScreen(name) {
  for (const [key, node] of Object.entries(dom.screens)) {
    node.hidden = key !== name;
  }
}

function renderCountdown() {
  if (!state) return;
  if (state.screen === "idle" && state.alarmEnd) {
    dom.timer.textContent = formatClock(state.alarmEnd - Date.now());
  } else if (state.screen === "fail" && state.failEnd) {
    dom.failCountdown.textContent = formatClock(state.failEnd - Date.now());
  }
}

function render() {
  if (!state || !settings) return;

  dom.gogginsBadge.hidden = !settings.gogginsMode;
  dom.failBtn.hidden = !settings.gogginsMode;
  showScreen(state.screen);
  renderCountdown();

  dom.nextQuota.textContent = `Next: ${state.target} ${pluralize(state.target)}`;
  if (settings.gogginsMode && state.idleQuote) {
    dom.idleQuoteText.textContent = `“${state.idleQuote}”`;
    dom.idleQuoteAuthor.hidden = true;
  } else {
    dom.idleQuoteText.textContent = `“${IDLE_QUOTE.text}”`;
    dom.idleQuoteAuthor.hidden = false;
    dom.idleQuoteAuthor.textContent = `— ${IDLE_QUOTE.author}`;
  }

  dom.promptReason.textContent = state.promptReason;
  dom.promptHeadline.textContent = `Do ${state.target} ${pluralize(state.target)}.`;
  dom.promptQuoteText.textContent = `“${IDLE_QUOTE.text}”`;

  dom.failMessage.textContent = GOGGINS_FAIL_MESSAGE;
  dom.failTask.textContent = state.target;

  dom.gogginsExtras.hidden = !settings.gogginsMode;
  dom.highScoreValue.textContent = state.highScore;
  dom.gogginsToggle.checked = settings.gogginsMode;
  dom.notificationsToggle.checked = settings.notificationsEnabled;

  dom.randomizerDesc.textContent = settings.randomizer.enabled
    ? `On — targets ${settings.randomizer.comfortableReps}–${settings.randomizer.maxPushups} reps.`
    : "Off — uses a fixed push-up amount.";
  dom.randomizerBtn.textContent = settings.randomizer.enabled ? "Reconfigure" : "Enable";
  dom.randomizerDisableBtn.hidden = !settings.randomizer.enabled;
}

/* ---------------------------------------------------------------------- */
/* Settings panel                                                          */
/* ---------------------------------------------------------------------- */
function syncSliderLabels() {
  dom.intervalValue.textContent = `${dom.intervalTimer.value} min`;
  dom.pushupsValue.textContent = `${dom.pushupsAmount.value} push-ups`;
  dom.volumeValue.textContent = `${dom.volume.value} %`;
}

function openSettings() {
  dom.intervalTimer.value = settings.intervalMinutes;
  dom.pushupsAmount.value = settings.pushupsAmount;
  dom.volume.value = settings.volume;
  syncSliderLabels();
  dom.settingsMenu.hidden = false;
  dom.settingsBtn.setAttribute("aria-expanded", "true");
}

function closeSettings() {
  dom.settingsMenu.hidden = true;
  dom.settingsBtn.setAttribute("aria-expanded", "false");
}

dom.settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (dom.settingsMenu.hidden) openSettings();
  else closeSettings();
});

document.addEventListener("click", (e) => {
  if (
    !dom.settingsMenu.hidden &&
    !dom.settingsMenu.contains(e.target) &&
    !dom.settingsBtn.contains(e.target)
  ) {
    closeSettings();
  }
});

[dom.intervalTimer, dom.pushupsAmount, dom.volume].forEach((input) => {
  input.addEventListener("input", syncSliderLabels);
});

dom.saveBtn.addEventListener("click", async () => {
  const minutes = Number(dom.intervalTimer.value);
  settings = await setSettings({
    intervalMinutes: minutes,
    pushupsAmount: Number(dom.pushupsAmount.value),
    volume: Number(dom.volume.value),
  });
  chrome.runtime.sendMessage({ action: "startAlarm", minutes });
  closeSettings();
});

dom.gogginsToggle.addEventListener("change", async () => {
  settings = await setSettings({ gogginsMode: dom.gogginsToggle.checked });
  render();
});

dom.notificationsToggle.addEventListener("change", async () => {
  settings = await setSettings({ notificationsEnabled: dom.notificationsToggle.checked });
});

dom.doneBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "completeSet" });
});

dom.failBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "failSet" });
});

/* ---------------------------------------------------------------------- */
/* Randomizer onboarding                                                   */
/* ---------------------------------------------------------------------- */
let onboardingStep = 1;

function recoveryLabel(value) {
  if (value < 33) return "Quick";
  if (value < 66) return "Medium";
  return "Slow";
}

function showOnboardingStep(step) {
  onboardingStep = step;
  dom.onboardingStep.textContent = `${step}/3`;
  document.querySelectorAll(".onboarding-step").forEach((node) => {
    node.hidden = Number(node.dataset.step) !== step;
  });
  dom.onboardingContinue.textContent = step === 3 ? "Finish" : "Continue";
}

function openOnboarding() {
  dom.maxPushupsInput.value = settings.randomizer.maxPushups;
  dom.comfortableRepsInput.value = settings.randomizer.comfortableReps;
  dom.recoverySpeedInput.value = Math.round(settings.randomizer.recoverySpeed * 100);
  dom.recoverySpeedLabel.textContent = recoveryLabel(Number(dom.recoverySpeedInput.value));
  showOnboardingStep(1);
  closeSettings();
  dom.onboarding.hidden = false;
}

dom.randomizerBtn.addEventListener("click", openOnboarding);

dom.randomizerDisableBtn.addEventListener("click", async () => {
  settings = await setSettings({ randomizer: { enabled: false } });
  chrome.runtime.sendMessage({ action: "startAlarm", minutes: settings.intervalMinutes });
  render();
});

dom.recoverySpeedInput.addEventListener("input", () => {
  dom.recoverySpeedLabel.textContent = recoveryLabel(Number(dom.recoverySpeedInput.value));
});

dom.onboardingBack.addEventListener("click", () => {
  if (onboardingStep === 1) {
    dom.onboarding.hidden = true;
    dom.settingsMenu.hidden = false;
    return;
  }
  showOnboardingStep(onboardingStep - 1);
});

dom.onboardingContinue.addEventListener("click", async () => {
  if (onboardingStep < 3) {
    showOnboardingStep(onboardingStep + 1);
    return;
  }
  settings = await setSettings({
    randomizer: {
      enabled: true,
      maxPushups: Math.max(1, Number(dom.maxPushupsInput.value) || 1),
      comfortableReps: Math.max(1, Number(dom.comfortableRepsInput.value) || 1),
      recoverySpeed: Number(dom.recoverySpeedInput.value) / 100,
    },
  });
  chrome.runtime.sendMessage({ action: "startAlarm", minutes: settings.intervalMinutes });
  dom.onboarding.hidden = true;
  openSettings();
});

/* ---------------------------------------------------------------------- */
/* Debug                                                                   */
/* ---------------------------------------------------------------------- */
dom.debugFastTimerBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startAlarm", minutes: 5 / 60 });
  closeSettings();
});

/* ---------------------------------------------------------------------- */
/* Boot + live updates                                                     */
/* ---------------------------------------------------------------------- */
async function boot() {
  settings = await getSettings();
  state = await getState();
  render();

  onChanged((changes) => {
    if (changes.settings) settings = changes.settings.newValue ?? settings;
    if (changes.state) state = changes.state.newValue ?? state;
    render();
  });

  setInterval(renderCountdown, 250);
}

boot();
