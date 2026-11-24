# Editorial review revision 20261124d

This cloud job renders Chris/Sage/Pillow's 11 instructor-field demonstrations and six shared project showcases from public v3 source and web media. No private Drive archive, user voice sample, TTS model download or paid generation service is used. Instructor AAC packets are copied unchanged and checked against their source. Project showcases are generated from the original procedural music function with no narration input.

The expected declared voices are Chris `am_michael`, Sage `af_heart`, Pillow `af_nicole`. Packet/hash verification proves source continuity, not perceptual speaker suitability or creative approval. These remain illustrative interface reconstructions and original project concepts, never native application footage or verified student work. Technical success does not mark the editing as user-approved.

## Cloud execution and review

The workflow supports `workflow_dispatch` once registered on the default branch. The current connector cannot call that endpoint directly, so an explicit `render-request.json` commit on `codex/media-v4-ci` triggers the same controlled job. The request pins renderer and validation source hashes. It does not change the public site. See [GitHub's trigger documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

Four isolated jobs render the three instructors and shared projects. Each validates decoding, codecs, dimensions, frame rate, duration, volume, captions/posters and exact instructor AAC packet hashes. Only MP4, JPEG, VTT and JSON review material is uploaded. WAV intermediates remain on the ephemeral runner and are excluded from artifacts and Git.

After all jobs pass, a staging job combines exactly 17 records and pushes `codex/media-v4-render-<run_id>`. This branch contains new assets under `assets/media/20261124d/`; it does not change `content.js`, website mappings, DNS or email. Inspect representative Chris/Sage/Pillow frames and playback before preparing a separately reviewed mapping change. The existing v3 files remain available for rollback.

The public timeline JSON files under the v3 source are necessary timing/layout inputs; copying only the two renderer scripts would omit these inputs. The three Python dependencies are pinned in `requirements-ci.txt`; the Canvas dependency uses the v3 frozen pnpm lockfile. Linux fallback font metrics may differ from Windows previews, so representative cloud frames must be inspected.
