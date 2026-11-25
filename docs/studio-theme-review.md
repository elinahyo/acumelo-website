# Acumelo Studio visual revision

Prepared from main `ce1d215bb5b5af01627fac96c7960372e4da4265` on 26 November 2026. This revision changes the complete visual system while retaining the large sidebar layout, navigation, copy, six fields, 11 instructors, 26 instructor-field relationships, independent curricula and every existing media assignment.

## Art direction

Deep navy and violet create the studio backdrop. Rounded cream panels, layered borders, inset highlights and bottom shadows make controls tactile. Royal blue identifies the selected content tab, gold identifies a selected instructor filter, and coral carries enquiry actions with dark text. Six original field icons use the existing field identities. Instructor portraits sit inside character frames without editing their source images, faces or mirrored state. There are no invented scores, currency, rankings or game mechanics.

The same components cover the home page, comparison rows/cards, course and instructor workspaces, roster/filter controls, search, accordions, media frames, About, enquiry form, mobile menu and footer. Mobile decoration occupies its own row below the home CTA and introduction notice. Instructor names use Nunito 900 in both languages. Reduced-motion settings disable the optional entrance/float and hover transitions.

## Typography and artwork sources

Nunito is the rounded English display/body face; Jua provides Korean display lettering, and Noto Sans KR handles readable Korean body text. All are self-hosted WOFF2 with the corresponding SIL Open Font License included in `assets/fonts/`. Fonts total 185,288 bytes across five WOFF2 files. No Google font service is requested at runtime.

Official licence sources: [Nunito](https://github.com/google/fonts/blob/83c62e30d87daa70216dab6b984d00d20d96d585/ofl/nunito/OFL.txt), [Jua](https://github.com/google/fonts/blob/83c62e30d87daa70216dab6b984d00d20d96d585/ofl/jua/OFL.txt), [Noto Sans KR](https://github.com/google/fonts/blob/83c62e30d87daa70216dab6b984d00d20d96d585/ofl/notosanskr/OFL.txt).

`assets/fonts/manifest.json` records source URLs, licence provenance, sizes and SHA-256 values. `tools/prepare-studio-fonts.py` deliberately refreshes web subsets from official Google Fonts endpoints; it uses Python's standard library and creates no TTF/download cache. Korean subsets cover the current site copy. After adding Korean copy, rerun that script and review the updated assets; system sans-serif remains the fallback for additional characters.

`tools/build-studio-art.py` reproduces the six original vector icons and decorative creative stage in `assets/studio/`. No Royal Match artwork or other third-party game assets are distributed. The approved Acumelo logo and portraits remain unchanged.

## Review and verification

The design check `tools/check-studio-design.mjs` covers English/Korean at 320, 360, 390, 768 and 1440 pixels, seven page types, font loading, primary body text of at least 16px, menu keyboard focus, reduced motion and control/text contrast using the lightest gradient endpoints. Metadata and supporting labels may use 12–15px. The initial full run passed 71 cases and 158 contrast samples; the lowest sampled contrast was 5.59:1. The follow-up smoke mode checks bilingual instructor names and mobile decoration separation after visual review.

Existing `tools/check-learning-navigation.mjs` and `tools/check-learning-playback.mjs` cover the preserved field/tab routes, 26 relationships, search, keyboard tabs, history, enquiries, manual video playback and pause-on-transition. This is not a new editorial approval of existing videos. Media editing remains paused.

Headless review opens no user desktop app or browser window. While the local review server is running, the entry point is `http://127.0.0.1:8792/?page=lectures`. A public release requires approval of the concrete design PR; earlier PR approvals are not reused for this revision.
