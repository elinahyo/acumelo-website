# V3 media ownership and page assignment

Status: v3 is published and technically tested. The archive owner's private ledger confirms authenticated re-download SHA-256 and byte-count verification of all 16 company Drive archive ZIPs. Archive integrity and playback tests do not imply editorial or voice-identity approval. No original assets are deleted by this documentation update.

## Current operating constraints

Do not perform additional browser or native UI operations for now. Continue code-based preparation only. The user does not want every program launched locally for recording. Build accurate UI reconstructions from public references, using original scenarios and project outcomes. Retain only final deliverables and source material needed for revisions; do not create unnecessary Office samples, recordings or temporary files. Existing approved assets are not implicitly authorized for deletion. The overall approved work and separation of Chris's content ownership from temporary page assignments remain valid. Browser QA listed below is deferred while the no-UI instruction remains in effect.

## Delivery requirements

Latest revision: `20261123c`, final delivery status `qa-passed`. It contains 38 distinct stable media IDs: 26 instructor-field demonstrations, 6 category overview demonstrations, and 6 common project showcases (24 concepts per field). The earlier `tools/plan-media-v3.mjs` planning check validates the intended contract against the confirmed 11 instructors and 26 teaching-field relationships without copying media or changing website data:

```sh
node tools/plan-media-v3.mjs intended-delivery.json content.js .local/integration-plan.json
```

Create the ignored `.local` directory before writing a local plan. The output is explicitly planning-only; its assignments have `status: pending` and must never be copied directly into the active catalogue. Final delivery-map, actual duration metadata, file hashes and audio QA are still required. The final importer must map delivery kind `showcase` to website kind `project`, set `narration: {language: 'en', temporaryVoice: true}` and `hasBgm: true` for these supplied synthetic-voice/music sequences, and activate assignments only after verification. Do not infer these flags for future real instructor footage.

Instructor profiles use a labelled native field selector and show one matching demo player. Changing fields pauses the old player and creates a manually started player with native controls, captions and `preload=none`. Selection survives an in-page language change. Only explicit active `profile-demo` assignments may populate this player. The catalogue must match the assigned instructor, field, `scope: instructor`, `kind: demo` and the instructor's fixed `media.voiceId`. There is no legacy, category, shared-video or unassigned-map fallback. Missing or inconsistent fields remain selectable but show an empty slot.

`contentOwnerId` is archive ownership, not speaker identity. Each catalogue item records `assignedInstructorId`, `voiceId` and `voiceRole` independently. `voiceId` is declared production provenance; matching a file hash and voice configuration is not perceptual proof of the audible speaker. Common category showcases have no assigned instructor and remain separately labelled shared examples. The current v3 shared overviews use `am_michael`; shared project narration uses `af_heart`. These shared voices must never be interpreted as the profile instructor's own demonstration. A future music-only showcase must explicitly disable narration and retain its shared-project role. Human lecture slots and captions remain unchanged; transcript-expansion links stay removed.

Selector checks cover routing, single-player rendering, pause on change, locale selection, superseded history and manual playback. Headless automated QA of the final release passed 76 responsive cases at 320/390 pixels in English/Korean and playback, metadata, poster and caption checks for all 38 films. Field changes and navigation stop playback; playing a second video pauses the first. No desktop browser window was opened or controlled.

The forthcoming package covers 26 instructor–field demonstrations, at least 50 tools, and student project showcases. Both demonstrations and showcases have English narration and BGM. Instructor narration is temporary until real instructor material is supplied. Duration is determined by content and editing rhythm; there is no 15-second cap. Actual official tool UI references, including ChatGPT, Claude, Gemini, Word, PowerPoint, Excel, n8n, Flutter and React, are required. Do not describe the existing v2 silent reconstructions as satisfying these new requirements.

## Three independent records

