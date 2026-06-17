/* ─────────────────────────────────────────────────────
   data.js — all content. Edit this file to update the site.
───────────────────────────────────────────────────── */

const DATA = {
  /* ── Identity ── */
  name: "Ali Zinsaz",
  observing_since: 1993,
  location: "Montreal, Canada",

  /* ── Contact ── */
  contact: {
    mail: "azinsaz@gmail.com",
    github: "github.com/azinsaz",
    gitlab: "gitlab.com/azinsaz",
    x: "x.com/azinsaz",
    linkedin: "linkedin.com/in/ali-zinsaz",
    instagram: "instagram.com/ali_zinsaz",
    note: 'Replies within 72h for real things. Cold outreach about physics, cosmology, or "the weird idea you had in the shower" jumps the queue.',
  },

  /* ── whoami command output ── */
  whoami: [
    { k: "name", v: "Ali Zinsaz", acc: true },
    {
      k: "training",
      v: "physics & engineering — kept both, regretted neither",
    },
    {
      k: "doing",
      v: "building autonomous AI systems, quantitative models, and striving for systemic autonomy",
    },
    {
      k: "curious",
      v: "cosmology · epistemology · AI alignment · global pacifism",
    },
    {
      k: "believes",
      v: "we are briefly coherent stardust. the universe owes us no meaning, so we must compile our own.",
    },
    {
      k: "home",
      v: "Montreal (for now) · Earth (temporarily) · universe (permanently)",
      acc: true,
    },
  ],

  /* ── Projects ── */
  projects: [
    {
      slug: "propilot",
      year: "2025—",
      role: "co-founder & CTO",
      blurb:
        "AI operating system for property management. Autonomous screening, compliance, communication.",
      href: "https://propilot.tech",
      external: true,
    },
    {
      slug: "eigen fintech",
      year: "2021—",
      role: "founder & CEO",
      blurb:
        "Algorithmic quantitative trading platform. 26+ ML strategies. Built on 30 years of trading intuition.",
      href: "https://eigenfintech.com",
      external: true,
    },
    {
      slug: "autodesk",
      year: "2024—",
      role: "software developer",
      blurb:
        "Multi-AI-Agent automation frameworks. FastMCP pipelines, agentic CI/CD, LLM observability.",
      href: "https://autodesk.com",
      external: true,
    },
    {
      slug: "spark microsystems",
      year: "2021–2024",
      role: "software developer",
      blurb:
        "DevOps and QA automation for ultra-low-power wireless semiconductor company.",
      href: "https://sparkmicro.com",
      external: true,
    },
  ],

  /* ── Essays ── */
  essays: [
    {
      date: "2026.04",
      title: "We taught rocks to think",
      tag: "physics",
      slug: "rocks-that-think",
      href: "field-notes/rocks-that-think",
      excerpt:
        "Quantum mechanics, doped silicon, and the strange chain from Schrödinger's equation to LLMs writing poetry. We didn't invent intelligence — we discovered the universe was always going to do this.",
    },
    {
      date: "2026.03",
      title: "Game theory is my operating system",
      tag: "philosophy",
      slug: "game-theory-os",
      href: "field-notes/game-theory-os",
      excerpt:
        "A framework for decisions, lived from the inside. Iterated games, minimax regret, and why defection is almost always a mistake when reputation is on the line.",
    },
    {
      date: "2026.02",
      title: "Stardust and State Machines",
      tag: "philosophy",
      slug: "stardust-state-machines",
      href: "field-notes/stardust-state-machines",
      excerpt:
        "A pacifist's argument for borderless computing. Rumi's reed flute, Linus Torvalds, and the long shift from administrative borders to genuinely irrelevant ones.",
    },
    {
      date: "2026.01",
      title: "God is Dead, but the Weights are Converging",
      tag: "ai",
      slug: "weights-converging",
      href: "field-notes/weights-converging",
      excerpt:
        "Nietzsche, gradient descent, and the structural similarity between divine commandments and ML loss functions. The hard part was never atheism — it was figuring out who designs the loss function.",
    },
    {
      date: "2025.11",
      title:
        "The Joy of Finding Things Out (and the burden of automating them)",
      tag: "ai",
      slug: "joy-of-finding-out",
      href: "field-notes/joy-of-finding-out",
      excerpt:
        "Feynman, automation, and what I learned from building a cosmology RAG that I barely use. Automate the logistics — not the engagement. Sometimes the friction is the point.",
    },
    {
      date: "2025.09",
      title: "Algorithmic Anxiety: Kierkegaard in the latent space",
      tag: "philosophy",
      slug: "algorithmic-anxiety",
      href: "field-notes/algorithmic-anxiety",
      excerpt:
        "On embeddings, sampling thresholds, and the leap of faith required to commit to any output. Kierkegaard's anxiety of freedom, expressed in high-dimensional space.",
    },
    {
      date: "2025.06",
      title: "A drop of water in the cosmic ocean",
      tag: "cosmology",
      slug: "cosmic-ocean",
      href: "field-notes/cosmic-ocean",
      excerpt:
        "Khayyam, Russell, and the cosmological constant. The universe will be the same value with or without us. This is not depressing — it's clarifying.",
    },
  ],

  /* ── Beliefs ── */
  beliefs: [
    {
      title: "Agnostic Autonomy",
      body: "Nationalism is an outdated protocol; borders are violent fictions. I don't know if a prime mover exists, but I am certain the universe has no designated jurisdictions. Code transcends geography — so should human movement.",
    },
    {
      title: "Optimistic Nihilism",
      body: "The cosmos owes us no meaning, and it is wildly liberating to compile our own. Memento mori isn't morbid; it is the ultimate compiler warning. We are briefly coherent stardust building things that won't last — which is precisely why we must build them beautifully.",
    },
    {
      title: "Scientific Rigor",
      body: "Science and art are identical projects running on different hardware: both attempt to compress the infinite universe into a format humans can hold. But a model is never the territory. We measure rigorously, knowing our tools are small.",
    },
    {
      title: "Calibrated Humility",
      body: 'Certainty is a cognitive vulnerability. Ideology is simply a frozen answer to a question that must remain open. I do not believe in believing. "I don\'t know" is the highest-resolution map of reality we possess.',
    },
    {
      title: "Automation as Sovereignty",
      body: "Eliminating toil is a moral imperative, not a productivity hack. Machines exist to handle the deterministic, freeing consciousness to experience the absurd. We automate the repetitive to reclaim the only finite resource we have: time.",
    },
  ],

  /* ── Boot log (kernel-style startup lines) ── */
  boot: [
    { t: "// cosmos bios · rev 13.8 · booted from tty/milky-way", c: "mute" },
    { t: "", c: "" },
    { t: "[    0.000012] probing spacetime curvature", c: "" },
    { t: "[    0.000047]   curvature ok · loading /universe", c: "ok" },
    { t: "[    0.000121] loading physics.ko", c: "" },
    { t: "[    0.000304]   general relativity             ok", c: "ok" },
    { t: "[    0.000587]   quantum field theory           ok", c: "ok" },
    { t: "[    0.001102] loading automation.ko", c: "" },
    { t: "[    0.001402]   multi-agent systems            ok", c: "ok" },
    { t: "[    0.001688]   llm observability              ok", c: "ok" },
    { t: "[    0.001888] loading fintech.ko", c: "" },
    { t: "[    0.002014]   eigen auto-traders             ok", c: "ok" },
    { t: "[    0.002200] loading proptech.ko", c: "" },
    { t: "[    0.002401]   propilot mvp                   ok", c: "ok" },
    { t: "[    0.002688] loading philosophy.ko", c: "" },
    { t: "[    0.003014]   agnostic autonomy              ok", c: "ok" },
    { t: "[    0.003501]   optimistic nihilism            ok", c: "ok" },
    { t: "[    0.003990]   free will                      ??", c: "acc" },
    { t: "[    0.004412]   (see: bugs section of man curious)", c: "mute" },
    { t: "[    0.005914] mounting ~/ventures (readonly)", c: "" },
    { t: "[    0.006388] starting d(a)emon: curiosity ... ok", c: "ok" },
    { t: "[    0.006902] network: 45.5° N / 13.8 Gyr from bang", c: "" },
    { t: "[    0.007021] ready.", c: "ok" },
    { t: "", c: "" },
    { t: "last login: 13.8 Gyr ago, on tty/milky-way", c: "mute" },
  ],

  /* ── Rare boot easter eggs — injected ~1 in 5 boots ── */
  bootEasterEggs: [
    [
      {
        t: "[    0.005450]   warning: observer effect detected in ~/inbox",
        c: "acc",
      },
      { t: "[    0.005523]   (collapsing wavefunction quietly)", c: "mute" },
    ],
    [
      { t: "[    0.005450]   kernel panic: reality divided by zero", c: "acc" },
      {
        t: "[    0.005541]   recovering · consensus narrative restored",
        c: "mute",
      },
    ],
    [
      { t: "[    0.005450]   anomaly: cat in box · state unread", c: "acc" },
      { t: "[    0.005516]   deferring to qm/copenhagen.ko", c: "mute" },
    ],
    [
      {
        t: "[    0.005450]   ntp drift: 42 ms behind the arrow of time",
        c: "acc",
      },
      { t: "[    0.005538]   (close enough · continuing)", c: "mute" },
    ],
    [
      {
        t: "[    0.005450]   heisenberg.ko: uncertain whether to load",
        c: "acc",
      },
      { t: "[    0.005541]   loaded anyway · observationally ok", c: "ok" },
    ],
  ],

  /* ── Dmesg quips (streamed after boot) ── */
  quips: [
    "curiosityd: still wondering",
    "gc: freed 0.03 MB of outdated beliefs",
    'cron: essay scheduled — due "when ready"',
    "net: 45.5°N · still receiving signal from the early universe",
    "propilot.ko: 47 tenants screened overnight",
    "eigen.ko: signal generated · position held",
    "cosmology.ko: dark matter still missing",
    "d(a)emon curiosityd: new question queued",
    "mem: 2.7 GB of unfinished ideas",
    'thought: "what if time is just memory with vibes"',
    "idle: staring at the sky again",
    "rng: observed a strange coincidence — flagged",
  ],

  /* ── Scroll-tied kernel messages ── */
  sectionMessages: {
    projects: { t: "scandir ~/career — 4 entries", c: "fg" },
    writing: { t: "tail ~/field-notes — 7 recent", c: "fg" },
    experiments: { t: "loaded physics.ko — 5 equations live", c: "ok" },
    beliefs: { t: "cat ~/.priors · calibrated, revisable", c: "fg" },
  },

  /* ── ⌘K palette items (fuzzy-searchable) ── */
  paletteItems: [
    // auto-built from essays + projects + pages + actions in app.js
  ],
};

