/* ─────────────────────────────────────────────────────
   palette.js — ⌘K command palette
   Fuzzy search across essays, projects, pages, actions.
───────────────────────────────────────────────────── */

const Palette = (() => {
  const overlay = document.getElementById("palette");
  const input   = document.getElementById("palette-input");
  const listEl  = document.getElementById("palette-list");
  const count   = document.getElementById("palette-count");

  let sel = 0;
  let filtered = [];

  function open() {
    overlay.classList.add("on");
    input.value = "";
    filtered = [...DATA.paletteItems];
    sel = 0;
    render();
    setTimeout(() => input.focus(), 40);
  }
  function close() {
    overlay.classList.remove("on");
  }
  function isOpen() {
    return overlay.classList.contains("on");
  }
  function toggle() { isOpen() ? close() : open(); }

  function render() {
    if (!filtered.length) {
      listEl.innerHTML = `<div class="p-empty">no matches — try a different word</div>`;
      count.textContent = "0";
      return;
    }
    const grouped = {};
    filtered.forEach((it, idx) => {
      (grouped[it.group] = grouped[it.group] || []).push({ it, idx });
    });
    let html = "";
    PALETTE_GROUPS.forEach(g => {
      if (!grouped[g]) return;
      html += `<div class="p-group">${g}</div>`;
      grouped[g].forEach(({ it, idx }) => {
        html += `
          <div class="p-row ${idx === sel ? 'sel' : ''}" data-i="${idx}" role="option" aria-selected="${idx === sel}">
            <div class="icon">${it.icon}</div>
            <div class="label">${it.label}</div>
            <div class="meta">${it.meta}</div>
          </div>`;
      });
    });
    listEl.innerHTML = html;
    count.textContent = filtered.length + " result" + (filtered.length === 1 ? "" : "s");
    listEl.querySelectorAll(".p-row").forEach(r => {
      r.addEventListener("mouseenter", () => { sel = +r.dataset.i; updateSel(); });
      r.addEventListener("click", () => selectItem());
    });
  }
  function updateSel() {
    listEl.querySelectorAll(".p-row").forEach(r => {
      const on = +r.dataset.i === sel;
      r.classList.toggle("sel", on);
      r.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  function selectItem() {
    const it = filtered[sel];
    close();
    if (!it) return;
    if (it.href.startsWith("#")) {
      const target = document.querySelector(it.href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.open(it.href, it.href.startsWith("mailto:") ? "_self" : "_blank");
    }
  }

  function filter(q) {
    q = (q || "").trim().toLowerCase();
    filtered = !q ? [...DATA.paletteItems] :
      DATA.paletteItems.filter(it =>
        (it.label + " " + it.group + " " + it.meta).toLowerCase().includes(q)
      );
    sel = 0;
    render();
  }

  /* ── Wire ─────────────────────────────────────── */
  input.addEventListener("input", e => filter(e.target.value));

  // Keyboard inside palette
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); updateSel(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); updateSel(); }
    else if (e.key === "Enter") { e.preventDefault(); selectItem(); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
  });

  // Click on overlay (outside palette) to dismiss
  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  return { open, close, toggle, isOpen };
})();
