/* ─────────────────────────────────────────────────────
   physics.js — interactive physics/math illustrations.

   Each demo is built by a factory (see PhysicsDemos.create)
   and is a self-contained object with its own params.
   The same demo can be instantiated multiple times on the
   same page; each instance has its own param state.

   Demo shape:
     { id, name, caption, params, paramSchema,
       meta(),                              → string
       init(ctx, W, H, state),               → reset
       tick(ctx, W, H, state) }              → one frame

   The index page uses a single rotating instance behind
   tabs; the experiments page uses five side-by-side.
───────────────────────────────────────────────────── */

(function () {
  /* ── Shared helpers ─────────────────────────────────── */
  const C_BG = "rgb(13, 13, 18)";
  const C_FADE = "rgba(13, 13, 18, 0.045)";
  const C_FADEHI = "rgba(13, 13, 18, 0.10)";
  const TPL = {
    amberSoft: "rgba(255, 179, 122, ALPHA)",
    amberDim: "rgba(255, 138, 60, ALPHA)",
    greenSoft: "rgba(168, 239, 170, ALPHA)",
    white: "rgba(242, 242, 238, ALPHA)",
  };
  const a = (template, alpha) => template.replace("ALPHA", alpha);
  const fillBg = (ctx, W, H) => {
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);
  };
  const fade = (ctx, W, H, lvl) => {
    ctx.fillStyle = lvl || C_FADE;
    ctx.fillRect(0, 0, W, H);
  };
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  /* ──────────────────────────────────────────────────────
     Factories — one per demo, each returns a fresh instance
     with its own closed-over params.
  ────────────────────────────────────────────────────── */

  function createHiggs() {
    const params = { tracks: 14, B: 0.022, energy: 1.4 };
    return {
      id: "higgs",
      name: "higgs collision",
      caption: "two protons walk into a bar · the bar acquires mass.",
      params,
      paramSchema: [
        {
          key: "tracks",
          label: "tracks (N)",
          min: 6,
          max: 28,
          step: 1,
          fmt: (v) => v.toFixed(0),
        },
        {
          key: "B",
          label: "magnetic field",
          min: 0.0,
          max: 0.05,
          step: 0.001,
          fmt: (v) => v.toFixed(3),
        },
        {
          key: "energy",
          label: "collision energy",
          min: 0.5,
          max: 2.4,
          step: 0.05,
          fmt: (v) => ((v * 13) / 1.4).toFixed(1) + " TeV",
        },
      ],
      meta() {
        return `√s ≈ ${((params.energy * 13) / 1.4).toFixed(1)} TeV · N=${params.tracks} · |B|=${params.B.toFixed(3)}`;
      },
      init(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.phase = "approach";
        s.beamP = 0;
        s.tracks = [];
        s.flashAge = -1;
        s.cycleAge = 0;
      },
      tick(ctx, W, H, s) {
        fade(ctx, W, H, C_FADEHI);
        const cx = W / 2,
          cy = H / 2,
          R = Math.min(W, H);
        ctx.strokeStyle = a(TPL.amberDim, 0.1);
        ctx.lineWidth = 0.7;
        [0.42, 0.3, 0.18].forEach((f) => {
          ctx.beginPath();
          ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
          ctx.stroke();
        });
        s.cycleAge++;

        if (s.phase === "approach") {
          s.beamP = Math.min(1, s.beamP + 0.045);
          ctx.strokeStyle = a(TPL.amberSoft, 0.85);
          ctx.lineWidth = 1.2;
          const gap = (1 - s.beamP) * (W * 0.45);
          ctx.beginPath();
          ctx.moveTo(0, cy);
          ctx.lineTo(cx - gap, cy);
          ctx.moveTo(W, cy);
          ctx.lineTo(cx + gap, cy);
          ctx.stroke();
          if (s.beamP >= 1) {
            s.phase = "flash";
            s.flashAge = 0;
            const N = Math.round(params.tracks);
            const E = params.energy;
            for (let i = 0; i < N; i++) {
              const θ = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
              const speed = (0.7 + Math.random() * 1.0) * E;
              const charge = i % 2 === 0 ? 1 : -1;
              s.tracks.push({
                x: cx,
                y: cy,
                vx: Math.cos(θ) * speed,
                vy: Math.sin(θ) * speed,
                charge,
                life: 0,
                maxLife: 110 + Math.random() * 60,
              });
            }
          }
        }

        if (s.flashAge >= 0) {
          const fa = s.flashAge++;
          const r = 4 + fa * 3;
          const al = Math.max(0, 1 - fa / 24);
          if (al > 0) {
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4);
            grad.addColorStop(0, `rgba(255,255,255,${0.95 * al})`);
            grad.addColorStop(0.4, `rgba(255,200,150,${0.5 * al})`);
            grad.addColorStop(1, "rgba(255,138,60,0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 4, 0, Math.PI * 2);
            ctx.fill();
          }
          if (fa > 28) s.flashAge = -2;
          if (s.phase === "flash") s.phase = "tracks";
        }

        if (s.tracks.length) {
          const B = params.B;
          s.tracks.forEach((t) => {
            if (t.life >= t.maxLife) return;
            const ω = B * t.charge * 60 * 0.016;
            const cs = Math.cos(ω),
              sn = Math.sin(ω);
            const newvx = t.vx * cs - t.vy * sn;
            const newvy = t.vx * sn + t.vy * cs;
            t.vx = newvx;
            t.vy = newvy;
            const lx = t.x,
              ly = t.y;
            t.x += t.vx;
            t.y += t.vy;
            t.life++;
            const al = Math.max(0, 1 - t.life / t.maxLife);
            const tpl = t.charge > 0 ? TPL.amberSoft : TPL.greenSoft;
            ctx.strokeStyle = a(tpl, (0.9 * al).toFixed(2));
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(t.x, t.y);
            ctx.stroke();
          });
        }

        if (s.phase === "tracks" && s.cycleAge > 240) {
          s.phase = "approach";
          s.beamP = 0;
          s.tracks = [];
          s.cycleAge = 0;
        }
      },
    };
  }

  function createLorenz() {
    const params = { sigma: 10, rho: 28, beta: 8 / 3 };
    return {
      id: "lorenz",
      name: "lorenz attractor",
      caption: "deterministic, but it doesn't feel that way.",
      params,
      paramSchema: [
        {
          key: "sigma",
          label: "σ (Prandtl)",
          min: 1,
          max: 20,
          step: 0.1,
          fmt: (v) => v.toFixed(1),
        },
        {
          key: "rho",
          label: "ρ (Rayleigh)",
          min: 0.1,
          max: 50,
          step: 0.1,
          fmt: (v) => v.toFixed(1),
        },
        {
          key: "beta",
          label: "β (geometry)",
          min: 0.5,
          max: 4,
          step: 0.05,
          fmt: (v) => v.toFixed(2),
        },
      ],
      meta() {
        return `σ=${params.sigma.toFixed(1)} · ρ=${params.rho.toFixed(1)} · β=${params.beta.toFixed(2)}`;
      },
      init(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.x = 0.1;
        s.y = 0;
        s.z = 0;
        s.lastPx = null;
        s.lastPy = null;
      },
      tick(ctx, W, H, s) {
        ctx.fillStyle = "rgba(13, 13, 18, 0.012)";
        ctx.fillRect(0, 0, W, H);
        const σ = params.sigma,
          ρ = params.rho,
          β = params.beta;
        const dt = 0.0065;
        const cx = W / 2,
          cy = H / 2;
        const sX = (W - 36) / 44;
        const sZ = (H * 0.78) / 50;
        const zMid = 25;
        ctx.lineWidth = 0.85;
        for (let i = 0; i < 7; i++) {
          const dx = σ * (s.y - s.x);
          const dy = s.x * (ρ - s.z) - s.y;
          const dz = s.x * s.y - β * s.z;
          s.x += dx * dt;
          s.y += dy * dt;
          s.z += dz * dt;
          const px = cx + s.x * sX;
          const py = cy - (s.z - zMid) * sZ;
          if (s.lastPx !== null) {
            const tpl = s.x > 0 ? TPL.amberSoft : TPL.greenSoft;
            ctx.strokeStyle = a(tpl, 0.55);
            ctx.beginPath();
            ctx.moveTo(s.lastPx, s.lastPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
          s.lastPx = px;
          s.lastPy = py;
        }
      },
    };
  }

  function createGolden() {
    const params = { count: 8, growth: 1.61803 };
    return {
      id: "golden",
      name: "golden spiral",
      caption: "the universe's favorite ratio · also nature's favorite cliché.",
      params,
      paramSchema: [
        {
          key: "count",
          label: "fibonacci squares",
          min: 4,
          max: 10,
          step: 1,
          fmt: (v) => v.toFixed(0),
        },
        {
          key: "growth",
          label: "growth factor",
          min: 1.2,
          max: 2.4,
          step: 0.01,
          fmt: (v) => v.toFixed(3),
        },
      ],
      meta() {
        return `n=${params.count} · φ ≈ ${params.growth.toFixed(3)}`;
      },
      init(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.t = 0;
        const F = [1, 1];
        for (let i = 2; i < params.count; i++) F.push(F[i - 1] + F[i - 2]);
        const tiles = [];
        let bx = 0,
          by = 0,
          bw = 0,
          bh = 0;
        for (let i = 0; i < F.length; i++) {
          const f = F[i];
          let x, y;
          const dir = i % 4;
          if (i === 0) {
            x = 0;
            y = 0;
            bw = f;
            bh = f;
            tiles.push({ x, y, f });
            continue;
          }
          if (dir === 1) {
            x = bx + bw;
            y = by;
            bw += f;
            bh = Math.max(bh, f);
          } else if (dir === 2) {
            x = bx;
            y = by + bh;
            bw = Math.max(bw, f);
            bh += f;
          } else if (dir === 3) {
            x = bx - f;
            y = by;
            bx -= f;
            bw += f;
            bh = Math.max(bh, f);
          } else {
            x = bx;
            y = by - f;
            by -= f;
            bh += f;
            bw = Math.max(bw, f);
          }
          tiles.push({ x, y, f });
        }
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        tiles.forEach((t) => {
          if (t.x < minX) minX = t.x;
          if (t.y < minY) minY = t.y;
          if (t.x + t.f > maxX) maxX = t.x + t.f;
          if (t.y + t.f > maxY) maxY = t.y + t.f;
        });
        const tw = maxX - minX,
          th = maxY - minY;
        const pad = 22;
        const scale = Math.min((W - pad * 2) / tw, (H - pad * 2) / th);
        s.tiles = tiles;
        s.scale = scale;
        s.ox = (W - tw * scale) / 2 - minX * scale;
        s.oy = (H - th * scale) / 2 - minY * scale;
      },
      tick(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.t += 1;
        const totalFrames = 320;
        const reveal = Math.min(s.t / totalFrames, 1.4);
        ctx.lineWidth = 1;
        for (let i = 0; i < s.tiles.length; i++) {
          const t = s.tiles[i];
          const start = (i / s.tiles.length) * 0.65;
          const end = start + 0.12;
          const op = clamp((reveal - start) / (end - start), 0, 1);
          if (op <= 0) continue;
          const x = s.ox + t.x * s.scale;
          const y = s.oy + t.y * s.scale;
          const sd = t.f * s.scale;
          ctx.strokeStyle = a(TPL.amberDim, (0.45 * op).toFixed(2));
          ctx.strokeRect(x, y, sd, sd);
          ctx.fillStyle = a(TPL.white, (0.4 * op).toFixed(2));
          ctx.font = "9px ui-monospace, monospace";
          ctx.fillText(String(t.f), x + 4, y + 12);
        }
        const spiralStart = 0.5;
        const spiralReveal = clamp(
          (reveal - spiralStart) / (1 - spiralStart),
          0,
          1,
        );
        if (spiralReveal > 0) {
          const φ = params.growth;
          const b = Math.log(φ) / (Math.PI / 2);
          const t0 = s.tiles[0];
          const cx = s.ox + (t0.x + t0.f) * s.scale;
          const cy = s.oy + (t0.y + t0.f) * s.scale;
          const a0 = 0.5 * s.scale;
          const θMax = 5 * Math.PI;
          const θEnd = θMax * spiralReveal;
          ctx.strokeStyle = a(TPL.amberSoft, 0.85);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let θ = 0; θ <= θEnd; θ += 0.05) {
            const r = a0 * Math.exp(b * θ);
            const px = cx - r * Math.cos(θ);
            const py = cy - r * Math.sin(θ);
            if (θ === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      },
    };
  }

  function createGabriel() {
    const params = { xMax: 28, rings: 13 };
    return {
      id: "gabriel",
      name: "gabriel's horn",
      caption: "finite volume · infinite paint to coat the inside.",
      params,
      paramSchema: [
        {
          key: "xMax",
          label: "x-axis range",
          min: 8,
          max: 60,
          step: 1,
          fmt: (v) => "[1, " + v.toFixed(0) + "]",
        },
        {
          key: "rings",
          label: "cross-sections (n)",
          min: 4,
          max: 24,
          step: 1,
          fmt: (v) => v.toFixed(0),
        },
      ],
      meta() {
        return `∫₁^${params.xMax.toFixed(0)} π/x² dx · n=${params.rings.toFixed(0)}`;
      },
      init(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.t = 0;
      },
      tick(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.t += 1;
        const cy = H / 2;
        const xMin = 1,
          xMax = params.xMax;
        const padL = 32,
          padR = 22;
        const xToPx = (x) =>
          padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
        const yScale = H / 2 - 22;
        const reveal = clamp(s.t / 260, 0, 1);
        const xEnd = xMin + reveal * (xMax - xMin);

        ctx.strokeStyle = a(TPL.white, 0.06);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(padL, cy);
        ctx.lineTo(W - padR, cy);
        ctx.stroke();

        const ringCount = Math.round(params.rings);
        ctx.strokeStyle = a(TPL.amberDim, 0.45);
        ctx.lineWidth = 1.0;
        for (let i = 0; i < ringCount; i++) {
          const t = i / (ringCount - 1);
          const x = xMin * Math.pow(xMax / xMin, t);
          if (x > xEnd) break;
          const r = 1 / x;
          const px = xToPx(x);
          const ry = r * yScale;
          const rx = Math.max(1.2, ry * 0.18);
          ctx.beginPath();
          ctx.ellipse(px, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.strokeStyle = a(TPL.amberSoft, 0.92);
        ctx.lineWidth = 1.4;
        for (const sign of [1, -1]) {
          ctx.beginPath();
          let started = false;
          const dx = (xMax - xMin) / 600;
          for (let x = xMin; x <= xEnd; x += dx) {
            const px = xToPx(x);
            const py = cy - sign * (1 / x) * yScale;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        ctx.fillStyle = a(TPL.white, 0.5);
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText("1", padL - 6, cy + 14);
        ctx.fillText("∞", W - padR - 8, cy + 14);
      },
    };
  }

  function createLissajous() {
    const params = { aFreq: 3, bFreq: 5, drift: 0.012 };
    return {
      id: "lissajous",
      name: "lissajous figure",
      caption:
        "two sine waves · perpendicular · what they trace is none of their business.",
      params,
      paramSchema: [
        {
          key: "aFreq",
          label: "a (x-frequency)",
          min: 1,
          max: 9,
          step: 1,
          fmt: (v) => v.toFixed(0),
        },
        {
          key: "bFreq",
          label: "b (y-frequency)",
          min: 1,
          max: 9,
          step: 1,
          fmt: (v) => v.toFixed(0),
        },
        {
          key: "drift",
          label: "phase drift",
          min: 0,
          max: 0.04,
          step: 0.001,
          fmt: (v) => v.toFixed(3),
        },
      ],
      meta() {
        return `a:b = ${params.aFreq}:${params.bFreq} · δ̇ = ${params.drift.toFixed(3)}`;
      },
      init(ctx, W, H, s) {
        fillBg(ctx, W, H);
        s.t = 0;
        s.points = [];
      },
      tick(ctx, W, H, s) {
        ctx.fillStyle = "rgba(13, 13, 18, 0.06)";
        ctx.fillRect(0, 0, W, H);
        s.t += 0.04;
        const A = (W - 50) / 2;
        const B = (H - 40) / 2;
        const a1 = params.aFreq,
          b1 = params.bFreq;
        const δ = s.t * params.drift;
        const cx = W / 2,
          cy = H / 2;
        for (let i = 0; i < 14; i++) {
          const tt = s.t + i * 0.018;
          const x = cx + A * Math.sin(a1 * tt + δ);
          const y = cy + B * Math.sin(b1 * tt);
          s.points.push({ x, y, life: 0 });
        }
        for (const p of s.points) p.life++;
        while (s.points.length && s.points[0].life > 110) s.points.shift();
        ctx.lineWidth = 1.2;
        for (let i = 1; i < s.points.length; i++) {
          const p0 = s.points[i - 1],
            p1 = s.points[i];
          const al = Math.max(0, 1 - p1.life / 110);
          ctx.strokeStyle = a(TPL.amberSoft, (0.75 * al).toFixed(2));
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      },
    };
  }

  /* ── Registry ──────────────────────────────────────── */
  const factories = {
    higgs: createHiggs,
    lorenz: createLorenz,
    golden: createGolden,
    gabriel: createGabriel,
    lissajous: createLissajous,
  };
  const order = ["higgs", "lorenz", "golden", "gabriel", "lissajous"];

  window.PhysicsDemos = {
    ids: order,
    create(id) {
      return factories[id] && factories[id]();
    },
  };

  /* ── Shared helpers exposed for page consumers ───── */
  window.PhysicsCanvas = {
    setup(canvas) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      const W = Math.floor(r.width);
      const H = Math.floor(r.height);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, W, H };
    },
    buildSliders(host, demo, onChange) {
      host.innerHTML = "";
      if (!demo.paramSchema) return;
      demo.paramSchema.forEach((spec) => {
        const wrap = document.createElement("label");
        wrap.className = "exp-control";
        const label = document.createElement("span");
        label.className = "exp-control-label";
        label.textContent = spec.label;
        const val = document.createElement("span");
        val.className = "exp-control-val";
        val.textContent = spec.fmt(demo.params[spec.key]);
        const range = document.createElement("input");
        range.type = "range";
        range.className = "exp-control-slider";
        range.min = spec.min;
        range.max = spec.max;
        range.step = spec.step;
        range.value = demo.params[spec.key];
        const sync = () => {
          const p = (range.value - spec.min) / (spec.max - spec.min);
          range.style.setProperty("--p", clamp(p, 0, 1).toFixed(3));
        };
        sync();
        range.addEventListener("input", () => {
          const v = parseFloat(range.value);
          demo.params[spec.key] = v;
          val.textContent = spec.fmt(v);
          sync();
          onChange && onChange(spec.key, v);
        });
        wrap.appendChild(label);
        wrap.appendChild(val);
        wrap.appendChild(range);
        host.appendChild(wrap);
      });
    },
  };

  /* ──────────────────────────────────────────────────────
     INDEX-PAGE INIT — runs only if the index "Experiments"
     section is present. Single canvas, tab-based switching.
  ────────────────────────────────────────────────────── */
  function initIndexSection() {
    const root = document.getElementById("experiments");
    const canvas = document.getElementById("exp-canvas");
    const tabsEl = document.getElementById("exp-tabs");
    const ctrlsEl = document.getElementById("exp-controls");
    const nameEl = document.getElementById("exp-name");
    const metaEl = document.getElementById("exp-meta");
    const capEl = document.getElementById("exp-cap");
    const moreEl = document.getElementById("exp-more");
    if (!root || !canvas || !tabsEl) return;

    // Pre-create all demos so switching tabs preserves param state.
    const demos = Object.fromEntries(order.map((id) => [id, factories[id]()]));
    let active = null;
    let state = {};
    let canvasCtx = null,
      W = 0,
      H = 0;

    function buildTabs() {
      tabsEl.innerHTML = "";
      order.forEach((id) => {
        const d = demos[id];
        const btn = document.createElement("button");
        btn.className = "exp-tab";
        btn.type = "button";
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", "false");
        btn.dataset.demo = id;
        btn.textContent = d.name;
        btn.addEventListener("click", () => setDemo(id));
        tabsEl.appendChild(btn);
      });
    }

    function setDemo(id) {
      const d = demos[id];
      if (!d) return;
      active = d;
      state = {};
      Array.from(tabsEl.children).forEach((c) =>
        c.setAttribute(
          "aria-selected",
          c.dataset.demo === id ? "true" : "false",
        ),
      );
      nameEl.textContent = d.name;
      capEl.textContent = d.caption;
      moreEl.href = `simulations/${id}.html`;

      // Sliders are intentionally absent on the index — controls live on
      // experiments.html. The section here is a quiet preview.
      if (ctrlsEl) {
        window.PhysicsCanvas.buildSliders(ctrlsEl, d, (key) => {
          if (
            (id === "golden" && key === "count") ||
            (id === "lissajous" && (key === "aFreq" || key === "bFreq"))
          ) {
            state = {};
            d.init(canvasCtx, W, H, state);
          }
          metaEl.textContent = d.meta();
        });
      }

      const r = window.PhysicsCanvas.setup(canvas);
      canvasCtx = r.ctx;
      W = r.W;
      H = r.H;
      d.init(canvasCtx, W, H, state);
      metaEl.textContent = d.meta();

      try {
        const ts = (8000 + Math.random() * 999).toFixed(3);
        window.Sidebar &&
          Sidebar.pushRaw(`[ ${ts}] physics: loaded ${d.name}`, "acc");
      } catch (_) {}
    }

    function loop() {
      requestAnimationFrame(loop);
      if (!active || !canvasCtx) return;
      active.tick(canvasCtx, W, H, state);
      metaEl.textContent = active.meta();
    }

    function start() {
      buildTabs();
      setDemo("higgs");
      requestAnimationFrame(loop);
      window.addEventListener("resize", () => {
        if (!active) return;
        const r = window.PhysicsCanvas.setup(canvas);
        canvasCtx = r.ctx;
        W = r.W;
        H = r.H;
        state = {};
        active.init(canvasCtx, W, H, state);
      });
    }
    requestAnimationFrame(start);
  }

  initIndexSection();
})();
