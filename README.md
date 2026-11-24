# Acumelo website

Canonical remote: [elinahyo/acumelo-website](https://github.com/elinahyo/acumelo-website).
Published preview: [GitHub Pages](https://elinahyo.github.io/acumelo-website/).

`main` is the publication branch. The current release contains 38 illustrative films: 26 instructor-field demonstrations and six category overviews with temporary synthetic narration, plus six shared project showcases with original music only. Chris/Sage/Pillow use 11 revised films; the other 15 instructor films and six overviews retain v3. `codex/remote-development` retains the development history. Media identity and Chris's original content ownership are separate from temporary instructor assignments. Domain, DNS and email settings are outside this change.

## Resume on any PC

Install Git and Node **24.22.3** (with bundled npm), then:

```sh
git clone --branch main https://github.com/elinahyo/acumelo-website.git
cd acumelo-website
npm ci
npm run check
npm run build
npm start
```

Open `http://127.0.0.1:8765/` when UI review is authorized. Stop the server with Ctrl+C. The website has no third-party runtime/build dependencies. The lockfile records that empty dependency set. Commands without npm: `node tools/check-site.mjs`, `node tools/check-media-assignments.mjs`, `node tools/build-published-site.mjs`, `node tools/serve.mjs`.

`.devcontainer/devcontainer.json` supplies the same Node version for an explicitly created container or Codespace. Committing it does not start a cloud machine. The container configuration is prepared but has not been started or validated in a cloud environment. Website development does not require the renderer's separate dependencies.

## Edit and build

| File | Purpose |
| --- | --- |
| `source.html`, `styles.css`, `site.js` | Page structure, appearance and behaviour |
| `content.js` | Bilingual content, instructor IDs/fields, media catalogue and assignments |
| `assets/` | Public videos, captions, posters and website assets |
| `index.html` | Generated site; rebuild and commit with edited sources |
| `tools/media-assignments.mjs` | Preserve original media when replacing an instructor placement |
| `docs/media-ownership.md` | Stable identity, ownership and replacement contract |
| `media/releases.json` | Public archive-status summary; private locations and inventory stay outside this repository |
| `media-production/` | Historical renderer sources and required artwork |

There is currently **no server database**. Canonical content and version history live in Git. Do not commit passwords, tokens, customer records or private instructor originals to this public repository. Use repository-relative paths. Introduce a private cloud database only when an actual application feature requires one.

Keep media identity and content ownership separate from page placement. New assets retain their supplied owner (`instructor-chris` for the forthcoming package). Replacing a temporary placement returns its original to the owner's library. Preserve instructor IDs, order and approved avatars. Actual instructor lecture slots remain empty until supplied. Course/project videos are examples, not verified student results or instructor credentials. Enquiry preparation does not send messages automatically.

## Original media and remote recovery

The company archive owner has verified the source and media ZIP archives in private company Google Drive, including production sources, field audio/music, final videos, historical designs and subsequent revision packages. The private archive ledger records authenticated re-downloads with matching SHA-256 and byte counts. The website chat reviewed that ledger; it did not repeat the uploads or delete originals.

Private company Drive is the source/master/stem archive. Git is the canonical home for public web masters, the website, reproducible production code and lightweight configuration. Keep the private folder address, file IDs, download links, ZIPs and full private hash inventory in the restricted company archive ledger, never in this public repository or website. `media/releases.json` intentionally contains status and coverage only. Authorized maintainers obtain access through the company's private archive inventory.

Archive integrity and successful technical playback checks are separate from editorial approval, voice identity approval and visual quality acceptance. Retain versioned originals when correcting a voice or edit; do not treat the archived v3 release as an approved creative final.

Local retention is coordinated with the archive owner. This website chat performs a read-only audit and does not duplicate another chat's cleanup. Keep the final website working folder, original user attachments/documents, `sources`, OneDrive links and any file whose archive coverage is unconfirmed. A file absent from the current Git tree or supplied archive manifests is unconfirmed, not automatically disposable; older Git history may also retain it.

## Release process

Run checks and build, review the diff and commit to a development branch. `main` is the Pages publication branch. Validate all 26 instructor-field mappings, audio, durations, captions, single-player behaviour, navigation stops and mobile layouts before publication. `tools/check-media-browser.mjs` supports headless checks without controlling desktop windows: provide `PLAYWRIGHT_MODULE`, `QA_BROWSER_EXECUTABLE`, optional `QA_BASE_URL` and `QA_REPORT` for the current environment. Desktop browser windows are not opened by this check.

The current renderer is in `media-production/v3-20261123`, with a separate pinned Canvas lockfile, model download URLs/hashes and original visual example assets. Historical v2 silent, 15-second validators do not apply to v3. The current example films use temporary synthetic English narration and original procedural music; they are not actual instructor voices, live application recordings or verified student work.

## Editorial revision

See [the review record](docs/editorial-v4-review.md) and [the media gallery](https://elinahyo.github.io/acumelo-website/assets/media/20261124d/index.html). Technical and representative-frame checks passed; they do not imply that the user approved every edit or the audible character of each synthetic voice. Historical v3 assets remain in Git.
