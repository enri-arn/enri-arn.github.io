/* ═══════════════════════════════════════════════════════════
   Pagine interne — menu, reveal e un paio di easter egg.
   Versione leggera: niente HUD, niente Snake. Quelli stanno
   in pixel.js sulla home.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── menu mobile ─── */
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

  /* ─── reveal allo scroll ─── */
  const targets = document.querySelectorAll(
    ".pixel-card, .section-title, .section-sub, .code-block, .classified, .exhibit, .note"
  );

  // le pagine dei mockup usano il vecchio schema .reveal -> .visible
  const legacy = document.querySelectorAll(".reveal");

  function show(el) {
    el.classList.remove("reveal-hidden");
    el.classList.add(el.classList.contains("reveal") ? "visible" : "reveal-shown");
  }

  if ("IntersectionObserver" in window) {
    targets.forEach((el) => el.classList.add("reveal-hidden"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    legacy.forEach((el) => io.observe(el));
  } else {
    // senza observer si mostra tutto subito: meglio visibile che invisibile
    targets.forEach(show);
    legacy.forEach(show);
  }

  /* ─── easter egg: le barrette nere non nascondono niente ─── */
  document.querySelectorAll(".redacted").forEach((el) => {
    el.addEventListener("click", () => el.classList.toggle("revealed"));
  });

  /* ─────────────────────────────────────────────
     INTERRUTTORE DEL MONITOR CRT
     Il tonfo del tasto e lo scoppiettio elettrostatico
     sono generati al volo: nessun file audio da scaricare.
  ───────────────────────────────────────────── */
  let audioCtx = null;

  function ac() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  // il "clunk" meccanico del tasto
  function clunk() {
    const c = ac();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.07);
    gain.gain.setValueAtTime(0.09, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.1);
  }

  // la scarica statica del tubo che si spegne
  function staticBurst() {
    const c = ac();
    if (!c) return;
    const dur = 0.28;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // rumore che si spegne in fretta
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const src = c.createBufferSource();
    const gain = c.createGain();
    const filter = c.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    gain.gain.value = 0.05;
    src.buffer = buf;
    src.connect(filter).connect(gain).connect(c.destination);
    src.start();
  }

  document.querySelectorAll("[data-crt-power]").forEach((btn) => {
    const crt = btn.closest(".crt");
    if (!crt) return;
    const label = btn.querySelector("[data-crt-power-label]");
    let on = true;

    btn.addEventListener("click", () => {
      on = !on;
      crt.classList.toggle("is-off", !on);
      crt.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(!on));
      if (label) label.textContent = on ? "ON" : "OFF";

      clunk();
      if (!on) setTimeout(staticBurst, 60);
    });
  });

  /* ─── per chi apre i DevTools anche qui ─── */
  console.log(
    "%cStai cercando i dettagli di Asgard nel sorgente?\n" +
      "Non ci sono. Sono su un repository privato, ed è esattamente lì che devono stare.\n" +
      "Però apprezzo il metodo. 🕵  →  arnaudoenrico@gmail.com",
    "color:#4ade80;font-size:13px;font-family:monospace;"
  );
})();
