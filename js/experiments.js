/* ─────────────────────────────────────────────────────
   experiments.js — runs each demo on experiments.html.

   Iterates over `.ex-stage[data-demo]`, instantiates the
   matching PhysicsDemos factory, builds sliders next to
   the stage, and animates each independently.
───────────────────────────────────────────────────── */

(function () {
  if (!window.PhysicsDemos || !window.PhysicsCanvas) return;
  const stages = document.querySelectorAll(".ex-stage[data-demo]");
  if (!stages.length) return;

  const instances = [];

  function setup() {
    stages.forEach((stage) => {
      const id = stage.dataset.demo;
      const demo = window.PhysicsDemos.create(id);
      if (!demo) return;

      const canvas = stage.querySelector("canvas");
      const article = stage.closest(".ex");
      const ctrlHost = article
        ? article.querySelector(".ex-controls")
        : stage.parentElement &&
          stage.parentElement.querySelector(".ex-controls");
      const readout = stage.querySelector(".ex-readout");
      const nameEl = readout && readout.querySelector(".r-name");
      const metaEl = readout && readout.querySelector(".r-meta");

      if (nameEl) nameEl.textContent = demo.name;
      if (metaEl) metaEl.textContent = demo.meta();

      const r = window.PhysicsCanvas.setup(canvas);
      let ctx = r.ctx,
        W = r.W,
        H = r.H;
      let state = {};
      demo.init(ctx, W, H, state);

      if (ctrlHost) {
        window.PhysicsCanvas.buildSliders(ctrlHost, demo, (key) => {
          if (
            (id === "golden" && key === "count") ||
            (id === "lissajous" && (key === "aFreq" || key === "bFreq"))
          ) {
            state = {};
            demo.init(ctx, W, H, state);
          }
          if (metaEl) metaEl.textContent = demo.meta();
        });
      }

      instances.push({
        demo,
        canvas,
        getCtx: () => ctx,
        getDims: () => ({ W, H }),
        state,
        metaEl,
        resize() {
          const r = window.PhysicsCanvas.setup(canvas);
          ctx = r.ctx;
          W = r.W;
          H = r.H;
          state = {};
          demo.init(ctx, W, H, state);
          this.state = state;
        },
      });
    });
    requestAnimationFrame(loop);
  }

  function loop() {
    requestAnimationFrame(loop);
    for (const inst of instances) {
      const { W, H } = inst.getDims();
      inst.demo.tick(inst.getCtx(), W, H, inst.state);
      if (inst.metaEl) inst.metaEl.textContent = inst.demo.meta();
    }
  }

  // Defer to next frame so flex layout has measured the canvases.
  requestAnimationFrame(setup);

  let resizeRaf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      instances.forEach((i) => i.resize());
    });
  });

  // Smooth scroll for in-page anchors (TOC links)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + id);
    });
  });
})();
