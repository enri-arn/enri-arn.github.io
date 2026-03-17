/* ─────────────────────────────────────────────────────────
   ENRICO ARNAUDO PORTFOLIO — MAIN JAVASCRIPT
   Theme Toggle · Scroll effects · Reveal animations
   Navbar · Mobile menu · Smooth UX · Interactive effects
───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── DOM READY ──────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavbar();
    initMobileMenu();
    initRevealAnimations();
    initActiveNavLinks();
    initSmoothScroll();
    initHeroParallax();
    initEasterEgg();
  });

  /* ══════════════════════════════════════════════════════
     1. THEME TOGGLE — LIGHT / DARK
  ══════════════════════════════════════════════════════ */
  function initTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const savedTheme = localStorage.getItem("ea-theme") || "dark";
    applyTheme(savedTheme);

    themeToggle?.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("ea-theme", next);

      themeToggle.style.transform = "rotate(360deg) scale(1.2)";
      setTimeout(() => {
        themeToggle.style.transform = "";
      }, 400);
    });

    function applyTheme(theme) {
      html.setAttribute("data-theme", theme);
      if (themeIcon) {
        if (theme === "dark") {
          themeIcon.className = "fas fa-sun";
          themeToggle?.setAttribute("title", "Passa al tema chiaro");
        } else {
          themeIcon.className = "fas fa-moon";
          themeToggle?.setAttribute("title", "Passa al tema scuro");
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════
     2. NAVBAR — SCROLL EFFECT
  ══════════════════════════════════════════════════════ */
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY;
      if (scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateNavbar);
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* ══════════════════════════════════════════════════════
     3. MOBILE MENU
  ══════════════════════════════════════════════════════ */
  function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    if (!hamburger || !navLinks) return;

    let isOpen = false;

    const backdrop = document.createElement("div");
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 998;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(backdrop);

    function openMenu() {
      isOpen = true;
      hamburger.classList.add("active");
      navLinks.classList.add("open");
      backdrop.style.opacity = "1";
      backdrop.style.pointerEvents = "auto";
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      isOpen = false;
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      backdrop.style.opacity = "0";
      backdrop.style.pointerEvents = "none";
      document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", () => {
      isOpen ? closeMenu() : openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && isOpen) closeMenu();
    });
  }

  /* ══════════════════════════════════════════════════════
     4. SCROLL REVEAL ANIMATIONS
  ══════════════════════════════════════════════════════ */
  function initRevealAnimations() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     5. ACTIVE NAV LINKS — SCROLL SPY
  ══════════════════════════════════════════════════════ */
  function initActiveNavLinks() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ══════════════════════════════════════════════════════
     6. SMOOTH SCROLL
  ══════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      if (anchor.classList.contains("nav-logo")) return;
      anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const navbarHeight =
          document.getElementById("navbar")?.offsetHeight || 80;
        const targetPos =
          target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     7. HERO PARALLAX — Enhanced with autonomous drift
  ══════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const heroGlow1 = document.querySelector(".hero-glow-1");
    const heroGlow2 = document.querySelector(".hero-glow-2");
    if (!heroGlow1 || !heroGlow2) return;

    let mouseX = 0, mouseY = 0;
    let glow1X = 0, glow1Y = 0;
    let glow2X = 0, glow2Y = 0;
    let time = 0;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch) {
      document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    function animateGlows() {
      time += 0.008;

      // Autonomous drift (always active, even on mobile)
      const driftX1 = Math.sin(time * 0.7) * 40 + Math.cos(time * 1.3) * 20;
      const driftY1 = Math.cos(time * 0.5) * 30 + Math.sin(time * 1.1) * 15;
      const driftX2 = Math.cos(time * 0.6) * 35 + Math.sin(time * 1.4) * 18;
      const driftY2 = Math.sin(time * 0.8) * 25 + Math.cos(time * 1.2) * 12;

      // Mouse-follow (desktop only)
      const targetX1 = driftX1 + (isTouch ? 0 : mouseX * 40);
      const targetY1 = driftY1 + (isTouch ? 0 : mouseY * 30);
      const targetX2 = driftX2 + (isTouch ? 0 : mouseX * -30);
      const targetY2 = driftY2 + (isTouch ? 0 : mouseY * -20);

      // Smooth lerp
      glow1X += (targetX1 - glow1X) * 0.03;
      glow1Y += (targetY1 - glow1Y) * 0.03;
      glow2X += (targetX2 - glow2X) * 0.03;
      glow2Y += (targetY2 - glow2Y) * 0.03;

      const scale1 = 1 + Math.sin(time * 0.4) * 0.08;
      const scale2 = 1 + Math.cos(time * 0.3) * 0.06;

      heroGlow1.style.transform = `translate(${glow1X}px, ${glow1Y}px) scale(${scale1})`;
      heroGlow2.style.transform = `translate(${glow2X}px, ${glow2Y}px) scale(${scale2})`;

      requestAnimationFrame(animateGlows);
    }
    animateGlows();
  }

  /* ══════════════════════════════════════════════════════
     8. SKILL PILLS — Stagger + Shine animation
  ══════════════════════════════════════════════════════ */
  function initSkillsAnimation() {
    const groups = document.querySelectorAll(".skills-group");
    groups.forEach((group) => {
      const pills = group.querySelectorAll(".skill-pill");
      pills.forEach((pill, i) => {
        pill.style.transitionDelay = `${i * 40}ms`;
      });
    });

    // Animate pills into view when skills section appears
    const skillsSection = document.querySelector(".skills");
    if (!skillsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const allPills = entry.target.querySelectorAll(".skill-pill");
          allPills.forEach((pill, i) => {
            setTimeout(() => {
              pill.classList.add("pill-visible");
            }, i * 50);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(skillsSection);
  }

  /* ══════════════════════════════════════════════════════
     9. COUNTER ANIMATION
  ══════════════════════════════════════════════════════ */
  function initCounters() {
    const counters = document.querySelectorAll(".stat-number[data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => observer.observe(c));
  }

  /* ══════════════════════════════════════════════════════
     10. CURSOR GLOW — Interactive with elements
  ══════════════════════════════════════════════════════ */
  function initCursorGlow() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.style.cssText = `
      position: fixed;
      width: 300px; height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(circle, rgba(200,80,192,0.06) 0%, rgba(255,107,74,0.03) 40%, transparent 70%);
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      transition: width 0.4s ease, height 0.4s ease, opacity 0.3s ease;
    `;
    document.body.appendChild(glow);

    // Secondary glow ring
    const ring = document.createElement("div");
    ring.style.cssText = `
      position: fixed;
      width: 40px; height: 40px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      border: 1px solid rgba(200,80,192,0.2);
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
      opacity: 0.6;
    `;
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let ringX = 0, ringY = 0;
    let currentSize = 300;
    let targetSize = 300;
    let hoveredElement = null;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Detect interactive elements
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const card = el?.closest(".service-card, .project-card, .beyond-card, .skill-pill, .profile-card, .timeline-card, .mockup-placeholder, .contact-method, .btn");

      if (card && card !== hoveredElement) {
        hoveredElement = card;
        if (card.matches(".service-card, .project-card, .beyond-card")) {
          targetSize = 500;
          glow.style.background = "radial-gradient(circle, rgba(200,80,192,0.1) 0%, rgba(255,107,74,0.05) 40%, transparent 70%)";
          ring.style.width = "60px";
          ring.style.height = "60px";
          ring.style.borderColor = "rgba(200,80,192,0.4)";
        } else if (card.matches(".skill-pill")) {
          targetSize = 150;
          glow.style.background = "radial-gradient(circle, rgba(65,88,208,0.12) 0%, transparent 60%)";
          ring.style.width = "24px";
          ring.style.height = "24px";
          ring.style.borderColor = "rgba(65,88,208,0.5)";
        } else if (card.matches(".btn")) {
          targetSize = 200;
          glow.style.background = "radial-gradient(circle, rgba(255,107,74,0.12) 0%, transparent 60%)";
          ring.style.width = "50px";
          ring.style.height = "50px";
          ring.style.borderColor = "rgba(255,107,74,0.5)";
        } else {
          targetSize = 400;
          glow.style.background = "radial-gradient(circle, rgba(200,80,192,0.08) 0%, rgba(255,107,74,0.04) 40%, transparent 70%)";
          ring.style.width = "50px";
          ring.style.height = "50px";
          ring.style.borderColor = "rgba(200,80,192,0.3)";
        }
      } else if (!card && hoveredElement) {
        hoveredElement = null;
        targetSize = 300;
        glow.style.background = "radial-gradient(circle, rgba(200,80,192,0.06) 0%, rgba(255,107,74,0.03) 40%, transparent 70%)";
        ring.style.width = "40px";
        ring.style.height = "40px";
        ring.style.borderColor = "rgba(200,80,192,0.2)";
      }
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      currentSize += (targetSize - currentSize) * 0.1;

      glow.style.left = glowX + "px";
      glow.style.top = glowY + "px";
      glow.style.width = currentSize + "px";
      glow.style.height = currentSize + "px";

      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";

      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ══════════════════════════════════════════════════════
     11. SERVICE CARDS — Tilt + Themed backgrounds
  ══════════════════════════════════════════════════════ */
  function initCardTilt() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll(".service-card, .project-card, .beyond-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        card.style.transform = `
          translateY(-4px)
          rotateX(${-y * 4}deg)
          rotateY(${x * 4}deg)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition =
          "transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease";
        setTimeout(() => {
          card.style.transition = "";
        }, 500);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     12. SERVICE CARDS — Themed hover overlays
  ══════════════════════════════════════════════════════ */
  function initServiceCardThemes() {
    const themes = {
      "full-stack": {
        lines: [
          "import { Module } from '@nestjs/common';",
          "import { AppController } from './app';",
          "@Module({ imports: [DatabaseModule],",
          "  controllers: [AppController],",
          "  providers: [AppService] })",
          "export class AppModule {}",
          "",
          "// Angular Component",
          "@Component({ selector: 'app-root' })",
          "export class AppComponent {",
          "  title = 'healthcare-portal';",
          "}"
        ],
        color: "rgba(255,107,74,0.15)"
      },
      "microsoft": {
        lines: [
          "PS C:\\> Get-ADUser -Filter *",
          "  | Where-Object {$_.Enabled}",
          "  | Select Name,LastLogon",
          "",
          "PS C:\\> Set-IntuneMDMPolicy \\",
          "  -ComplianceRequired $true",
          "  -EncryptionEnabled $true",
          "",
          "PS C:\\> New-AzWebApp \\",
          "  -ResourceGroup 'asl-prod'",
          "  -Name 'healthcare-api'",
          "  -Runtime 'DOTNET|8.0'"
        ],
        color: "rgba(65,88,208,0.15)"
      },
      "cloud": {
        lines: [
          "FROM node:20-alpine",
          "WORKDIR /app",
          "COPY package*.json ./",
          "RUN npm ci --production",
          "COPY dist/ ./dist/",
          "EXPOSE 3000",
          "CMD [\"node\", \"dist/main\"]",
          "",
          "# docker-compose.yml",
          "services:",
          "  api:",
          "    build: ."
        ],
        color: "rgba(200,80,192,0.15)"
      },
      "automation": {
        lines: [
          "# Workflow: Patient Data Sync",
          "trigger: schedule(\"0 6 * * *\")",
          "steps:",
          "  - fetch: hl7://admission",
          "  - transform: normalize_fhir()",
          "  - validate: schema.check()",
          "  - load: db.patients.upsert()",
          "  - notify: teams.send(status)",
          "",
          "on_error:",
          "  retry: 3",
          "  alert: ops@asl.it"
        ],
        color: "rgba(255,107,74,0.15)"
      },
      "design": {
        lines: [
          "┌─────────────────────────┐",
          "│  ≡  Healthcare Portal   │",
          "├─────────────────────────┤",
          "│ ┌─────┐ ┌─────┐ ┌────┐ │",
          "│ │Stats│ │Chart│ │List│ │",
          "│ └─────┘ └─────┘ └────┘ │",
          "│ ┌───────────────────┐   │",
          "│ │  Patient Records  │   │",
          "│ │  ▓▓▓▓▓▓░░ 75%    │   │",
          "│ │  ▓▓▓▓░░░░ 50%    │   │",
          "│ └───────────────────┘   │",
          "└─────────────────────────┘"
        ],
        color: "rgba(200,80,192,0.15)"
      },
      "security": {
        lines: [
          "╔═══ OAuth2 Flow ═══╗",
          "║ Client → AuthZ    ║",
          "║   ↓ code          ║",
          "║ Client → Token    ║",
          "║   ↓ access_token  ║",
          "║ Client → Resource ║",
          "╚════════════════════╝",
          "",
          "# Token Ring Protocol",
          "Node[0] → token → Node[1]",
          "Node[1] → token → Node[2]",
          "Node[2] → token → Node[0]"
        ],
        color: "rgba(65,88,208,0.15)"
      }
    };

    const themeKeys = Object.keys(themes);
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card, index) => {
      const themeKey = themeKeys[index];
      if (!themeKey) return;
      const theme = themes[themeKey];

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "service-theme-overlay";
      overlay.setAttribute("aria-hidden", "true");

      // Add code lines
      const codeBlock = document.createElement("div");
      codeBlock.className = "theme-code";
      theme.lines.forEach((line, i) => {
        const span = document.createElement("div");
        span.className = "theme-code-line";
        span.textContent = line;
        span.style.animationDelay = `${i * 0.05}s`;
        codeBlock.appendChild(span);
      });

      overlay.appendChild(codeBlock);
      overlay.style.setProperty("--theme-color", theme.color);
      card.appendChild(overlay);
      card.style.perspective = "800px";
    });
  }

  /* ══════════════════════════════════════════════════════
     13. MOCKUP ANIMATIONS
  ══════════════════════════════════════════════════════ */
  function initMockupAnimations() {
    const mockups = document.querySelectorAll(".mockup-placeholder");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const placeholders = entry.target.querySelectorAll('[class^="ph-"]');
          placeholders.forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = "opacity 0.4s ease";
              el.style.opacity = "1";
            }, i * 100);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );

    mockups.forEach((m) => {
      const placeholders = m.querySelectorAll('[class^="ph-"]');
      placeholders.forEach((el) => {
        el.style.opacity = "0.2";
      });
      observer.observe(m);
    });
  }

  /* ══════════════════════════════════════════════════════
     14. SKILLS GROUP — Hover wave effect
  ══════════════════════════════════════════════════════ */
  function initSkillsGroupHover() {
    const groups = document.querySelectorAll(".skills-group");

    groups.forEach((group) => {
      group.addEventListener("mouseenter", () => {
        const pills = group.querySelectorAll(".skill-pill");
        pills.forEach((pill, i) => {
          setTimeout(() => {
            pill.classList.add("pill-wave");
            setTimeout(() => pill.classList.remove("pill-wave"), 600);
          }, i * 60);
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     15. BEYOND CARDS — Mountain parallax layers
  ══════════════════════════════════════════════════════ */
  function initBeyondEffects() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const beyondCards = document.querySelectorAll(".beyond-card");
    beyondCards.forEach((card) => {
      const icon = card.querySelector(".beyond-card-icon");
      if (!icon) return;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        icon.style.transform = `translate(${x * 8}px, ${y * 6}px) scale(1.05)`;
      });

      card.addEventListener("mouseleave", () => {
        icon.style.transform = "";
        icon.style.transition = "transform 0.4s ease";
        setTimeout(() => { icon.style.transition = ""; }, 400);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     16. FLOATING PARTICLES (hero + beyond)
  ══════════════════════════════════════════════════════ */
  function initParticles() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const canvas = document.createElement("canvas");
    canvas.className = "particles-canvas";
    canvas.style.cssText = `
      position: absolute; inset: 0; z-index: 0;
      pointer-events: none; opacity: 0.7;
    `;
    hero.querySelector(".hero-bg").appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#ff6b4a", "#c850c0", "#4158d0"];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 0.8,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.3 - 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = "#c850c0";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.globalAlpha = 0.1 * (1 - dist / 140);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ══════════════════════════════════════════════════════
     17. SECTION SCROLL PARALLAX
  ══════════════════════════════════════════════════════ */
  function initScrollParallax() {
    const sectionHeaders = document.querySelectorAll(".section-header");

    window.addEventListener("scroll", () => {
      sectionHeaders.forEach((header) => {
        const rect = header.getBoundingClientRect();
        const speed = 0.05;
        const offset = (rect.top - window.innerHeight / 2) * speed;
        header.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     18. MOUSE RIPPLES — Water ripple effect on mouse move
  ══════════════════════════════════════════════════════ */
  function initMouseRipples() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position: fixed; inset: 0; z-index: 9997;
      pointer-events: none;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let w, h;
    const ripples = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Spawn ripples on mouse move (throttled)
    let lastSpawn = 0;
    document.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - lastSpawn < 80) return; // spawn every ~80ms
      lastSpawn = now;

      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 50 + Math.random() * 30,
        alpha: 0.5,
        lineWidth: 2,
      });

      // Secondary smaller ripple for depth
      if (Math.random() > 0.4) {
        ripples.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          radius: 2,
          maxRadius: 25 + Math.random() * 20,
          alpha: 0.3,
          lineWidth: 1.2,
        });
      }
    });

    // Also spawn on click with bigger ripple
    document.addEventListener("click", (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 90 + Math.random() * 40,
        alpha: 0.7,
        lineWidth: 2.5,
      });
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 3,
        maxRadius: 55 + Math.random() * 25,
        alpha: 0.4,
        lineWidth: 1.5,
      });
    });

    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";

    function animate() {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];

        // Expand
        r.radius += (r.maxRadius - r.radius) * 0.04 + 0.6;

        // Fade out based on expansion progress
        const progress = r.radius / r.maxRadius;
        r.alpha = (1 - progress) * 0.5;
        r.lineWidth *= 0.985;

        if (r.alpha <= 0.01 || r.radius >= r.maxRadius * 0.98) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = dark
          ? `rgba(200, 80, 192, ${r.alpha})`
          : `rgba(99, 102, 241, ${r.alpha})`;
        ctx.lineWidth = r.lineWidth;
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ══════════════════════════════════════════════════════
     19. ROCKET LAUNCH — Rocket flies around & exits screen on click
  ══════════════════════════════════════════════════════ */
  function initRocketLaunch() {
    const ctaIcon = document.querySelector(".cta-card .cta-icon");
    if (!ctaIcon) return;

    let isFlying = false;

    // Hover: gentle wiggle via CSS (already handled)
    // Click: launch the rocket!
    ctaIcon.addEventListener("click", () => {
      if (isFlying) return;
      isFlying = true;

      const rect = ctaIcon.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      // Create a flying clone of the rocket icon
      const clone = document.createElement("div");
      clone.innerHTML = '<i class="fas fa-rocket"></i>';
      clone.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #fff;
        background: linear-gradient(135deg, #ff6b4a, #c850c0, #4158d0);
        border-radius: 16px;
        z-index: 99999;
        pointer-events: none;
        transform: translate(-50%, -50%) rotate(-45deg);
        transition: none;
        box-shadow: 0 0 20px rgba(200, 80, 192, 0.6);
      `;
      document.body.appendChild(clone);

      // Hide real icon
      ctaIcon.style.opacity = "0";

      // Trail canvas for fire particles
      const trailCanvas = document.createElement("canvas");
      trailCanvas.style.cssText = `
        position: fixed; inset: 0; z-index: 99998;
        pointer-events: none;
      `;
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
      document.body.appendChild(trailCanvas);
      const ctx = trailCanvas.getContext("2d");
      const trails = [];

      // Generate random waypoints across the screen
      const waypoints = [];
      const wpCount = 4 + Math.floor(Math.random() * 3); // 4-6 waypoints
      for (let i = 0; i < wpCount; i++) {
        waypoints.push({
          x: 100 + Math.random() * (window.innerWidth - 200),
          y: 60 + Math.random() * (window.innerHeight - 120),
        });
      }
      // Final waypoint: fly off screen (top-right)
      waypoints.push({
        x: window.innerWidth + 100,
        y: -100,
      });

      let currentWP = 0;
      let posX = startX;
      let posY = startY;
      let angle = -45;
      const speed = 6;
      let frame = 0;

      function animate() {
        frame++;
        if (currentWP >= waypoints.length) {
          // Done — cleanup
          clone.remove();
          trailCanvas.remove();
          ctaIcon.style.opacity = "1";
          ctaIcon.classList.add("rocket-returned");
          setTimeout(() => ctaIcon.classList.remove("rocket-returned"), 600);
          isFlying = false;
          return;
        }

        const target = waypoints[currentWP];
        const dx = target.x - posX;
        const dy = target.y - posY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Smooth rotation toward target
        let angleDiff = targetAngle - angle;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        angle += angleDiff * 0.08;

        // Move toward target
        const moveSpeed = Math.min(speed + frame * 0.02, 14);
        if (dist < moveSpeed) {
          posX = target.x;
          posY = target.y;
          currentWP++;
        } else {
          posX += (dx / dist) * moveSpeed;
          posY += (dy / dist) * moveSpeed;
        }

        // Update clone position
        clone.style.left = posX + "px";
        clone.style.top = posY + "px";
        clone.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        // Spawn trail particles behind the rocket
        const trailAngle = (angle + 180) * (Math.PI / 180);
        for (let i = 0; i < 3; i++) {
          const spread = (Math.random() - 0.5) * 0.6;
          trails.push({
            x: posX + Math.cos(trailAngle + spread) * 20,
            y: posY + Math.sin(trailAngle + spread) * 20,
            vx: Math.cos(trailAngle + spread) * (1 + Math.random() * 2),
            vy: Math.sin(trailAngle + spread) * (1 + Math.random() * 2),
            radius: 3 + Math.random() * 4,
            alpha: 0.8,
            color: ["#ff6b4a", "#c850c0", "#ffaa33", "#ff4444"][Math.floor(Math.random() * 4)],
          });
        }

        // Draw & update trail particles
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = trails.length - 1; i >= 0; i--) {
          const t = trails[i];
          t.x += t.vx;
          t.y += t.vy;
          t.alpha -= 0.025;
          t.radius *= 0.97;

          if (t.alpha <= 0) {
            trails.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fillStyle = t.color.replace(")", `, ${t.alpha})`).replace("rgb", "rgba").replace("#", "");
          // Convert hex to rgba
          const hex = t.color;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${t.alpha})`;
          ctx.fill();
        }

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  }

  /* ══════════════════════════════════════════════════════
     EASTER EGG — Triple click on EA logo
  ══════════════════════════════════════════════════════ */
  function initEasterEgg() {
    const logo = document.querySelector(".nav-logo");
    if (!logo) return;

    let clickCount = 0;
    let clickTimer = null;

    logo.addEventListener("click", (e) => {
      e.preventDefault();
      clickCount++;

      if (clickCount === 1) {
        // Wait to see if more clicks follow
        clickTimer = setTimeout(() => {
          // Only 1 or 2 clicks — do normal scroll to #home
          clickCount = 0;
          const target = document.querySelector("#home");
          if (target) {
            const navbarHeight =
              document.getElementById("navbar")?.offsetHeight || 80;
            const targetPos =
              target.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: targetPos, behavior: "smooth" });
          }
        }, 600);
      }

      if (clickCount >= 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        window.location.href = "cronaca.html";
      }
    });
  }

  /* ── INIT POST-LOAD ───────────────────────────────────── */
  window.addEventListener("load", () => {
    initSkillsAnimation();
    initCounters();
    initCursorGlow();
    initCardTilt();
    initMockupAnimations();
    initServiceCardThemes();
    initSkillsGroupHover();
    initBeyondEffects();
    initParticles();
    initScrollParallax();
    initMouseRipples();
    initRocketLaunch();
  });

  /* ── RESIZE DEBOUNCE ────────────────────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-run any layout-dependent logic if needed
    }, 250);
  });
})();
