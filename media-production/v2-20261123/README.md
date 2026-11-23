# Acumelo framework films — revision 2026-11-23b

This production replaces the previous shared-window montage with 11 individually planned instructor films, 6 field demonstrations and 6 finished-project montages. Every film is 15 seconds, 1280 × 720, 30 fps, silent H.264/yuv420p with faststart.

The 11 instructor films contain 12 chapters each. Each of the 6 student montages contains 24 finished-output concepts: reports, service interfaces, motion pieces, product campaigns, architectural visuals and interactive-world artwork. A chapter viewer makes the fast montage inspectable.

## What the films represent

These are original animated workflow reconstructions and generated project concepts. They are not recordings of live application sessions, verified student submissions or evidence of instructor credentials. The user explicitly selected a reconstructed-screen approach. The student films show the form of a finished or deployed output, without claiming that the depicted services are live products.

Official Adobe, Maxon, Unity and Epic documentation informed broad workspace layouts. All interface drawing and animation code is original. No third-party video was copied. Exact software-version parity is not claimed. Framework names identify teaching topics and do not imply endorsement.

Seven original key artworks were generated with the built-in image tool. Prompts and relative paths are in `assets/image-provenance.json`. No Higgsfield credits were spent. Higgsfield scenes illustrate shot planning and reference continuity; they do not claim that a Higgsfield generation was run.

Four procedural studies were authored and rendered in Blender 4.5 Cycles. Their native project files and frame sequences are under `assets/blender/`. The optional After Effects, Cinema 4D and Unity source examples under `native/` are authoring references, not verified native captures. They are not required for video playback.

## Reproduce

Use Node 24.22.3 and pnpm 9 or newer (lockfile format 9). Run these commands inside this directory. Install FFmpeg on PATH or set `FFMPEG_PATH` to its executable. Windows fonts are found through `WINDIR`; Linux uses installed Liberation fonts. For exact typography set `ACUMELO_FONT_REGULAR`, `ACUMELO_FONT_BOLD` and `ACUMELO_FONT_MONO` to licensed font files. Fallback fonts and different FFmpeg versions can change output hashes; archive the originals for exact recovery. This portability update has syntax checks only; it has not rerendered the historical films or started a Linux container.

```sh
pnpm install --frozen-lockfile
npm run proof
npm run render
npm run validate
```

`node render.mjs --only pillow` renders one instructor. `--only design` renders both design-field films. Independent processes may use `--shard 0/2` and `--shard 1/2` to divide the workload.

`blueprint.mjs` is the content source. `visuals.mjs` draws distinct editor and finished-output layouts. `render.mjs` assembles frames and writes MP4, VTT, poster and transcript files. `validate.mjs` decodes every video, verifies timing/codecs/captions, checks the exact instructor mapping, and confirms the requested tool coverage.

## Publish

Publish `output/` as a self-contained media review collection. `output/index.html` reads the manifest and provides a single-player gallery with chapter seeking. The main website should use each instructor's `instructorId` and unique `id`, and field films should use their `category` and `kind`. The teaching fields are many-to-many; do not infer a one-instructor-per-field relationship. Human lecture footage stays empty for the user to supply.

Public media filenames contain revision `v20261123b`, preventing browser caches from serving the earlier films. Keep `validation-report.json` with the release evidence. Native binaries, caches and local logs are excluded from publication.
