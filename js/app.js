/* ─────────────────────────────────────────────────────
   app.js — init, global keyboard, clock,
   scroll-tied sidebar messages, below-fold rendering
───────────────────────────────────────────────────── */

(function () {
  /* ── Clock ── (kept harmless if the element was removed) ── */
  const clockEl = document.getElementById("clock");
  if (clockEl) {
    function tickClock() {
      clockEl.textContent = new Date().toISOString().slice(11, 19);
    }
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* ── Uptime: seconds since the big bang in scientific notation ── */
  (function bigBangTicker() {
    const el = document.getElementById("sb-uptime");
    if (!el) return;
    const YEAR_SEC = 365.25 * 86400;
    const BASE_SEC = 13.797e9 * YEAR_SEC;
    const t0 = Date.now() / 1000;
    const SUPERS = {
      0: "⁰",
      1: "¹",
      2: "²",
      3: "³",
      4: "⁴",
      5: "⁵",
      6: "⁶",
      7: "⁷",
      8: "⁸",
      9: "⁹",
    };
    const sup = (n) =>
      String(n)
        .split("")
        .map((c) => SUPERS[c] || c)
        .join("");

    function render() {
      const s = BASE_SEC + (Date.now() / 1000 - t0);
      const exp = Math.floor(Math.log10(s));
      const mantissa = (s / Math.pow(10, exp)).toFixed(5);
      el.textContent = `${mantissa}×10${sup(exp)} s`;
    }
    render();
    setInterval(render, 1000);
  })();

  /* ── Below-fold rendering ──────────────────────── */
  document.getElementById("below-essays").innerHTML = DATA.essays
    .map(
      (e) => `
      <a class="essay" href="${e.href || "field-notes/index.html"}">
        <span class="essay-d">${e.date}</span>
        <span class="essay-t">${e.title}</span>
        <span class="essay-tag">#${e.tag}</span>
      </a>`,
    )
    .join("");

  document.getElementById("below-work").innerHTML = DATA.projects
    .map(
      (p) => `
      <a class="work" href="${p.href || "#projects"}" ${p.external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="work-slug">${p.slug}</span>
        <span class="work-role">${p.role}</span>
        <span class="work-year">${p.year}</span>
      </a>`,
    )
    .join("");

  /* ── Scroll-tied sidebar messages ──────────────── */
  const fired = new Set();
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sec = e.target.dataset.section;
        if (!sec || fired.has(sec)) return;
        const msg = DATA.sectionMessages[sec];
        if (msg) {
          fired.add(sec);
          const ts = (8000 + Math.random() * 2000).toFixed(3);
          Sidebar.pushRaw(`[ ${ts}] ${msg.t}`, msg.c);
        }
      });
    },
    { threshold: 0.25 },
  );

  document
    .querySelectorAll(".sec[data-section]")
    .forEach((el) => obs.observe(el));

  /* ── Global keyboard ───────────────────────────── */
  const CHIP_MAP = {
    w: "whoami",
    p: "projects",
    r: "writing",
    b: "beliefs",
    c: "contact",
    l: "ls",
  };

  document.addEventListener("keydown", (e) => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
    if (isCmdK) {
      e.preventDefault();
      Palette.toggle();
      return;
    }

    // Inside palette — palette.js handles arrow/enter/esc
    if (Palette.isOpen()) return;

    // If focus is in an input/textarea (incl. terminal), only handle ⌘-commands
    const inInput =
      e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
    if (inInput) return;

    // '/' opens palette from anywhere (not inside a text field)
    if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      Palette.open();
      return;
    }

    // Letter shortcuts → chip-type the command into the terminal
    const cmd = CHIP_MAP[e.key.toLowerCase()];
    if (cmd && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const chip = document.querySelector(`.chip[data-cmd="${cmd}"]`);
      Terminal.chipType(cmd, chip);
    }

    // '?' or 'Shift+/' → help
    if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const chip = document.querySelector(`.chip[data-cmd="help"]`);
      Terminal.chipType("help", chip);
    }
  });

  /* ── Top-bar search opens palette ──────────────── */
  document.getElementById("top-search").addEventListener("click", Palette.open);

  /* ── Kernel window — close / minimize / expand ───
     Three traffic-light buttons drive three states:
       close    → window hidden, reopener pill shown
       minimize → only the title bar visible (.is-min)
       expand   → centered modal with backdrop + bigger fonts (.is-max)
     State persists in localStorage so visitors keep their layout.
     Note: max state never persists across reloads — reopens to default. */
  (function kernelWindow() {
    const win = document.getElementById("kwin");
    const reopen = document.getElementById("kwin-reopen");
    const backdrop = document.getElementById("kwin-backdrop");
    const btnClose = document.getElementById("kw-close");
    const btnMin = document.getElementById("kw-min");
    const btnMax = document.getElementById("kw-max");
    if (!win || !reopen || !backdrop) return;

    const KEY = "kwinState";
    function save(state) {
      // Don't persist `max` — modal is always a fresh action.
      if (state === "max") return;
      try {
        localStorage.setItem(KEY, state);
      } catch (_) {}
    }
    function load() {
      try {
        return localStorage.getItem(KEY);
      } catch (_) {
        return null;
      }
    }

    function setState(state) {
      win.classList.remove("is-min", "is-max", "is-closed");
      reopen.hidden = true;
      backdrop.hidden = true;
      if (state === "closed") {
        win.classList.add("is-closed");
        reopen.hidden = false;
      } else if (state === "min") {
        win.classList.add("is-min");
      } else if (state === "max") {
        win.classList.add("is-max");
        backdrop.hidden = false;
        scrollLogBottom();
      } else {
        scrollLogBottom();
      }
      save(state);
    }
    function scrollLogBottom() {
      const log = win.querySelector(".kwin-log");
      if (log) log.scrollTop = log.scrollHeight;
    }

    btnClose.addEventListener("click", () => setState("closed"));
    btnMin.addEventListener("click", () =>
      setState(win.classList.contains("is-min") ? "default" : "min"),
    );
    btnMax.addEventListener("click", () =>
      setState(win.classList.contains("is-max") ? "default" : "max"),
    );
    // Click on title bar of a minimized window expands it
    win.querySelector(".kwin-bar").addEventListener("click", (e) => {
      if (!win.classList.contains("is-min")) return;
      if (e.target.closest(".kwin-traffic")) return;
      setState("default");
    });
    reopen.addEventListener("click", () => setState("default"));
    // Backdrop click closes the modal
    backdrop.addEventListener("click", () => setState("default"));
    // Esc collapses the modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && win.classList.contains("is-max"))
        setState("default");
    });

    // Restore prior state, or default to open. Max never auto-restores.
    const saved = load();
    setState(saved && saved !== "max" ? saved : "default");
  })();

  /* ── Init ───────────────────────────────────────── */
  Terminal.init();
  Sidebar.runBoot();

  // Auto-run whoami early so the multi-facet identity surfaces fast for skim readers
  setTimeout(() => Terminal.rerunWhoami(), 350);
})();
