# Acumelo media production v3

38 illustrative films: 26 individual instructor/field demonstrations, six category overviews, and six project-concept showcases (24 concepts per field). All contain temporary synthetic English narration and original procedural music. These are reconstructed teaching examples, not live application recordings, real instructor voices, verified student submissions, or claims of deployed client work.

The original content owner is `instructor-chris`. Assignments to other instructors are temporary and can later be replaced without deleting the original content. Web-player assignment metadata is in the delivered media manifest.

## Rebuild on another computer or cloud development machine

1. Install Node.js 22+ and Python 3.11+ in an isolated project environment.
2. Run `npm ci` (or `npm install` when no lockfile is supplied).
3. Run `python -m pip install -r requirements.txt`.
4. Run `python setup_audio.py` to download the separately licensed voice-engine weights. Published model URLs and SHA-256 values are in `models.json`.
5. Run `node prepare.mjs`, then `python audio.py`.
6. Run `node render.mjs --proof` for contact sheets and posters, then `node render.mjs` for H.264/AAC web movies and optional English VTT captions.
7. Run `node package-media.mjs`, then `python qa.py`. Publish only when `output/validation-report.json` passes and the delivery manifest reports `qa-passed`.

Set `PYTHON` if the Python interpreter has a different command name. Set `FFMPEG_PATH` to use an installed FFmpeg binary. The fallback uses the executable supplied by `imageio-ffmpeg`. Set `FONT_DIR` to a folder with the required fonts. Windows renders used Segoe UI, Arial, Consolas and Georgia; these commercial system fonts are not redistributed. Other systems use their own fallback fonts, so exact pixels may differ. No native Office, Unity, Adobe, Maxon, browser window, or paid generation API is launched by this pipeline.

Use `node render.mjs --only chris-design-demo` to render one film. A renderer/source hash prevents redundant rerenders. Individual cases, shot weights, framing and narration are editable in `case-direction.mjs` and `blueprint.mjs`. Voice and music WAV stems are delivered separately to the company archive; the music stem already includes the narration ducking envelope. Mix WAV files are reproducible intermediates.

`assets/` contains original Acumelo visual examples and Blender frames/projects. `native/blender_studio.py` records the original 3D scene construction. `project-visuals.mjs` supplies the final project-concept layouts; its legacy demonstration branches are unused by v3. Downloaded third-party screenshots were reference material only and are not included as portfolio content.

## Coverage and fidelity

The program-layout reconstructions simplify interface detail. Software versions and workspace settings change. Higgsfield uses its documented Cinema Studio 2.0 layout as an explicit reference, not a claim to reproduce the newest default version. Curriculum coverage names are broader than the number of distinct software interfaces shown. The manifest reports both separately.

## Archive ownership

Keep the generated master source bundle and editable audio stems in the Acumelo company Drive, `1st@acumelo.com`. Keep reproducible code and lightweight configuration in Git. Do not delete the last local copy until remote file size/hash or download verification has succeeded.

## Git source distribution

This Git copy contains reproducible code, pinned Canvas lockfile, model download URLs/hashes, references, original example images and Blender preview frames needed by the renderer. Use `pnpm install --frozen-lockfile` for the supplied lockfile. Native Blender binaries remain in the earlier `media-production/v2-20261123` history and the separately retained master source bundle; they are not needed to render these videos. Generated output, proofs, audio WAV stems, model binaries and private company archive ZIPs are excluded. The final master source/stem archive is still awaiting verified company-cloud storage; do not delete its only local copy.
