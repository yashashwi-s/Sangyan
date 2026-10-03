# Bharat-first release acceptance

This checklist follows the user's requested scope. It is not a claim that the release is complete.

| Requirement | Evidence needed | Current status |
|---|---|---|
| Requested 21 text languages: English plus 20 scheduled languages | 21 complete, distinct packs; native names/scripts; generated routes; source and glossary checks; Bodo/Kashmiri excluded from claims and selection | 21 packs present; scope gate and 82 automated checks passed; final integrated audit pending |
| Honest text/audio support | No unsupported Listen controls; translated draft/text-only notices; public audio attribution | Fifteen complete draft audio packs integrated locally; actual text-only notices remain; final all-language browser/listening audit pending |
| Low-bandwidth evidence | Frozen source hash, raw results, defined shared bandwidth/latency, readiness metric, distributions | Nine final-source runs saved: steady readiness 3/3, median 5.556 s; recovered-cold 3/3, median 3.842 s; outage startup 0/3. See [final report](bharat-performance-final-2026-10-04.md) |
| Unstable connectivity | Requests visibly fail under scheduled outage; native retry restores controls; draft remains safe during language failure | Startup retry passed one CUA trial; retained-draft failure case passed (synthetic SBI draft, server stopped, Gujarati retry notice) |
| Low-memory evidence | Memory scope and cap described, actual samples saved; no physical-RAM equivalence claim | Final-source trace heap and Chrome RSS saved; 64 MiB V8 old-space cap explicitly distinguished from physical 2 GB hardware |
| Uncommon scripts on older devices | Licensed small fonts, selected-language download only, offline cache behavior | Fonts, offline/export tests and Meitei navigation complete; final responsive/browser check pending |
| Government-service UX patterns | Primary-source review, implemented navigation/skip/clear disclosure patterns without endorsement | Review and audio-page changes complete |
| Scalable language/voice delivery | Per-language lazy assets, bounded audio cache, review/version/ownership process | All nine new complete packs integrated; 3,213 new clips technically checked with zero failures; integrity, provenance, coverage and bounded-cache gates implemented |
| Accessibility | Keyboard, focus, reading controls, small viewport/large text, translated labels | Existing checks plus limited new-script inspection; final audit pending |
| Privacy and trust | Private entries never sent for speech/translation; submitted differs from registered; non-commercial licence | Existing tests and draft corrections; final integrated review pending |
| Publish and preserve release | Passing release gate, deployed asset verification, commit SHA and pushed branch | Not yet performed |

Run `npm run check:release` in `app` for the current 21-language scope. Structural checks are necessary but do not certify fluent language quality, legal correctness, GIGW compliance or real-device accessibility. The public UI must retain its draft disclosures until qualified reviews are completed.
