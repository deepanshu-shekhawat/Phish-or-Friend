# FRIEND OR PHISH? — CyberDesk

A Win95/98-style retro desktop (16-bit pixel art) for a phishing-awareness game. React 18 + Vite. All sites, people, links and files are fictional (`.example` domains); nothing is scanned, stored or sent.

## Run
```
npm install
npm run dev        # demo entry: src/main.jsx
npm run build && npx vite preview --port 4173
```

## Embed in the existing site
```jsx
import CyberDesk from './cyberdesk';
<CyberDesk onExit={() => /* return to site */} assetBase="/assets/cyberdesk/" />
```
`assetBase` overrides where assets are fetched from (default `./assets/cyberdesk/`). CyberDesk replaces the old scenario section only.

## Layout
- `public/assets/cyberdesk/` — all art, audio, fonts, data JSON, `manifest.json`
- `src/cyberdesk/` — `engine/` (store, scenario, scoring, audio), `os/` (shell), `apps/`, `styles/`
- `tools/` — generators (`build_assets.py`, `build_audio.py`, `build_manifest.py`) and Playwright tests (`tools/e2e`)
- `docs/` — `ASSET_MANIFEST.md`, `preview/contact-sheet.png`, `ASSET_PLAN.md`, `REPORT.md`

## Regenerate assets
```
python3 tools/build_assets.py && python3 tools/build_audio.py && python3 tools/build_assets.py && python3 tools/build_manifest.py
```
(Needs Pillow, numpy, scipy, ffmpeg; fonts come from `@fontsource/*` in node_modules.)

## Tests
Start `vite preview` on :4173, then `node tools/e2e/{smoke,flow,sweep,sweep2,interact}.mjs` (Playwright-core + Chromium). All pass with 0 console/page errors.

## Accessibility
Reduced motion (system or Settings), high contrast, touch mode, keyboard navigation, `:focus-visible`, mutable audio.
