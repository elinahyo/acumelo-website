# Acumelo screen montage sources

Twelve silent, 15-second MP4s: six instructor tool montages and six illustrative project montages. Every demo has 12 scenes; every showcase has 24 distinct project concepts. All content is English-first.

## Deliverables

- `output/media-manifest.json` is the canonical integration manifest. All media paths are relative to its directory. Filenames include `v20261123` for cache-safe updates.
- Each MP4 uses H.264, yuv420p, 1280×720, 30fps, 450 frames and MP4 faststart.
- Each video has a JPEG poster, WebVTT captions, optional SRT, a detailed plain-text scene transcript, and a five-frame contact sheet.
- `output/validation-report.json` records complete video decoding, codec/dimensions/duration, frame motion, attachments and scene coverage.
- `./storyboard-coverage.json` contains all 216 scene definitions: 72 demo scenes and 144 project concepts. Its content includes synthetic tables, formulas, example code, semantic bullets, labels and stage names.

These are code-generated interface illustrations, not screen recordings of external applications or verified student submissions. Names such as Excel, n8n and Figma indicate relevant example stacks. Synthetic data and illustrative project labels remain visible in the videos. No paid media generation services were used.

## Rebuild

Use Node.js 22 or newer, pnpm 11 or newer, and a locally available FFmpeg with `libx264`.

```powershell
pnpm install --frozen-lockfile
$env:FFMPEG_PATH = 'C:/path/to/ffmpeg.exe'
pnpm render
pnpm validate
```

Alternatively install the pinned FFmpeg distribution with Python:

```powershell
python -m pip install --target vendor -r requirements.txt
$env:FFMPEG_PATH = (Get-ChildItem -LiteralPath vendor/imageio_ffmpeg/binaries -Filter 'ffmpeg*.exe').FullName
pnpm render
```

The package lock pins Canvas and native binaries. On the original Codex workstation the renderer can also use its bundled Canvas package. The local `vendor/`, `node_modules/`, logs and caches are excluded from source control; they are runtime dependencies, not deliverables. Arial/Consolas are registered from Windows when available, otherwise the Canvas runtime's sans-serif/monospace fonts are used.

Useful commands:

```powershell
node render.mjs --category workflow
node render.mjs --category design --kind showcase
node render.mjs --frames-only
node render.mjs --storyboard ./storyboard-coverage.json
```

`screens.mjs` implements 18 visual archetypes with category-aware variants: spreadsheets, slide decks, email, workflows, dashboards, code editors, chat, design boards, posters, kanban, landing pages, media/planning timelines, calendars, CRM, notebooks/audio sequencers, architecture/3D scenes, mobile screens and reports. Motion includes typing, row highlighting, graph builds, flowing connectors, Gantt playheads, dragged cards and cursor movement. No generated-person footage is included.

## Website integration

Use native video controls, `playsinline`, `preload="none"`, poster images and the matching WebVTT `<track kind="captions" srclang="en">`. Do not autoplay a grid of 12 videos. Preserve the illustrative label beside the player. For accessibility, link the text transcript and let the user pause/replay; 24 concepts in 15 seconds are intentionally a fast overview. Respect reduced-motion preferences and use a poster until the user requests playback.

The category mapping is many-to-many: instructor pages should reference these same category media records based on expertise, rather than copy videos or claim each instructor produced every example. Actual lecture footage is intentionally supplied separately.

## Published assets

The checked media set and integration manifest live in `../assets/media/20261123/`. Rendering produces a new local `output/` directory. Workstation-specific fallback paths have been replaced with the local `node_modules` directory; install dependencies or set `CODEX_NODE_PACKAGES` explicitly.
