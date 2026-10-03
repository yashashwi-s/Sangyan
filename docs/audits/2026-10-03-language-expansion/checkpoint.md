# Unreleased integration checkpoint

This is work in progress, not evidence of completed 22-language support.

- 21 language packs currently build: English plus 20 scheduled languages.
- Bodo (`brx`) and Kashmiri (`ks`) remain missing. The all-language checker deliberately fails until both are genuinely translated.
- All 21 packs contain 369 strings: 364 existing public UI strings and five coverage/search notices. Native scripts and complete keys do not establish translation quality.
- New languages show draft status and text-only audio availability. Existing six audio languages remain unchanged.
- 287 stray translation-batch numeric prefixes were removed from Sanskrit. The Assamese/Nepali/Odia/Sanskrit editorial pass subsequently completed, including nominee and deceased-holder transfer terminology. Do not publish the drafts as validated financial guidance.
- 65 automated tests pass after rebuilding. This verifies tested app logic and structural contracts, not fluent comprehension, all-script rendering, or real-phone readiness.
- Local Noto Meetei Mayek and Ol Chiki subsets are included with OFL licences, requested for the selected script and cached with that language. Full browser/offline verification remains outstanding.
- Changing-network smoke testing found scripts can fail before startup while the introduction remains visible. Entry pages now expose a native-language retry anchor without requiring JavaScript. The final interruption/retry test remains outstanding.
- Final performance measurements, integrated browser re-audit, deployment, commit and push are not complete.

Subagents stopped after usage-limit and application-network-permission errors. Their saved artifacts were preserved. These interruptions do not make the goal complete.

## Subsequent local checks

- 68 automated tests now pass, including selected-script font caching, source-snapshot alignment and licensed font-file integrity.
- CUA browser inspection on a fresh local origin opened the Meitei entry, displayed native draft/text-only notices, searched the language dialog by English name and switched successfully to Sindhi. This is a limited navigation/visual check, not comprehension testing.
- A fresh nine-navigation performance run was started against a frozen 21-language snapshot in `../2026-10-03-expanded-lab/`. Its source manifest identifies precisely what was measured; do not relabel it as the final 23-language release.

## Integration fixes verified by 72 automated tests

Native retry labels now cover every built pack before its full dictionary loads. Saved Meitei/Santali HTML embeds its font and OFL licence. Worker activation preserves exact current cached language revisions and script assets. Changed or obsolete translations are not silently reused. These fixes require a new final-source performance run once the two missing languages are available.

## Scope revision on 4 October 2026

The user excluded Bodo and Kashmiri from the release. The supported registry and completeness gate now require exactly 21 text languages: English plus 20 scheduled languages. Earlier references above to a 23-language target and missing-pack blockers describe the historical checkpoint, not the current acceptance criterion. Final audits must use the current build; the interim 21-language snapshot remains evidence only for its recorded source hash.
