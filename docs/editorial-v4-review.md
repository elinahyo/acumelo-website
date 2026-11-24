# Editorial revision review — 20261124d

This revision retains the approved search UI and adds 17 versioned films: 11 Chris/Sage/Pillow instructor demonstrations and six music-only shared project showcases. The other 15 instructor films and six category overviews retain their v3 assignments. Historical files and ownership are preserved.

Cloud run [45308741904](https://github.com/elinahyo/acumelo-website/actions/runs/45308741904) passed. The generated source commit is `c590335c0f06d451226f7be255e1a27bbb057622`. The previous two attempts encountered slow downloads from the EC2 Ubuntu package mirror. Switching to the official Ubuntu archive resolved the dependency bottleneck; the eight already verified films were reused.

- Chris: six films, declared voice `am_michael`.
- Sage: three films, declared voice `af_heart`.
- Pillow: two films, declared voice `af_nicole`.
- Shared project concepts: six films, original music only; no narration, voice metadata or narration captions.

All 17 films passed full decoding, codec/dimension/frame-rate/duration checks, volume checks and SHA-256 verification. All 11 instructor films preserve their source AAC packets exactly. Browser checks started all 17 films and confirmed dimensions, duration, posters, English caption resources where applicable, manual playback, single-player behaviour and pause on filtering. Browser-downloaded bytes matched the manifest SHA-256 and sizes. Gallery layouts passed English/Korean at 320px and 390px. A separate proposed-routing preview passed 44 instructor/language/mobile cases; the same tested catalogue is included in this revision.

Chris development, Sage design, Pillow design and design showcase frame sheets were visually reviewed. Main headings fit the selected cloud-rendered frames. This is a representative-frame review, not approval of every edit, a complete listening review or certification that the reconstructed interfaces exactly match current application versions. These are illustrative interface reconstructions and original project concepts, not native-app footage, real instructor voices or student submissions. Technical integrity and declared voice provenance remain separate from editorial acceptance.

The 82 cloud-generated review files total approximately 86.1 MiB, with the largest file below 9 MiB. Public MP4/JPEG/VTT/JSON and reproducible source remain in Git. Private masters, stems and revision archives stay in the company Drive inventory; private URLs, IDs and ZIP files are excluded from this repository.

## Reproduce the review without replacing active content

```sh
node tools/import-editorial-v4.mjs --output /tmp/acumelo-v4-content.js
QA_CONTENT_PATH=/tmp/acumelo-v4-content.js node tools/build-editorial-gallery.mjs
BUILD_CONTENT_PATH=/tmp/acumelo-v4-content.js BUILD_OUTPUT_PATH=/tmp/acumelo-v4-index.html node tools/build-published-site.mjs
```

These commands prepare the separate gallery and routing preview. The default importer destination is active `content.js`; do not omit `--output` until a content replacement is approved. Historical media and superseded assignment records are retained.

For cloud-only media review, `tools/serve-editorial-review.mjs` streams versioned public files from a pinned render commit without saving video copies. Set `QA_MEDIA_REF`, `QA_INDEX_OVERRIDE` and optional `PORT`. Headless checks use `PLAYWRIGHT_MODULE`, `QA_BROWSER_EXECUTABLE`, `QA_BASE_URL` and `QA_REPORT`. The server never opens a desktop browser. Run `tools/check-editorial-gallery.mjs` for the 17-film review and `tools/check-demo-browser.mjs` for instructor search/routing checks.
