/* ─────────────────────────────────────────────────────
   sidebar.js — boot sequence + live dmesg stream
   New lines append at the BOTTOM (real kernel style).
   Log is capped to keep page height bounded.
───────────────────────────────────────────────────── */

const Sidebar = (() => {
  const MAX_LINES = 200; // sidebar has internal scroll; cap only for memory hygiene

  const logEl       = document.getElementById("sb-log");    // .sb-log-inner
  const logScroller = logEl.parentElement;                   // .kwin-log scroll container
  const statusEl    = document.getElementById("sb-status");

  let bootRunning = false;
  let bootTimer   = null;
  let streamTimer = null;

  function appendLine(text, cls) {
    const d = document.createElement("div");
    d.className = "sb-line " + (cls || "");
    d.textContent = text === "" ? " " : text;
    logEl.appendChild(d);
    while (logEl.children.length > MAX_LINES) logEl.removeChild(logEl.firstChild);
    // Auto-scroll to keep newest line in view
    logScroller.scrollTop = logScroller.scrollHeight;
  }

  function buildBootSequence() {
    // 1 in 5 boots: splice in a random easter-egg pair after the free-will quip line.
    const seq = DATA.boot.slice();
    const eggs = DATA.bootEasterEggs;
    if (!eggs || !eggs.length) return seq;
    if (Math.random() >= 0.2) return seq;
    const pick = eggs[Math.floor(Math.random() * eggs.length)];
    // Insert after the "(see: bugs section of man curious)" line, if present;
    // otherwise splice after the free-will entry.
    let idx = seq.findIndex(l => /bugs section of man curious/.test(l.t));
    if (idx < 0) idx = seq.findIndex(l => /free will/.test(l.t));
    if (idx < 0) idx = Math.floor(seq.length / 2);
    seq.splice(idx + 1, 0, ...pick);
    return seq;
  }

  function runBoot() {
    clearTimeout(bootTimer);
    clearInterval(streamTimer);
    logEl.innerHTML = "";
    statusEl.textContent = "booting…";
    bootRunning = true;

    const sequence = buildBootSequence();
    let i = 0;
    (function step() {
      if (!bootRunning) return;
      if (i >= sequence.length) {
        // Clear boot status — timer in #sb-uptime takes over from here.
        statusEl.textContent = "";
        bootRunning = false;
        startStream();
        return;
      }
      const line = sequence[i++];
      appendLine(line.t, line.c);
      const pct = Math.floor(i / sequence.length * 100);
      if (pct < 35)      statusEl.textContent = "probing…";
      else if (pct < 70) statusEl.textContent = "loading modules…";
      else if (pct < 95) statusEl.textContent = "spawning daemons…";
      else               statusEl.textContent = "ready.";
      bootTimer = setTimeout(step, 110 + Math.random() * 70);
    })();
  }

  function startStream() {
    clearInterval(streamTimer);
    streamTimer = setInterval(() => {
      if (bootRunning) return;
      const q = DATA.quips[Math.floor(Math.random() * DATA.quips.length)];
      const isAcc = Math.random() < 0.15;
      const ts = (1000 + Math.random() * 9000).toFixed(3);
      appendLine(`[ ${ts}] ${q}`, isAcc ? "acc" : "mute");
    }, 5500 + Math.random() * 2500);
  }

  function pushRaw(text, cls) {
    appendLine(text, cls);
  }

  return { runBoot, pushRaw };
})();
