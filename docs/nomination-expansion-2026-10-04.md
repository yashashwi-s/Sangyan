# Nomination expansion — branch checkpoint

4 October 2026. Branch `codex/nomination-guided-journey`, based on `7ed33dd`.

## Delivered

Six-step learning companion linked from existing account detail/preparation: institutional route, field meanings/purpose/location/checks, fixed fictional practice and a three-field rehearsal, temporary preparation checklist, interpretation of submission responses, and six troubleshooting reasons. Detailed field teaching applies to the cited securities framework. Banks, MF-in-demat, uncertain account contexts and deceased-holder requests receive separate boundaries. Practice never mutates real account status.

The user's stricter no-storage instruction removes personal file saves/imports, encrypted browser copies, readable exports, print and calendar controls. Records and drafts remain in memory only; exit/reload/clear reset them. Known legacy browser copies are removed without reading them. Preference-only storage and public offline assets remain. New policy copy replaces obsolete save promises and is excluded from outdated recordings. No cookies are set.

## Evidence

- Public build completed; **76/76 automated tests pass**, including 13 new coach/privacy tests. Existing historical crypto/schema tests remain, but do not indicate enabled saving. [Full output](audits/2026-10-04-nomination/tests.txt).
- Browser exercised fictional account → learning → wrong/correct answer → unchanged real status, three-field rehearsal completion, temporary checklist, submitted request → awaiting confirmation, reload → empty session, bank-specific boundaries, deceased-holder stop and rejected-request next actions.
- Switched all six interface languages while the English coach was open at **320px / 200% text**. Width and scroll width both stayed 320px; the coach remained English/LTR. This is reflow evidence, not translation or assistive-technology approval. [Measurements](audits/2026-10-04-nomination/reflow.json).
- No captured browser warning/error logs in checked flows. Both pointer-driven and focus-preservation behavior were observed; full keyboard-only/real screen-reader certification was not performed.
- Final Lighthouse mobile navigation on clean localhost origin `/en`, Chromium-based Brave headless, Lighthouse 13.5.0: **Performance 99, Accessibility 100, Best Practices 100, SEO 100**. Default Lighthouse simulated mobile throttling, not a physical handset. [Full report](audits/2026-10-04-nomination/lighthouse-home.json), [settings/source hashes and observations](audits/2026-10-04-nomination/audit-state.json). Initial auto-detection failed because Chrome was not installed; using installed Brave with an isolated headless profile succeeded.
- Independent review agent examined the diff, privacy/event paths, teaching isolation and docs, then independently ran **76/76 tests**. It found stale save/calendar wording in the first pass; those findings were fixed. Final report: no remaining blocking findings in the inspected changes. This is code review, not legal approval.

## Sources and review

The implementing agent opened the current SEBI circular of 29 May 2026 and checked §7 (mandatory name/relationship and minor DOB; optional additional particulars) and Annexure A (pages 6–7), plus acknowledgement/statement rules in §§9.3/10.1. Existing HDFC MF service guidance was inspected, but the new coach does not claim to reproduce its actual form. No universal bank rules, nominee counts, allocation recommendations or institutional deadlines were added.

## Limitations and parallel-branch integration

The new coach is explicitly **English text-only**. The existing tracker still has six draft languages and recordings; updated privacy notices have draft translations but no new recordings. `nomination-coach.js` contains the isolated content/state API for the friend's language/accessibility integration. Public dictionaries and audio assets were not regenerated with invented audio. Review narration and translation before calling the expanded guide fully accessible.

No physical low-end Android, TalkBack/VoiceOver, fluent-speaker, target-user or professional legal-language review is claimed. Not every manual browser checklist scenario was re-run; unchanged validation, route and cache behavior also relies on the automated suite. Dynamic browser storage/network canary tracing was not performed; no-persistence evidence consists of source review, regression tests and observed empty reloads. Hosting logs and previous downloads remain outside app memory clearing.

Development encountered an older service worker retaining prior assets during updates. Final feature verification used a clean local origin; deployed older tabs may remain old until closed. This branch has not been deployed to production. Do not describe the existing live site as session-only until a deliberate release and migration check.

## Review artifacts

[Guide screenshot](audits/2026-10-04-nomination/nomination-guide.png), [field explanations](audits/2026-10-04-nomination/field-guide.png), [mobile practice](audits/2026-10-04-nomination/mobile-practice.png). All are synthetic examples, with no real personal records. [Guardrails](website-guardrails.md) and [current browser acceptance](../app/tests/browser-audit.md) supersede the previous personal-save workflow.
