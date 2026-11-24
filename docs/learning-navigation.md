# Field-scoped learning navigation

The education comparison rows link to a field's curriculum. Each field and instructor has four tabs: curriculum, lecture, demo and project. Only the active page and selected tab content are mounted; leaving a field, tab or page pauses the existing player before removing it. Native controls, captions, manual playback and `preload=none` remain in use.

Routes are shareable and support browser history and language changes:

- `?page=design&field=design&tab=curriculum`
- `?page=instructor-chris&field=design&tab=demo`
- `?page=library&field=design&tab=project`

Invalid instructor fields resolve to that person's first assigned field; invalid tabs resolve to curriculum. A field page owns its own field regardless of an inconsistent query parameter. Instructor links from a field's curriculum carry that field. Filtered people cards do the same. Enquiry links carry the instructor and field into the form and copied draft, without replacing user-written enquiry text.

## Personal curricula

`content.js` contains 26 explicit `instructorPrograms` records, one per approved instructor-field relationship. `curriculumId` is stable and independent of shared field curricula. Each record has `instructorId`, `fieldId`, `status`, and bilingual `modules` arrays. All personal records start as `pending`: no personal curricula have been supplied or verified. Never copy a shared field curriculum and present it as the instructor's approved syllabus.

To publish a confirmed personal curriculum, edit only its matching record, provide bilingual module tuples `[title, description, practice]`, and set `status` to `published` after review. Preserve any provisional/example attribution in that content. Shared field example modules and all original goals, audience, prerequisites, outcomes and delivery details remain available in expandable panels.

Future field-specific lecture films belong in `member.media.lectures[fieldId]` with matching `instructorId` and `fieldId`. Existing profile-wide empty lecture records remain preserved; the interface does not assume that one film belongs to every field. Missing films show a small notice.

## Media separation

Instructor demos resolve only through active assignments with matching instructor, field, scope, kind and expected voice. There is no category/legacy fallback. Project tabs use shared category examples and retain their example/music disclosures. Existing media IDs, owners, temporary assignments, voices, files, archives and version history remain unchanged. Active owner-library material remains accessible through collapsed links without mounting more players.

## Validation

Run `npm run check` and `npm run build`. For headless UI checks, use `tools/check-learning-navigation.mjs` and `tools/check-learning-playback.mjs`, with `PLAYWRIGHT_MODULE`, `QA_BROWSER_EXECUTABLE`, `QA_BASE_URL` and `QA_REPORT` as appropriate. Optional `QA_SCREENSHOT_DIR` saves review images. These checks open no desktop browser window.

Navigation covers English/Korean, 320/360/390/768/1440px, all 26 instructor-field relationships and all four tabs, six field pages, comparison cards, keyboard navigation, scoped search, invalid routes, history, refresh, language changes and enquiries. The separate playback check exercises existing public media, captions/posters and pause-on-transition/single-player behavior. It is not an editorial re-review or a change to video/audio content. Historical search tests target the previous stacked interface; use these checks for the tabbed interface.
