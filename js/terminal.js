/* ─────────────────────────────────────────────────────
   terminal.js — interactive command interpreter
   • Fixed-height terminal body; output scrolls within.
   • Chip clicks animate typing into the prompt, then execute.
   • Supports history (↑↓), tab-completion, ⌘L clear.
───────────────────────────────────────────────────── */

const Terminal = (() => {
  const body = document.getElementById("term-body");
  const card = document.getElementById("terminal");

  let input = null; // will be the <input> inside prompt row
  const history = [];
  let histIdx = -1;
  let typingLock = false;

  /* ── DOM helpers ────────────────────────────────── */
  function addLine(text, cls) {
    const d = document.createElement("div");
    d.className = "t-line " + (cls || "");
    d.textContent = text === "" ? " " : text;
    insertBeforePrompt(d);
    scrollBottom();
  }
  function addHTML(html, cls) {
    const d = document.createElement("div");
    d.className = "t-out " + (cls || "");
    d.innerHTML = html;
    insertBeforePrompt(d);
    scrollBottom();
  }
  function insertBeforePrompt(el) {
    const prompt = body.querySelector(".t-prompt");
    if (prompt) body.insertBefore(el, prompt);
    else body.appendChild(el);
  }
  function scrollBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function escapeHTML(s) {
    return s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  /* ── Prompt row (created once) ─────────────────── */
  function ensurePrompt() {
    let row = body.querySelector(".t-prompt");
    if (!row) {
      row = document.createElement("div");
      row.className = "t-prompt";
      row.innerHTML = `
        <span class="ps">ali<span class="tilde">@~ %</span></span>
        <input autocomplete="off" spellcheck="false" placeholder="type a command, or click a chip below" aria-label="terminal input" />
        <span class="caret" aria-hidden="true"></span>
      `;
      body.appendChild(row);
      input = row.querySelector("input");
      wireInput();
    } else {
      input = row.querySelector("input");
    }
    scrollBottom();
  }

  function wireInput() {
    input.addEventListener("keydown", (e) => {
      if (typingLock) return;
      if (e.key === "Enter") {
        e.preventDefault();
        const v = input.value;
        input.value = "";
        runCommand(v);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!history.length) return;
        histIdx = Math.min(history.length - 1, histIdx + 1);
        input.value = history[histIdx] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        histIdx = Math.max(-1, histIdx - 1);
        input.value = histIdx === -1 ? "" : history[histIdx] || "";
      } else if (e.key === "Tab") {
        e.preventDefault();
        const q = input.value.toLowerCase();
        const keys = Object.keys(COMMANDS).concat(Object.keys(ALIASES));
        const matches = keys.filter((c) => c.startsWith(q));
        if (matches.length === 1) input.value = matches[0];
        else if (matches.length > 1) addLine("  " + matches.join("  "), "mute");
      } else if (e.key.toLowerCase() === "l" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        COMMANDS.clear();
      }
    });
  }

  /* ── Commands ───────────────────────────────────── */
  const ALIASES = {
    w: "whoami",
    p: "projects",
    r: "writing",
    b: "beliefs",
    c: "contact",
    l: "ls",
    "?": "help",
  };

  const COMMANDS = {
    help() {
      addLine("commands:", "mute");
      addLine("  whoami   projects   writing   beliefs   contact", "fg");
      addLine("  ls       help       clear", "fg");
      addLine("", "");
      addLine("or press ⌘K / '/' to fuzzy-search everything.", "mute");
    },

    whoami() {
      addHTML(
        DATA.whoami
          .map(
            (r) =>
              `<div class="t-kv">
             <span class="k">${r.k}</span>
             <span class="v${r.acc ? " acc" : ""}">${r.v}</span>
           </div>`,
          )
          .join(""),
      );
    },

    projects() {
      const rows = DATA.projects
        .map(
          (p) => `
        <div class="row">
          <span class="slug">${p.slug}</span>
          <span class="q">${p.blurb}</span>
          <span class="yr">${p.year}</span>
        </div>`,
        )
        .join("");
      addHTML(`<div class="t-list">${rows}</div>`);
    },

    writing() {
      const rows = DATA.essays
        .map(
          (e) => `
        <div class="er">
          <span class="d">${e.date}</span>
          <span class="t">${e.title}</span>
          <span class="tg">#${e.tag}</span>
        </div>`,
        )
        .join("");
      addHTML(`<div class="t-essays">${rows}</div>`);
    },

    beliefs() {
      addLine("what I hold:", "mute");
      addHTML(
        `<ul class="t-bel">` +
          DATA.beliefs
            .map((b) => `<li><strong>${b.title}</strong> — ${b.body}</li>`)
            .join("") +
          `</ul>`,
      );
    },

    contact() {
      const c = DATA.contact;
      addHTML(`
        <div class="t-kv"><span class="k">mail</span><span class="v"><a href="mailto:${c.mail}">${c.mail}</a></span></div>
        <div class="t-kv"><span class="k">github</span><span class="v"><a href="https://${c.github}" target="_blank" rel="noopener">${c.github}</a></span></div>
        <div class="t-kv"><span class="k">gitlab</span><span class="v"><a href="https://${c.gitlab}" target="_blank" rel="noopener">${c.gitlab}</a></span></div>
        <div class="t-kv"><span class="k">x</span><span class="v"><a href="https://${c.x}" target="_blank" rel="noopener">${c.x}</a></span></div>
        <div class="t-kv"><span class="k">linkedin</span><span class="v"><a href="https://${c.linkedin}" target="_blank" rel="noopener">${c.linkedin}</a></span></div>
        <div class="t-kv"><span class="k">instagram</span><span class="v"><a href="https://${c.instagram}" target="_blank" rel="noopener">${c.instagram}</a></span></div>
      `);
      addLine(c.note, "mute");
    },

    ls() {
      addLine(`drwxr-xr-x   writing/     ${DATA.essays.length} essays`, "mute");
      addLine(
        `drwxr-xr-x   projects/    ${DATA.projects.length} entries`,
        "mute",
      );
      addLine("-rw-r--r--   whoami       identity", "mute");
      addLine("-rw-r--r--   beliefs      .plan", "mute");
      addLine("-rw-r--r--   contact      ~/.mail", "mute");
    },

    clear() {
      body.innerHTML = "";
      ensurePrompt();
      greet();
    },
  };

  /* ── Execute a command ──────────────────────────── */
  function runCommand(raw) {
    const cmd = (raw || "").trim();
    if (!cmd) {
      ensurePrompt();
      return;
    }

    const echo = document.createElement("div");
    echo.className = "t-line t-cmd-echo";
    echo.innerHTML = `<span class="ps">ali@~ %</span>${escapeHTML(cmd)}`;
    insertBeforePrompt(echo);

    const key = ALIASES[cmd.toLowerCase()] || cmd.toLowerCase();
    const fn = COMMANDS[key];
    if (fn) fn();
    else addLine(`command not found: ${cmd} · try 'help' or ⌘K`, "mute");
    addLine("", "");

    if (history[0] !== cmd) history.unshift(cmd);
    histIdx = -1;
    scrollBottom();
    input && input.focus({ preventScroll: true });
  }

  /* ── Chip → animated typing ─────────────────────── */
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function chipType(cmd, chipEl) {
    if (typingLock) return;
    typingLock = true;
    if (chipEl) chipEl.classList.add("pressed");
    input.focus({ preventScroll: true });
    input.value = "";
    const promptRow = body.querySelector(".t-prompt");
    promptRow.classList.add("busy");
    for (let i = 0; i < cmd.length; i++) {
      input.value += cmd[i];
      await sleep(50 + Math.random() * 40);
    }
    await sleep(180);
    promptRow.classList.remove("busy");
    runCommand(input.value);
    input.value = "";
    if (chipEl) setTimeout(() => chipEl.classList.remove("pressed"), 320);
    typingLock = false;
  }

  /* ── Greet ──────────────────────────────────────── */
  function greet() {
    addLine("welcome, visitor.", "mute");
    addLine("type 'help' or click a chip below. ⌘K for search.", "mute");
    addLine("", "");
  }

  /* ── Init ───────────────────────────────────────── */
  function init() {
    ensurePrompt();
    greet();

    // Clicking anywhere in the terminal card refocuses input + scrolls to bottom
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      if (input) {
        scrollBottom();
        input.focus();
      }
    });
  }

  /* ── Wire chips ─────────────────────────────────── */
  document.querySelectorAll(".chip").forEach((el) => {
    el.addEventListener("click", () => chipType(el.dataset.cmd, el));
  });

  return {
    init,
    chipType,
    isTyping: () => typingLock,
    clear: () => COMMANDS.clear(),
    rerunWhoami() {
      chipType("whoami", document.querySelector('.chip[data-cmd="whoami"]'));
    },
  };
})();
