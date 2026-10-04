# Browser acceptance checks — current Virasat journey

Run against localhost with synthetic records. `npm test` verifies schema, transitions, routing, encryption and speech state; these checks cover the rendered experience. The old 2 October automation is retained in `archive/tests/` for historical comparison and is not a current test runner.

1. On `/`, use keyboard to choose one of 21 native-script language buttons. No private data appears before language choice. Locale entry URLs canonicalize to `/`.
2. Start with no selected account type. Continue shows an inline error and focuses the group. Choose bank; an empty institution is rejected. Search HDFC, SBI and a regional alias; use Down/Up, Enter, Escape, Tab. Enter a custom institution not in the list.
3. Choose owner, holding and savings/deposit; verify HDFC deposit instructions differ from savings, and joint submission uses the branch route. Choose a mutual-fund folio vs demat; identify the broker account without duplicating its nomination task.
4. Unknown → what found → missing → preparation → request sent → awaiting confirmation. A submitted request must not become registered. Check a blocked request and a deliberate opt-out separately.
5. Confirmation requires record type, a real nonfuture date and an explicit registration check. A date before submission fails. Nomination status alone is distinct from checking nominee details. Changing the institution or requesting a recheck removes old confirmation.
6. Enter partial dates and optional notes; switch through all 21 languages. Go Home, resume the draft, save it in a password-protected file, reload, and unlock the saved copy. Uncommitted form fields must not silently change the account status. Test wrong password and corrupt file through automated crypto/schema checks.
7. Optional on-device persistence contains only an encrypted envelope, is off by default, and requires a password after reload. Saving again is explicit. Clearing session leaves downloaded files; removing the device copy affects only that copy.
8. Add family nicknames, multiple nominee notes, last four digits and a record location. Toggle sharing controls. A private evidence note must not occur in the readable family sheet or page speech. Download readable HTML, print/PDF, and a calendar reminder.
9. On every main view, start/pause/resume/stop speech. Use the selected language's bundled public recordings where advertised. Text-only languages show the written availability notice; there must be no device-voice requirement or English audio fallback. Opening dialogs, navigating and changing language stop old speech.
10. Inspect 1280px desktop and 320px mobile, all languages, 200% text, contrast and spacing. All controls remain reachable; no horizontal overflow. Urdu and Sindhi have RTL text and the established left-aligned LTR page geometry. Dialog Escape restores focus to its trigger. Keyboard-only account search retains focus in the combobox.
11. Inspect console errors and labels/description relationships. Run a fresh Lighthouse mobile navigation audit on `/en`; its score covers that rendered page, not the entire authenticated or saved-state flow.

Record exact observations, limitations, source hashes and screenshots in `docs/audits/`. Browser checks are not a WCAG conformance claim or a fluent-language/accent review.

## Major-checkpoint regressions

- Confirming a nomination leaves family review unfinished. Review family fields, intentionally omit nominee names, and mark the review; the family sheet distinguishes omission from incomplete work. A later nomination change resets family review.
- Save from both new setup and an existing family/confirmation form. Back and Return to my task must restore the same draft, even when another new-account draft exists.
- An unfinished demat addition for an MF retains its source across encrypted save/unlock but never links without the holder/unit confirmation.
- Axis FD/RD does not receive the savings path. Zerodha correction receives the modification-form route. Joint holders receive assisted guidance. Unsupported institutions remain explicit fallbacks.
- Online/in-person route switching retains account status. The handoff save checkpoint disappears only after a deliberate successful save.
- Sentence next/replay/previous and pause work; skip while paused must restart audible playback. Stale completion callbacks must not advance the new session. Read-along never contains input values or private account names.
- Reopen the app to verify reading size, contrast, spacing and voice preferences persist. Account records remain locked until deliberately reopened. Reset restores reading defaults.

## Bundled-audio regression checks (3 October checkpoint)

- Each advertised audio language must enter playing state after Listen, without checking or installing an operating-system voice. Playback begins only after user action.
- Main button changes Listen → Pause → Continue; previous/repeat/next keeps the matching public transcript. Stop, language change, route change and dialog dismissal stop the previous queue.
- Read the privacy, confirmation and settings dialogs. Check no duplicate dialog-control IDs. Public validation messages are available to Listen; entered passwords, account nicknames and private notes never enter the audio queue.
- While online, play an instruction, then make the test origin unavailable. Reload must use the public shell where service workers/storage are supported. Played audio should replay; a new instruction must offer Retry. Restore the origin and retry at the same place. Do not describe all clips as pre-downloaded.
- At 320 px and 200% text, check every language's expanded player and the settings dialog for horizontal overflow and reachable controls. Reset temporary preferences afterwards.
- The audio asset test must validate every advertised manifest against current copy and every MP3 checksum. Check live MIME type, CSP and byte ranges separately.
- Fluency, accent, comprehension, physical low-end Android and actual screen-reader review remain separate human validation tasks.
