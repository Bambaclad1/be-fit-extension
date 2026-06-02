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

document.querySelectorAll('.setting').forEach(setting => {
    const input = setting.querySelector('input[type="range"]');
    const label = setting.querySelector('.range-value');
    const suffix = label.dataset.suffix;

    label.textContent = input.value + suffix;

    input.addEventListener('input', () => {
        label.textContent = input.value + suffix;
    });
});