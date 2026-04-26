# Ali — personal site

Terminal-hero personal site. Cosmos-as-OS metaphor on the left (boot + live
dmesg), interactive terminal as the hero, editorial content below.

## Structure

```
site/
├── index.html
├── css/
│   ├── tokens.css     — design tokens, reset, base typography
│   ├── layout.css     — page layout + components (sidebar, terminal, palette, below-fold)
│   └── effects.css    — ambient glow, scanlines, keyframes
└── js/
    ├── data.js        — ALL content (edit this file to update the site)
    ├── sidebar.js     — boot + dmesg stream engine
    ├── terminal.js    — command interpreter + prompt + chip-type animation
    ├── palette.js     — ⌘K fuzzy-search palette
    └── app.js         — init, keyboard, clock, scroll observers, below-fold
```

## Editing content

Almost everything you'd want to change lives in `js/data.js`:

- **Identity** — name, location, observing-since year
- **Contact** — update `mail`, `github`, `x`, `linkedin` with real handles
- **whoami** — the key-value table shown when someone runs `whoami`
- **projects**, **essays**, **beliefs** — lists rendered both in the terminal
  and below the fold
- **boot** — the kernel-style startup lines played in the sidebar on load
- **quips** — random dmesg messages streamed after boot
- **sectionMessages** — kernel messages logged when the reader scrolls into
  writing / projects / beliefs below the fold

The `paletteItems` array at the bottom is auto-built from essays + projects +
a few curated pages/actions. Edit the bottom block there if you want new
palette entries.

## Terminal commands

The hero terminal accepts:

```
whoami      — identity key-values
projects    — project list with blurbs
writing     — essay list
beliefs     — short manifesto + questions
contact     — contact links
ls          — directory-style listing
help        — command list
clear       — clear the terminal
```

Single-letter aliases: `w p r b c l ?`. Tab completes. ↑↓ scrolls history.
⌘L clears.

## Keyboard shortcuts (whole page)

```
⌘K  / /     open the command palette
W/P/R/B/C/L chip-type the matching command into the hero terminal
?           run help
esc         close palette / dismiss
```

## Serving locally

Just open `index.html` in a browser, or:

```
cd site && python3 -m http.server 8000
```

No build step. Vanilla HTML/CSS/JS.

## Deploying

Static files — deploy anywhere (Netlify, Vercel, GitHub Pages, Cloudflare
Pages, or a static file host). No backend required.

## Design notes

- **Accent** is `#ff8a3c` (saturated amber). Used sparingly: command names,
  the pulsing status dot, hover states on essays, the gradient line at the
  top of the terminal, the palette glow.
- **Typography**: Space Grotesk for display, Inter for body, JetBrains Mono
  for terminal chrome and metadata.
- **Base** is a cool-tinted near-black (`#09090d`). All hairline borders at
  `#1b1b24`.
- **Ambient glow** is a large soft radial at the top-right (`effects.css`).
  The **scanline texture** is a repeating gradient at 2% opacity.
