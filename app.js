const enterBtn = document.getElementById("enterBtn");
const muteBtn = document.getElementById("muteBtn");
const playBtn = document.getElementById("playBtn");
const content = document.getElementById("content");
const audio = document.getElementById("audio");
const playerState = document.getElementById("playerState");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

// Basic reveal observer
const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("revealed");
  }
}, { threshold: 0.12 });

document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));

let isMuted = true;
let entered = false;

function setMuted(nextMuted){
  isMuted = nextMuted;
  muteBtn.setAttribute("aria-pressed", String(isMuted));
  muteBtn.textContent = isMuted ? "ТИШИНА" : "ГОЛОС";
  if (isMuted) {
    audio.pause();
    playerState.textContent = "без звука";
  }
}

setMuted(true);

enterBtn.addEventListener("click", () => {
  if (entered) return;
  entered = true;

  // “Ритуал входа”: показываем содержимое
  content.hidden = false;

  // Лёгкий скролл вниз (как “провалиться”)
  setTimeout(() => {
    document.getElementById("manifest").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 250);

  // Разрешаем звук после входа (браузеры любят user gesture)
  // Но оставляем в тишине, пока пользователь не включит.
});

muteBtn.addEventListener("click", () => {
  setMuted(!isMuted);
});

playBtn.addEventListener("click", async () => {
  // Если звук выключен — включаем
  if (isMuted) setMuted(false);

  try {
    await audio.play();
    playerState.textContent = "играет";
  } catch (err) {
    // если файла нет или браузер блокирует
    playerState.textContent = "нет трека / блокировка";
  }
});

// Если трек закончился
audio.addEventListener("ended", () => {
  playerState.textContent = "тишина";
});
