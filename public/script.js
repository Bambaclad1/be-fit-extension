// Settings menu logic
const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsMenu.classList.remove("open");
  }
});

// Settings value logic
document.querySelectorAll('.setting').forEach(setting => {
  const input = setting.querySelector('input[type="range"]');
  const label = setting.querySelector('.range-value');
  const suffix = label.dataset.suffix;

  label.textContent = input.value + suffix;

  input.addEventListener('input', () => {
    label.textContent = input.value + suffix;
  });
});

// timer display working with local storage
const intervalSlider = document.getElementById("intervalTimer");

function updateDisplay() {
  chrome.storage.local.get('alarmEnd', ({ alarmEnd }) => {
    if (!alarmEnd) return;

    const distance = alarmEnd - Date.now();

    if (distance <= 0) {
      document.getElementById("timer").innerHTML = "fin";
      return;
    }

    const minutes = Math.floor(distance / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("timer").innerHTML = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
}

// tick display every second
setInterval(updateDisplay, 1000);
updateDisplay(); // run immediately on popup open

// when slider changes, restart the alarm with new value
intervalSlider.addEventListener("input", () => {
  const minutes = parseInt(intervalSlider.value);

  chrome.alarms.clear('myTimer', () => {
    chrome.runtime.sendMessage({ action: 'startAlarm', minutes });
  });
});