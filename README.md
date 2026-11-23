# Acumelo website

Canonical remote: [elinahyo/acumelo-website](https://github.com/elinahyo/acumelo-website).
Published preview: [GitHub Pages](https://elinahyo.github.io/acumelo-website/).

`main` is the published site. `codex/remote-development` backs up pending media-ownership work and portable development setup. The new narrated media is not finished. Current published media is the earlier silent v2 collection. Domain, DNS and email settings are outside this change.

## Resume on any PC

Install Git and Node **24.22.3** (with bundled npm), then:

```sh
git clone --branch codex/remote-development https://github.com/elinahyo/acumelo-website.git
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
| `media/releases.json` | Verified archive locations and hashes; empty pending new media |
| `media-production/` | Historical renderer sources and required artwork |

There is currently **no server database**. Canonical content and version history live in Git. Do not commit passwords, tokens, customer records or private instructor originals to this public repository. Use repository-relative paths. Introduce a private cloud database only when an actual application feature requires one.

Keep media identity and content ownership separate from page placement. New assets retain their supplied owner (`instructor-chris` for the forthcoming package). Replacing a temporary placement returns its original to the owner's library. Preserve instructor IDs, order and approved avatars. Actual instructor lecture slots remain empty until supplied. Course/project videos are examples, not verified student results or instructor credentials. Enquiry preparation does not send messages automatically.

## Original media and remote recovery

The forthcoming narrated media, separate narration/BGM stems and editable originals have not been delivered or archived yet. `media/releases.json` must stay empty until real uploads are verified. Published v2 files and supplied renderer sources already exist in Git; they do not substitute for upcoming originals.

Use versioned GitHub Releases for public, approved archives, or access-controlled cloud storage for private originals. Record each archive's version, immutable URL, SHA-256, byte size, contained media IDs and access classification. Keep an internal source/stem hash manifest inside each archive. Do not commit credentials or temporary signed URLs.

The connected GitHub tool supports Git blobs, trees, commits and branch updates, but does **not** expose Release creation or binary Release upload. No CLI/environment-token/cached Git credential was available on the preparation PC. A separately authenticated `gh release upload` or the [Release asset REST endpoint](https://docs.github.com/en/rest/releases/assets#upload-a-release-asset) is needed for that step. Release files must be [under 2 GiB each](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases). Releases in this public repository are public; private originals need private storage.

Before any local cleanup: upload the complete archive, download it independently, compare archive and internal hashes, open/decode required media and record verification evidence. Only then identify task-created disposable local files. Do not delete user original photos/documents, synced sources, other projects, old history or any source lacking a verified remote copy. No cleanup was performed during this preparation.

## Release process

Run checks and build, review the diff and commit to a development branch. `main` is the Pages publication branch. Do not merge unfinished media integration. After final delivery, validate all 26 instructor-field mappings, audio/stems, durations, captions, single-player behaviour, navigation stops and mobile layouts before publication. Browser/mobile QA of pending multi-video layouts is deferred under the current no-UI instruction.

The historical `media-production/v2-20261123` renderer has its own lockfile and README. Its silent, 15-second rules apply only to v2; do not use them unchanged for new media.