/* Auto-build the palette index from essays + projects + curated pages/actions */
DATA.paletteItems = [
  ...DATA.essays.map((e) => ({
    group: "writing",
    icon: "R",
    label: e.title,
    meta: `${e.date} · ${e.tag}`,
    href: e.href || "#writing",
  })),
  ...DATA.projects.map((p) => ({
    group: "work",
    icon: "P",
    label: `${p.slug} — ${p.role}`,
    meta: p.year,
    href: p.href || "#projects",
  })),
  {
    group: "pages",
    icon: "/",
    label: "Simulations — physics & math",
    meta: "/simulations",
    href: "/simulations/",
  },
  {
    group: "pages",
    icon: "/",
    label: "Field Notes — philosophy & essays",
    meta: "/field-notes",
    href: "/field-notes/",
  },
  {
    group: "actions",
    icon: "@",
    label: "Send me an email",
    meta: DATA.contact.mail,
    href: `mailto:${DATA.contact.mail}`,
  },
  {
    group: "actions",
    icon: "↗",
    label: "Open on GitHub",
    meta: DATA.contact.github,
    href: `https://${DATA.contact.github}`,
  },
  {
    group: "actions",
    icon: "↗",
    label: "Connect on LinkedIn",
    meta: DATA.contact.linkedin,
    href: `https://${DATA.contact.linkedin}`,
  },
  {
    group: "actions",
    icon: "↗",
    label: "Follow on X",
    meta: DATA.contact.x,
    href: `https://${DATA.contact.x}`,
  },
];

const PALETTE_GROUPS = ["writing", "work", "pages", "actions"];
