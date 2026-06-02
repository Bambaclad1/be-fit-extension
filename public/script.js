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



// Timer logic 
const intervalSlider = document.getElementById("intervalTimer");
var countDownDate = Date.now() + (parseInt(intervalSlider.value) * 60 * 1000);
var x = setInterval(function(){
  var now = new Date().getTime();

  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML = minutes + ":" + seconds;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "fin";
  }
})

intervalSlider.addEventListener("input", () => {

    countDownDate =
        Date.now() +
        parseInt(intervalSlider.value) * 60 * 1000;

});