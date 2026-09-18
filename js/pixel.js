/* ═══════════════════════════════════════════════════════════
   ENRICO ARNAUDO — pixel art edition
   Interazioni + 13 easter egg. Buona caccia.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     AUDIO 8-BIT (WebAudio, nessun file esterno)
  ───────────────────────────────────────────── */
  let audioCtx = null;

  function ctx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function beep(freq, dur, delay, type, vol) {
    const ac = ctx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    const t = ac.currentTime + (delay || 0);
    gain.gain.setValueAtTime(vol || 0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  const sfx = {
    coin() { beep(988, 0.08); beep(1319, 0.25, 0.08); },
    achievement() { beep(523, 0.1); beep(659, 0.1, 0.1); beep(784, 0.1, 0.2); beep(1047, 0.3, 0.3); },
    hurt() { beep(220, 0.15, 0, "sawtooth"); beep(110, 0.25, 0.1, "sawtooth"); },
    gameover() { beep(392, 0.2); beep(330, 0.2, 0.2); beep(262, 0.2, 0.4); beep(196, 0.5, 0.6); },
    oneup() { beep(660, 0.1); beep(784, 0.1, 0.1); beep(1320, 0.1, 0.2); beep(1568, 0.3, 0.3); },
    eat() { beep(440, 0.06); beep(660, 0.08, 0.05); },
    crash() { beep(150, 0.3, 0, "sawtooth"); },
    powerup() { beep(392, 0.07); beep(523, 0.07, 0.07); beep(659, 0.07, 0.14); beep(784, 0.07, 0.21); beep(1047, 0.2, 0.28); },
  };

  /* ─────────────────────────────────────────────
     ACHIEVEMENT + EGG TRACKER (persistente)
  ───────────────────────────────────────────── */
  const EGGS = [
    "konami", "avatar5", "coins10", "gameover", "nerd", "coffee",
    "jedi", "snake", "snake10", "cronaca", "nightowl", "completionist", "gbmode",
    "runner", "runner500",
  ];

  function loadEggs() {
    try {
      return new Set(JSON.parse(localStorage.getItem("ea_eggs") || "[]"));
    } catch (_) {
      return new Set();
    }
  }

  const foundEggs = loadEggs();

  function saveEggs() {
    try {
      localStorage.setItem("ea_eggs", JSON.stringify([...foundEggs]));
    } catch (_) { /* modalità incognito: pazienza */ }
  }

  const eggCounter = document.getElementById("eggCounter");

  function renderEggCounter() {
    if (!eggCounter) return;
    const n = [...foundEggs].filter((e) => EGGS.includes(e)).length;
    eggCounter.textContent = "EASTER EGG TROVATI: " + n + "/" + EGGS.length;
    if (n === EGGS.length) {
      eggCounter.textContent += " — SEI UN VERO NERD 👑";
    }
  }

  const toastZone = document.getElementById("toastZone");

  // gli overlay a schermo intero spostano i toast in alto, altrimenti
  // coprirebbero i pulsanti di chiusura
  function setOverlayOpen(open) {
    document.body.classList.toggle("overlay-open", open);
  }

  function toast(icon, title, body) {
    if (!toastZone) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML =
      '<span class="toast-icon">' + icon + "</span>" +
      '<span><span class="toast-head">' + title + "</span>" +
      '<span class="toast-body">' + body + "</span></span>";
    toastZone.appendChild(el);

    // più di due in pila coprirebbero il contenuto sotto
    while (toastZone.children.length > 2) {
      toastZone.firstElementChild.remove();
    }

    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 350);
    }, 3500);
  }

  function unlock(egg, icon, body) {
    const isNew = !foundEggs.has(egg);
    if (isNew) {
      foundEggs.add(egg);
      saveEggs();
      renderEggCounter();
      sfx.achievement();
      toast(icon, "ACHIEVEMENT UNLOCKED", body);
    }
    return isNew;
  }

  renderEggCounter();

  /* ─────────────────────────────────────────────
     NAVBAR + REVEAL ON SCROLL
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealTargets = document.querySelectorAll(".pixel-card, .section-title, .section-sub");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal-hidden"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-hidden");
            entry.target.classList.add("reveal-shown");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => io.observe(el));
  }

  /* ─────────────────────────────────────────────
     BAULE DELLE PERGAMENE (certificazioni vecchie)
     Senza JS restano tutte visibili e il bottone non esiste.
  ───────────────────────────────────────────── */
  const certList = document.getElementById("certList");
  const certMore = document.getElementById("certMore");

  if (certList && certMore) {
    const extra = certList.querySelectorAll(".cert-extra").length;
    const labels = {
      closed: "APRI IL BAULE (+" + extra + ")",
      open: "CHIUDI IL BAULE",
    };

    certList.classList.add("is-collapsed");
    certMore.textContent = labels.closed;
    certMore.setAttribute("aria-expanded", "false");
    certMore.hidden = false;

    certMore.addEventListener("click", () => {
      const open = !certList.classList.toggle("is-collapsed");
      certMore.textContent = open ? labels.open : labels.closed;
      certMore.setAttribute("aria-expanded", String(open));
      if (open) sfx.coin();
    });
  }

  /* ─────────────────────────────────────────────
     TYPEWRITER
  ───────────────────────────────────────────── */
  const phrases = [
    "FULL STACK DEVELOPER",
    "UI/UX ENTHUSIAST",
    "SYSADMIN NEI RITAGLI",
    "CACCIATORE DI BUG",
    "NERD DI PROFESSIONE",
  ];
  const tw = document.getElementById("typewriter");

  if (tw) {
    let pi = 0, ci = 0, deleting = false;
    (function tick() {
      const phrase = phrases[pi];
      tw.textContent = phrase.slice(0, ci);
      let delay = deleting ? 40 : 90;
      if (!deleting && ci === phrase.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 350;
      } else {
        ci += deleting ? -1 : 1;
      }
      setTimeout(tick, delay);
    })();
  }

  /* ─────────────────────────────────────────────
     HUD: MONETE + ? BLOCK  → egg "coins10"
  ───────────────────────────────────────────── */
  let coins = 0;
  const coinCount = document.getElementById("coinCount");
  const coinIcon = document.querySelector(".coin-icon");
  const qblock = document.getElementById("qblock");

  function setCoins(n) {
    coins = n;
    if (coinCount) {
      coinCount.textContent = "×" + String(Math.min(coins, 99)).padStart(2, "0");
    }
    if (coinIcon) {
      coinIcon.classList.remove("spin");
      void coinIcon.offsetWidth;
      coinIcon.classList.add("spin");
    }
  }

  if (qblock) {
    qblock.addEventListener("click", () => {
      if (qblock.classList.contains("used")) {
        beep(110, 0.08, 0, "square", 0.04);
        return;
      }
      qblock.classList.remove("hit");
      void qblock.offsetWidth;
      qblock.classList.add("hit");
      sfx.coin();
      setCoins(coins + 1);

      const pop = document.createElement("span");
      pop.className = "coin-pop";
      pop.textContent = "+1";
      pop.style.left = "8px";
      pop.style.top = "-14px";
      qblock.parentElement.appendChild(pop);
      setTimeout(() => pop.remove(), 700);

      if (coins >= 10) {
        qblock.classList.add("used");
        qblock.textContent = "";
        unlock("coins10", "🪙", "MONETA SONANTE — hai svuotato il blocco!");
      }
    });
  }

  /* ─────────────────────────────────────────────
     HUD: CUORI → egg "gameover"
  ───────────────────────────────────────────── */
  const hearts = document.querySelectorAll("[data-heart]");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const continueBtn = document.getElementById("continueBtn");

  function heartsLeft() {
    return [...hearts].filter((h) => !h.classList.contains("lost")).length;
  }

  hearts.forEach((h) => {
    h.addEventListener("click", () => {
      if (h.classList.contains("lost")) return;
      h.classList.add("lost");
      sfx.hurt();
      if (heartsLeft() === 0) {
        sfx.gameover();
        setTimeout(() => {
          if (gameOverOverlay) gameOverOverlay.hidden = false;
          setOverlayOpen(true);
          unlock("gameover", "💀", "GAME OVER — te l'avevo detto di non cliccarli");
        }, 700);
      }
    });
  });

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      hearts.forEach((h) => h.classList.remove("lost"));
      gameOverOverlay.hidden = true;
      setOverlayOpen(false);
      sfx.oneup();
    });
  }

  /* ─────────────────────────────────────────────
     AVATAR ×5 → egg "avatar5" (occhiali da sole)
  ───────────────────────────────────────────── */
  const avatar = document.getElementById("avatar");
  let avatarClicks = 0;
  let avatarTimer = null;

  if (avatar) {
    avatar.addEventListener("click", () => {
      avatar.classList.remove("bounce");
      void avatar.offsetWidth;
      avatar.classList.add("bounce");
      beep(330 + avatarClicks * 60, 0.07);

      avatarClicks++;
      clearTimeout(avatarTimer);
      avatarTimer = setTimeout(() => { avatarClicks = 0; }, 2000);

      if (avatarClicks >= 5) {
        avatarClicks = 0;
        const sun = avatar.querySelector(".sunglasses");
        const glasses = avatar.querySelector(".glasses");
        if (sun && glasses) {
          // sono nodi SVG: la proprietà .hidden non esiste, serve l'attributo
          const wearingSun = !sun.hasAttribute("hidden");
          sun.toggleAttribute("hidden", wearingSun);
          glasses.toggleAttribute("hidden", !wearingSun);
          if (!wearingSun) {
            sfx.powerup();
            unlock("avatar5", "😎", "DEAL WITH IT — avatar troppo cool");
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────────
     KONAMI CODE → egg "konami" (GOD MODE)
     su mobile: 10 tap su "LVL 30" nell'HUD
  ───────────────────────────────────────────── */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiPos = 0;

  function godMode() {
    document.body.classList.toggle("god-mode");
    if (document.body.classList.contains("god-mode")) {
      sfx.powerup();
      hearts.forEach((h) => h.classList.remove("lost"));
      setCoins(99);
      unlock("konami", "🌈", "GOD MODE ATTIVO — 30 vite come ai vecchi tempi");
      toast("🕹", "CHEAT CODE", "Riscrivi il codice (o ritocca LVL) per disattivare");
    } else {
      beep(196, 0.2, 0, "sawtooth");
    }
  }

  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[konamiPos]) {
      konamiPos++;
      if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        godMode();
      }
    } else {
      konamiPos = key === KONAMI[0] ? 1 : 0;
    }
  });

  const hudLevel = document.getElementById("hudLevel");
  let lvlTaps = 0;
  let lvlTimer = null;

  if (hudLevel) {
    hudLevel.addEventListener("click", () => {
      lvlTaps++;
      clearTimeout(lvlTimer);
      lvlTimer = setTimeout(() => { lvlTaps = 0; }, 3000);
      if (lvlTaps >= 10) {
        lvlTaps = 0;
        godMode();
      }
    });
  }

  /* ─────────────────────────────────────────────
     PAROLE MAGICHE: nerd / coffee / jedi
  ───────────────────────────────────────────── */
  let typed = "";

  function nerdRain() {
    const emojis = ["🤓", "👾", "💾", "⌨", "🖥"];
    for (let i = 0; i < 28; i++) {
      const d = document.createElement("span");
      d.className = "nerd-drop";
      d.textContent = emojis[i % emojis.length];
      d.style.left = Math.random() * 100 + "vw";
      d.style.animationDuration = 1.5 + Math.random() * 2 + "s";
      d.style.animationDelay = Math.random() * 0.8 + "s";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 4500);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-10);

    if (typed.endsWith("nerd")) {
      typed = "";
      nerdRain();
      sfx.powerup();
      unlock("nerd", "🤓", "NERD RICONOSCIUTO — game recognizes game");
    }

    if (typed.endsWith("coffee") || typed.endsWith("caffe")) {
      typed = "";
      document.body.classList.add("caffeine");
      sfx.powerup();
      unlock("coffee", "☕", "CAFFEINA — velocità di sviluppo +200%");
      setTimeout(() => document.body.classList.remove("caffeine"), 3000);
    }

    if (typed.endsWith("jedi") || typed.endsWith("vader")) {
      typed = "";
      unlock("jedi", "⚔", "CHE LA FORZA SIA CON TE — viaggio in una galassia lontana...");
      sfx.powerup();
      setTimeout(() => { window.location.href = "cuneo-wars.html"; }, 1400);
    }
  });

  /* ─────────────────────────────────────────────
     LOGO ×3 → egg "cronaca" (pagina segreta)
  ───────────────────────────────────────────── */
  const navLogo = document.getElementById("navLogo");
  let logoClicks = 0;
  let logoTimer = null;

  if (navLogo) {
    navLogo.addEventListener("click", (e) => {
      e.preventDefault();
      logoClicks++;
      clearTimeout(logoTimer);

      if (logoClicks >= 3) {
        logoClicks = 0;
        unlock("cronaca", "📜", "LA CRONACA SEGRETA — un'antica pergamena ti attende");
        setTimeout(() => { window.location.href = "cronaca.html"; }, 900);
        return;
      }

      logoTimer = setTimeout(() => {
        logoClicks = 0;
        const home = document.getElementById("home");
        if (home) home.scrollIntoView({ behavior: "smooth" });
      }, 500);
    });
  }

  /* ─────────────────────────────────────────────
     ANNO NEL FOOTER → egg "gbmode" (palette Game Boy)
  ───────────────────────────────────────────── */
  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.addEventListener("click", () => {
      const gb = document.body.classList.toggle("gb-mode");
      footerYear.textContent = gb ? "1989" : "2026";
      if (gb) {
        sfx.oneup();
        unlock("gbmode", "🎮", "MODALITÀ GAME BOY — bentornato nel 1989");
      } else {
        beep(262, 0.1);
      }
    });
  }

  /* ─────────────────────────────────────────────
     NOTTAMBULO → egg "nightowl"
  ───────────────────────────────────────────── */
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 5) {
    setTimeout(() => {
      unlock("nightowl", "🦉", "NOTTAMBULO — anche tu programmi a quest'ora?");
    }, 4000);
  }

  /* ─────────────────────────────────────────────
     COMPLETIONIST → egg "completionist"
  ───────────────────────────────────────────── */
  let completionistDone = foundEggs.has("completionist");

  window.addEventListener("scroll", () => {
    if (completionistDone) return;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
      completionistDone = true;
      unlock("completionist", "🏁", "COMPLETIONIST — hai esplorato tutta la mappa");
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────
     SNAKE.EXE → egg "snake" + "snake10"
  ───────────────────────────────────────────── */
  const gameboyBtn = document.getElementById("gameboyBtn");
  const snakeOverlay = document.getElementById("snakeOverlay");
  const snakeClose = document.getElementById("snakeClose");
  const canvas = document.getElementById("snakeCanvas");
  const scoreEl = document.getElementById("snakeScore");
  const bestEl = document.getElementById("snakeBest");

  let snakeBest = 0;
  try { snakeBest = parseInt(localStorage.getItem("ea_snake_best") || "0", 10); } catch (_) {}
  if (bestEl) bestEl.textContent = snakeBest;

  const GRID = 15;
  const CELL = 16;
  let snake, dir, nextDir, food, score, dead, loopId;

  function snakeReset() {
    snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    dead = false;
    placeFood();
    if (scoreEl) scoreEl.textContent = "0";
  }

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
  }

  function snakeDraw() {
    const g = canvas.getContext("2d");
    g.fillStyle = "#0a0a1a";
    g.fillRect(0, 0, canvas.width, canvas.height);

    g.fillStyle = "#facc15";
    g.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    snake.forEach((s, i) => {
      g.fillStyle = i === 0 ? "#4ade80" : "#2fae5f";
      g.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });

    if (dead) {
      g.fillStyle = "rgba(6,6,18,0.75)";
      g.fillRect(0, 0, canvas.width, canvas.height);
      g.fillStyle = "#f87171";
      g.font = '16px "Press Start 2P", monospace';
      g.textAlign = "center";
      g.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
      g.fillStyle = "#e8e8f5";
      g.font = '8px "Press Start 2P", monospace';
      g.fillText("tocca / premi un tasto", canvas.width / 2, canvas.height / 2 + 16);
    }
  }

  function snakeStep() {
    if (dead) return;
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (
      head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      dead = true;
      sfx.crash();
      if (score > snakeBest) {
        snakeBest = score;
        try { localStorage.setItem("ea_snake_best", String(snakeBest)); } catch (_) {}
        if (bestEl) bestEl.textContent = snakeBest;
      }
      snakeDraw();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      if (scoreEl) scoreEl.textContent = score;
      sfx.eat();
      placeFood();
      if (score >= 10) {
        unlock("snake10", "🐍", "SERPENTE D'ORO — 10 punti a snake!");
      }
    } else {
      snake.pop();
    }

    snakeDraw();
  }

  function snakeTurn(x, y) {
    if (dead) { snakeReset(); return; }
    if (x === -dir.x && y === -dir.y) return; // niente retromarcia
    nextDir = { x, y };
  }

  function snakeKeys(e) {
    const k = e.key.toLowerCase();
    const map = {
      arrowup: [0, -1], w: [0, -1],
      arrowdown: [0, 1], s: [0, 1],
      arrowleft: [-1, 0], a: [-1, 0],
      arrowright: [1, 0], d: [1, 0],
    };
    if (map[k]) {
      e.preventDefault();
      snakeTurn(map[k][0], map[k][1]);
    } else if (dead) {
      snakeReset();
    }
  }

  let touchStart = null;

  function snakeTouchStart(e) {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function snakeTouchEnd(e) {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      if (dead) snakeReset();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) snakeTurn(Math.sign(dx), 0);
    else snakeTurn(0, Math.sign(dy));
  }

  function snakeOpen() {
    if (!snakeOverlay || !canvas) return;
    snakeOverlay.hidden = false;
    setOverlayOpen(true);
    snakeReset();
    snakeDraw();
    unlock("snake", "👾", "CONSOLE SEGRETA — SNAKE.EXE avviato");
    clearInterval(loopId);
    loopId = setInterval(snakeStep, 140);
    document.addEventListener("keydown", snakeKeys);
    canvas.addEventListener("touchstart", snakeTouchStart, { passive: true });
    canvas.addEventListener("touchend", snakeTouchEnd, { passive: true });
  }

  function snakeShutdown() {
    if (!snakeOverlay) return;
    snakeOverlay.hidden = true;
    setOverlayOpen(false);
    clearInterval(loopId);
    document.removeEventListener("keydown", snakeKeys);
    if (canvas) {
      canvas.removeEventListener("touchstart", snakeTouchStart);
      canvas.removeEventListener("touchend", snakeTouchEnd);
    }
  }

  if (gameboyBtn) gameboyBtn.addEventListener("click", snakeOpen);
  if (snakeClose) snakeClose.addEventListener("click", snakeShutdown);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      snakeShutdown();
      if (gameOverOverlay && !gameOverOverlay.hidden && heartsLeft() > 0) {
        gameOverOverlay.hidden = true;
        setOverlayOpen(false);
      }
    }
  });

  /* ─────────────────────────────────────────────
     RUNNER — il gioco nascosto nell'hero
     Si corre sul terreno dell'intestazione: tocca il
     suolo per partire e salta quello che arriva.
  ───────────────────────────────────────────── */

  // Personaggi: rettangoli su una griglia 16×16. Le gambe stanno fuori
  // dall'elenco perché le animo a parte, alternandole mentre si corre.
  const OMINI = [
    {
      id: "nerd",
      nome: "NERD",
      gambe: "#3a3a5c",
      corpo: [
        [4, 1, 8, 1, "#5b3a1e"], [3, 2, 10, 2, "#6b4423"],
        [3, 4, 2, 1, "#6b4423"], [11, 4, 2, 1, "#6b4423"],
        [4, 4, 8, 1, "#f2c49b"], [3, 5, 10, 4, "#f2c49b"], [4, 9, 8, 1, "#f2c49b"],
        [3, 5, 4, 1, "#111122"], [9, 5, 4, 1, "#111122"], [7, 5, 2, 1, "#111122"],
        [3, 6, 1, 2, "#111122"], [6, 6, 1, 2, "#111122"],
        [9, 6, 1, 2, "#111122"], [12, 6, 1, 2, "#111122"],
        [4, 6, 2, 2, "#bfe8ff"], [10, 6, 2, 2, "#bfe8ff"],
        [3, 8, 4, 1, "#111122"], [9, 8, 4, 1, "#111122"],
        [6, 9, 4, 1, "#a5654a"],
        [5, 10, 6, 1, "#1fb2a6"], [4, 11, 8, 3, "#1fb2a6"],
        [3, 12, 1, 2, "#178f86"], [12, 12, 1, 2, "#178f86"],
      ],
    },
    {
      id: "cavaliere",
      nome: "CAVALIERE",
      gambe: "#4a4a58",
      corpo: [
        [7, 0, 2, 1, "#c0564f"],
        [4, 1, 8, 2, "#9aa0ad"], [3, 3, 10, 4, "#8b919e"],
        [4, 5, 8, 1, "#1a1a22"],
        [5, 7, 6, 1, "#6e7480"],
        [4, 8, 8, 5, "#9aa0ad"],
        [3, 9, 1, 3, "#7a808c"], [12, 9, 1, 3, "#7a808c"],
        [4, 12, 8, 1, "#5a5a66"],
        [13, 4, 1, 7, "#d9dde5"], [12, 10, 3, 1, "#8b6a3a"],
      ],
    },
    {
      id: "jedi",
      nome: "JEDI",
      gambe: "#4a3520",
      corpo: [
        [4, 1, 8, 2, "#6b5334"], [3, 3, 10, 3, "#7a5f3c"],
        [5, 4, 6, 2, "#2a2118"],
        [6, 5, 1, 1, "#bfe8ff"], [9, 5, 1, 1, "#bfe8ff"],
        [4, 6, 8, 8, "#7a5f3c"],
        [3, 8, 1, 5, "#634c2f"], [12, 8, 1, 5, "#634c2f"],
        [4, 11, 8, 1, "#3e2f1c"],
        [12, 7, 2, 1, "#9aa0ad"], [14, 1, 1, 7, "#4ade80"],
      ],
    },
    {
      id: "fungo",
      nome: "FUNGO",
      gambe: "#d8c49a",
      corpo: [
        [4, 1, 8, 1, "#c0392b"], [2, 2, 12, 3, "#e04b3a"], [2, 5, 12, 2, "#c0392b"],
        [4, 2, 2, 2, "#ffffff"], [10, 3, 2, 2, "#ffffff"], [7, 2, 2, 1, "#ffffff"],
        [4, 7, 8, 6, "#f5e6c8"],
        [6, 9, 1, 2, "#2b2b3a"], [9, 9, 1, 2, "#2b2b3a"],
      ],
    },
  ];

  // Ostacoli a tema: le tre cose che davvero ti bloccano la giornata.
  const OSTACOLI = [
    {
      nome: "bug", w: 10, h: 8,
      px: [
        [1, 3, 8, 3, "#b03d4a"], [2, 2, 6, 1, "#8e2f3a"], [2, 6, 6, 1, "#8e2f3a"],
        [3, 1, 1, 1, "#8e2f3a"], [6, 1, 1, 1, "#8e2f3a"],
        [3, 3, 1, 1, "#ffffff"], [6, 3, 1, 1, "#ffffff"],
        [0, 5, 1, 2, "#5c1f26"], [9, 5, 1, 2, "#5c1f26"],
      ],
    },
    {
      nome: "caffe", w: 10, h: 10,
      px: [
        [3, 0, 1, 2, "#43435a"], [6, 1, 1, 1, "#43435a"],
        [1, 3, 7, 6, "#e8e8f0"], [2, 3, 5, 1, "#5b3a1e"],
        [8, 4, 2, 1, "#e8e8f0"], [9, 5, 1, 2, "#e8e8f0"], [8, 7, 2, 1, "#e8e8f0"],
        [0, 9, 10, 1, "#c8c8d4"],
      ],
    },
    {
      nome: "server", w: 10, h: 18,
      px: [
        [0, 0, 10, 18, "#3a3a48"], [1, 1, 8, 16, "#22222c"],
        [2, 3, 1, 1, "#4ade80"], [2, 6, 1, 1, "#facc15"],
        [2, 9, 1, 1, "#4ade80"], [2, 12, 1, 1, "#f87171"],
        [4, 3, 4, 1, "#4a4a5a"], [4, 6, 4, 1, "#4a4a5a"],
        [4, 9, 4, 1, "#4a4a5a"], [4, 12, 4, 1, "#4a4a5a"],
      ],
    },
  ];

  const runner = document.getElementById("runner");
  const rCanvas = document.getElementById("runnerCanvas");
  const heroGround = document.getElementById("heroGround");
  const heroEl = document.getElementById("home");

  if (runner && rCanvas && heroGround && heroEl) {
    const g = rCanvas.getContext("2d");
    const H = 110;            // altezza interna: i pixel restano grossi
    const SUOLO = 92;         // quota del terreno
    let W = 320;              // larghezza interna, ricalcolata a ogni resize
    let scala = 3;

    let omino = OMINI[0];
    let attivo = false, morto = false, rafId = null;
    let py, vy, velocita, punti, frame, ostacoli, nuvole, prossimo;

    let record = 0;
    try { record = parseInt(localStorage.getItem("ea_runner_best") || "0", 10); } catch (_) {}

    function dimensiona() {
      const largo = runner.clientWidth - 8 || 320;
      scala = largo < 520 ? 2 : 3;
      W = Math.max(160, Math.round(largo / scala));
      rCanvas.width = W;
      rCanvas.height = H;
      rCanvas.style.height = H * scala + "px";
      g.imageSmoothingEnabled = false;
    }

    function blocchi(px, x, y) {
      for (let i = 0; i < px.length; i++) {
        const r = px[i];
        g.fillStyle = r[4];
        g.fillRect(x + r[0], y + r[1], r[2], r[3]);
      }
    }

    function reset() {
      py = SUOLO - 16;
      vy = 0;
      velocita = 2.2;
      punti = 0;
      frame = 0;
      morto = false;
      ostacoli = [];
      prossimo = 70;
      nuvole = [
        { x: W * 0.3, y: 18, w: 14 },
        { x: W * 0.75, y: 30, w: 10 },
      ];
    }

    function salta() {
      if (morto) { reset(); return; }
      // si salta solo da terra: niente doppio salto, è un gioco onesto
      if (py >= SUOLO - 16 - 0.5) {
        vy = -6.4;
        beep(880, 0.07);
      }
    }

    function genera() {
      const tipo = OSTACOLI[Math.floor(Math.random() * OSTACOLI.length)];
      ostacoli.push({ tipo: tipo, x: W + 4, y: SUOLO - tipo.h });
      // più si va veloce, più stretto il margine — ma mai impossibile
      prossimo = Math.round(75 + Math.random() * 70 - velocita * 5);
    }

    function aggiorna() {
      frame++;

      vy += 0.55;
      py += vy;
      if (py > SUOLO - 16) { py = SUOLO - 16; vy = 0; }

      if (velocita < 5.4) velocita += 0.0016;

      if (--prossimo <= 0) genera();

      for (let i = ostacoli.length - 1; i >= 0; i--) {
        const o = ostacoli[i];
        o.x -= velocita;
        if (o.x + o.tipo.w < -4) { ostacoli.splice(i, 1); continue; }

        // riquadro di collisione più stretto del disegno: perdonare un
        // pixel qui evita morti che sembrano ingiuste
        if (
          24 + 3 < o.x + o.tipo.w - 1 &&
          24 + 13 > o.x + 1 &&
          py + 3 < o.y + o.tipo.h &&
          py + 16 > o.y + 2
        ) {
          morto = true;
          sfx.crash();
          if (punti > record) {
            record = punti;
            try { localStorage.setItem("ea_runner_best", String(record)); } catch (_) {}
          }
          if (punti >= 500) {
            unlock("runner500", "🏃", "MARATONETA — 500 punti di corsa!");
          }
        }
      }

      for (let i = 0; i < nuvole.length; i++) {
        nuvole[i].x -= velocita * 0.18;
        if (nuvole[i].x < -20) {
          nuvole[i].x = W + 10;
          nuvole[i].y = 12 + Math.random() * 26;
        }
      }

      if (frame % 6 === 0) punti++;
    }

    function disegna() {
      // cielo
      g.fillStyle = "#0b0b18";
      g.fillRect(0, 0, W, H);

      // stelle fisse, generate dalla posizione così non tremolano
      g.fillStyle = "#26263f";
      for (let i = 0; i < 18; i++) {
        g.fillRect((i * 37) % W, (i * 23) % (SUOLO - 20), 1, 1);
      }

      // nuvole
      g.fillStyle = "#1c1c33";
      for (let i = 0; i < nuvole.length; i++) {
        const n = nuvole[i];
        g.fillRect(n.x, n.y, n.w, 3);
        g.fillRect(n.x + 3, n.y - 2, n.w - 6, 2);
      }

      // terreno, negli stessi colori della striscia dell'hero
      g.fillStyle = "#4ade80";
      g.fillRect(0, SUOLO, W, 2);
      for (let x = 0; x < W; x += 8) {
        g.fillStyle = (Math.floor((x + frame * velocita) / 8) % 2) ? "#4a3620" : "#3d2c17";
        g.fillRect(x, SUOLO + 2, 8, H - SUOLO - 2);
      }

      // ostacoli
      for (let i = 0; i < ostacoli.length; i++) {
        blocchi(ostacoli[i].tipo.px, Math.round(ostacoli[i].x), ostacoli[i].y);
      }

      // personaggio
      const px = 24;
      blocchi(omino.corpo, px, Math.round(py));

      // gambe: ferme in aria, alternate a terra
      g.fillStyle = omino.gambe;
      const aTerra = py >= SUOLO - 16 - 0.5;
      const passo = aTerra && Math.floor(frame / 5) % 2 === 0;
      if (!aTerra) {
        g.fillRect(px + 4, Math.round(py) + 14, 3, 2);
        g.fillRect(px + 9, Math.round(py) + 14, 3, 2);
      } else if (passo) {
        g.fillRect(px + 3, Math.round(py) + 14, 3, 2);
        g.fillRect(px + 9, Math.round(py) + 14, 4, 2);
      } else {
        g.fillRect(px + 4, Math.round(py) + 14, 4, 2);
        g.fillRect(px + 10, Math.round(py) + 14, 3, 2);
      }

      // punteggio
      g.font = '8px "Press Start 2P", monospace';
      g.textAlign = "right";
      g.fillStyle = "#facc15";
      g.fillText(String(punti).padStart(5, "0"), W - 4, 12);
      g.fillStyle = "#4a4a68";
      g.fillText("HI " + String(record).padStart(5, "0"), W - 4, 24);

      if (morto) {
        g.fillStyle = "rgba(6,6,18,0.78)";
        g.fillRect(0, 0, W, H);
        g.textAlign = "center";
        g.fillStyle = "#f87171";
        g.font = '10px "Press Start 2P", monospace';
        g.fillText("GAME OVER", W / 2, H / 2 - 6);
        g.fillStyle = "#e8e8f5";
        g.font = '6px "Press Start 2P", monospace';
        g.fillText("SPAZIO PER RIPROVARE", W / 2, H / 2 + 12);
      }
      g.textAlign = "left";
    }

    function ciclo() {
      if (!attivo) return;
      if (!morto) aggiorna();
      disegna();
      rafId = requestAnimationFrame(ciclo);
    }

    function avvia() {
      if (attivo) return;
      attivo = true;
      runner.hidden = false;
      heroEl.classList.add("playing");
      setOverlayOpen(true);
      dimensiona();
      reset();
      unlock("runner", "🏃", "CORSA LIBERA — il terreno era giocabile");
      ciclo();
    }

    function esci() {
      attivo = false;
      cancelAnimationFrame(rafId);
      runner.hidden = true;
      heroEl.classList.remove("playing");
      setOverlayOpen(false);
    }

    // pulsanti per scegliere l'omino
    const listaOmini = document.getElementById("runnerChars");
    if (listaOmini) {
      OMINI.forEach((o, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "runner-char";
        b.textContent = o.nome;
        b.setAttribute("aria-pressed", String(i === 0));
        b.addEventListener("click", () => {
          omino = o;
          listaOmini.querySelectorAll(".runner-char").forEach((x) =>
            x.setAttribute("aria-pressed", String(x === b))
          );
          beep(660, 0.06);
        });
        listaOmini.appendChild(b);
      });
    }

    heroGround.addEventListener("click", avvia);

    const exitBtn = document.getElementById("runnerExit");
    if (exitBtn) exitBtn.addEventListener("click", esci);

    rCanvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      salta();
    });

    document.addEventListener("keydown", (e) => {
      if (!attivo) return;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        salta();
      } else if (e.key === "Escape") {
        esci();
      }
    });

    window.addEventListener("resize", () => { if (attivo) dimensiona(); });

    // scorrendo via si mette in pausa: inutile far girare il ciclo a vuoto
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!attivo) return;
          if (en.isIntersecting) {
            if (!rafId) ciclo();
          } else {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      }, { threshold: 0.2 }).observe(heroEl);
    }
  }


  /* ─────────────────────────────────────────────
     CONSOLE — per chi apre i DevTools
  ───────────────────────────────────────────── */
  console.log(
    "%c\n" +
    "  ███████╗ █████╗ \n" +
    "  ██╔════╝██╔══██╗\n" +
    "  █████╗  ███████║\n" +
    "  ██╔══╝  ██╔══██║\n" +
    "  ███████╗██║  ██║\n" +
    "  ╚══════╝╚═╝  ╚═╝\n",
    "color:#4ade80;font-family:monospace;"
  );
  console.log(
    "%cCiao, collega nerd! 🤓 Se sei qui, apprezzerai gli easter egg:\n" +
    "  · ↑↑↓↓←→←→BA (il classico)\n" +
    "  · scrivi 'nerd', 'coffee' o 'jedi' sulla pagina\n" +
    "  · clicca 5 volte il mio avatar\n" +
    "  · svuota il blocco '?' e prova a perdere tutti i cuori\n" +
    "  · nel footer c'è un Game Boy funzionante\n" +
    "  · il terreno sotto l'hero si può correre\n" +
    "  · triplo click sul logo EA...\n\n" +
    "Se ti piace quello che vedi: arnaudoenrico@gmail.com",
    "color:#22d3ee;font-size:13px;font-family:monospace;"
  );
})();