1. `content.mediaCatalog[mediaId]`: stable media identity, `contentOwnerId`, `fieldId`, `kind`, actual duration, titles, descriptions, final mixed MP4, poster and captions. Ownership is the supplied content-management designation, independent of where a clip is shown. Today's supplied assets use `contentOwnerId: instructor-chris`.
2. `content.mediaAssignments[]`: page placement only. Each record has `assignmentId`, `mediaId`, `assignedInstructorId`, `fieldId`, `placement`, `temporaryAssignment` and `status`. Use `profile-demo` for each instructor-field clip, `course-demo` / `course-project` for category slots, and `owner-library` for retained material on its owner's page. Category placements can have no assigned instructor. Keep superseded records instead of deleting history. Enforce one active assignment per profile/field/placement or course/field/placement at import.
3. Private archive manifest keyed by stable media ID, retained in restricted company Drive. Store archive-relative original/source paths, hashes, independent narration and BGM stems, generated-file provenance, tool/UI reference sources and final mix hash there. The public `media/releases.json` records verification status and archive coverage only; never put private folder links, file IDs, ZIP URLs or the full private inventory in it. Keep originals and stems even when the published placement changes. Archive paths and audio stems are never implicitly embedded in the public catalogue.

Example public asset (paths remain unset until delivery):

```json
{
  "mediaId": "stable-package-media-id",
  "contentOwnerId": "instructor-chris",
  "fieldId": "design",
  "kind": "demo",
  "title": {"en": "Delivered title", "ko": "확인된 번역"},
  "durationSeconds": 42,
  "src": "",
  "poster": "",
  "captions": [],
  "narration": {"language": "en", "temporaryVoice": true},
  "hasBgm": true
}
```

Example assignment:

```json
{
  "assignmentId": "stable-assignment-id",
  "mediaId": "stable-package-media-id",
  "assignedInstructorId": "instructor-03",
  "fieldId": "design",
  "placement": "profile-demo",
  "temporaryAssignment": true,
  "status": "active"
}
```

Example internal archive entry shape:

```json
{
  "mediaId": "stable-package-media-id",
  "contentOwnerId": "instructor-chris",
  "original": {"path": "", "sha256": ""},
  "audioStems": {
    "narration": {"path": "", "sha256": "", "language": "en", "temporaryVoice": true},
    "bgm": {"path": "", "sha256": ""}
  },
  "finalMix": {"path": "", "sha256": ""},
  "references": []
}
```

## Replacement behaviour

`tools/media-assignments.mjs` exports a pure `replaceAssignment` operation. Register the real instructor's new asset under a new stable ID first. Replacing an active temporary placement marks its old assignment `superseded`, creates the real asset's active placement, and retains the old asset under Chris's `owner-library`. Neither asset is mutated or deleted; the original input registry remains unchanged. `ownedMedia(data, 'instructor-chris')` retrieves all of Chris's assets regardless of their current page placements. The frontend displays owner-library placements in a separate section and resolves each instructor's active field-specific demos without duplicating shared category demonstrations.

Historical v2 assets may remain in Git, but they are never a fallback for instructor demonstration slots. Superseded or missing assignments must never silently reactivate an old clip. Source collection walks the new catalogue while keeping MP4 external. Original assets, avatars, IDs, instructor order and the six category names/layout are preserved.

## Checks and next integration

`node tools/check-media-assignments.mjs` passes original preservation, input immutability, history, replacement routing, owner-library retention and non-15-second durations. Existing instructor graph and builds also pass. The empty catalogue does not change current page content. No browser layout claim is made for the new multi-clip layouts yet; validate them with the actual package before publication.

V2-specific importers, validators and gallery scripts still contain their v2 15-second format assumptions. Do not use them unchanged for V3. On receipt, build the V3 importer/gallery against actual per-clip durations, validate final audio tracks and independent stems, map all 26 confirmed instructor-field combinations, verify official UI provenance, then perform browser/mobile playback QA. Keep removed transcript links and expandable descriptions absent. Publish only after the final package is supplied and verified; do not overwrite original files to perform a page reassignment.

