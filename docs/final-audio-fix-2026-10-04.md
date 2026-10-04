# Final audio release correction

The live audio catalogue advertised files that returned HTTP 404 for Maithili, Hindi and English, including nomineeYes and nomineeNo. This reproduced a missing-resource failure independently of browser connectivity.

The Vercel ignore rule `audio` also matched released files under `dist/audio`. It now excludes only the root authoring directory `/audio/`. The released public catalogue contains 10,672 MP3 recordings across 16 listening languages. Public instruction files are separate from user-entered information.

Retry now resets the media resource with `load()` before attempting playback of the same URL. Regression coverage verifies this reset and the deployment exclusion boundary. The release gate passed 169 tests, with zero failures.

The MITRA referral now uses the MF Central MITRA entry link. Paper securities nomination guidance explains that ordinary signatures do not need witnesses, whereas thumb impressions require two witnesses and their names and addresses. This guidance is conditional on the securities route and does not apply that rule to bank accounts. The new notice is text-only draft copy in all 21 language packs. Source: https://www.sebi.gov.in/sebi_data/attachdocs/jun-2026/1780397706130.pdf (section 6.2 and nomination form).

Progress after reopening and unfinished-task behaviour were explicitly deferred and received no further changes in this final pass.

Deployment uses the existing GitHub production integration for Sangyan on the existing Hobby plan. Live verification is recorded separately after the deployment reaches READY.

## Published verification

Production deployment `dpl_EvJvfZkLyJxbxJmqYsiMdvQRtbnh` reached READY for product commit `6aba77637981158cd778ce6d5d496ec9bbddd270`. All 109 live checks returned the expected release bytes, including representative base and supplemental audio in all 16 listening languages, all 21 language entry/pack/paper routes, and the six formerly missing English, Hindi and Maithili nominee-choice clips. This is representative live audio coverage, not a request to every one of the 10,672 recordings. The complete recording inventory passed local integrity verification.

Maithili playback was then observed on production with reading highlights and playback controls. The browser had previously visited the production origin and needed one reload after activation of the new public service worker; fresh-browser startup was not inferred from this observation. The verification record and screenshot are in `docs/audits/2026-10-04-final-audio/`.
