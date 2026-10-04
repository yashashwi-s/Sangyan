# Virasat journey and presentation review

Reviewed 4 October 2026. Scope: Babulal's account-paper, nomination and family-record journey, including navigation, saving, small screens, reading settings and the public evidence page. All interactive review data was fictional. No institutional request was submitted.

## Gaps corrected

| Gap | Resulting behaviour |
| --- | --- |
| Browser Back/Forward could leave the single-page journey or lose its decision context | Session navigation restores the question, account and coach checkpoint. Drafts are retained. Browser history contains opaque tokens, with route context held in memory. Cleared sessions cannot recover old private context. |
| A requested download was immediately described as saved | The list stays unsaved until the user confirms finding the file in Downloads, or an encrypted device copy succeeds. The same file can be requested again. Returning to the task preserves its position. |
| Save and unlock failures lacked actionable feedback | Saving, password and invalid-file errors point to the relevant control and preserve existing work. A stale asynchronous result cannot overwrite a later session. |
| Opening a paper guide could replace unfinished work | Paper guides open separately from the account journey. |
| Different context questions shared the same heading | Each question is now the main heading, supporting orientation and focus after navigation. |
| Home and account screens lacked a clear visual hierarchy | The home leads with one task, a local vector illustration and a visible saved-list action. Account cards emphasise the next step. The static language entry matches the interactive layout. |
| Impact was presented as a long paragraph of arithmetic | Three benefit cards, a scale scenario and expandable calculations make the story easier to follow. |

History uses opaque state because browser implementations may persist history state to disk. See [MDN: pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState). A link's download property does not establish whether a download occurred; this is why file confirmation is explicit. See [MDN: download](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download).

## Impact presentation

The visible 90-day scenario covers 1,000 eligible securities nomination cases:

- **220 additional confirmations**, approximately 620 versus an assumed 400: **55% more**.
- **305 additional family-ready records**, approximately 465 versus an assumed 160.
- **500 hours less active effort**, assuming 60 rather than 90 minutes per enrolled case: **one-third less effort**.

A 10,000-case scenario uses the same assumed rates: approximately 2,200 additional confirmations, 3,050 additional family-ready records and 5,000 hours less effort. Confirmation and family readiness overlap and are not additive.

These numbers are illustrative calculations, not observed outcomes. The exact inputs, rounding and sensitivity case remain in the public facts register. Public institutional statistics retain their periods, definitions and primary sources. No measured financial recovery, visits avoided or user completion rate is asserted.

The combined register is [all statistics](all-statistics-2026-10-04.md), generated alongside `app/dist/stats.html` and `stats.json`. It includes 75 searchable institution labels, six curated institutions, seven source routes, 21 text languages, 16 listening languages and 21 paper guides. Institution directory coverage is distinct from integration or verified transaction coverage.

## Release and browser verification

The release gate passed **167 tests, with zero failures, skipped or cancelled tests**. The complete log is [release-check.txt](audits/2026-10-04-journey-reaudit/release-check.txt). Seven new navigation and save-recovery tests cover history isolation, draft/cursor recovery, unavailable history, pending download state, explicit device protection, stale responses and attached download-link lifetime.

Interactive browser observations included:

- Keyboard selection of HDFC Mutual Fund, ownership/holding questions and its nomination preparation journey.
- Back and Forward between context questions and coach checkpoints, retaining the appropriate answer and task position.
- Required-choice errors that leave the person at the question rather than silently proceeding.
- Saving from a coach checkpoint, returning to that checkpoint and retaining the unsaved status before file confirmation.
- Reading settings at 200% text on a 320px viewport; the dialog measured 286px wide with 286px scroll width. Closing returned focus to the reading control.
- HDFC account details at 320px and 200% text: main width and scroll width were both 280px. Document width was 320px.
- Impact cards and expanded calculations at 320px: document width remained 320px.

The small-screen check follows the [W3C Reflow explanation](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). These observations do not constitute a screen-reader study or WCAG/GIGW certification.

Five final axe-core 4.13.0 scans are stored in [accessibility-corrected](audits/2026-10-04-journey-reaudit/accessibility-corrected). All found zero violations. Home, account details and the expanded evidence page had zero incomplete checks. The example overview had one incomplete contrast check for an `aria-hidden` decorative arrow; the tool could not evaluate its non-text glyph. It is not recorded as an automated pass. Earlier scan folders retain historical diagnostics, including a QA-panel overflow corrected in the final review tool; those are not final product results.

Four new save-status text labels are included in all 21 draft text packs. Existing listening clips are unchanged: 667 per supported listening language, 10,672 overall. The four new labels have no new audio recordings. Fluent language/voice quality was outside this review's scope.

## Latest navigation performance

The frozen public source manifest has SHA-256 `625f2a7e7c7516b12fc4444fdab53807b4871751d821c68226e37682081699eb`. Raw reports, traces and network settings are in [navigation](audits/2026-10-04-journey-reaudit/navigation).

Conditions: official desktop Chrome for Testing 138.0.7204.183 on macOS arm64, Hindi, 360 × 800 viewport, 8× host-relative CPU slowdown, 64 MiB V8 old-space cap, 384 kbps aggregate response bodies and 200ms fixed request latency.

| Cold start | Controls ready | Navigation transfer | Layout shift | Lighthouse performance |
| --- | ---: | ---: | ---: | ---: |
| 1 | 2.818 seconds | 111,342 bytes | 0 | 98 |
| 2 | 3.028 seconds | 111,342 bytes | 0 | 97 |
| 3 | 2.601 seconds | 111,342 bytes | 0 | 100 |

Median controls-ready time: **2.82 seconds**. Navigation transfer: approximately **111 KB**, excluding optional listening and later task requests. Each navigation received Lighthouse accessibility, best-practices and SEO scores of 100; this applies to the audited entry, not every application screen. There were no runtime errors or Lighthouse warnings in these three runs.

After measurement, only `stats.css`, `stats.html` and `stats.json` changed from the manifest. Application runtime assets are identical to the measured snapshot. The evidence-page polish is not included in its navigation measurement. Earlier performance and compatibility results remain separately dated in the combined register.

## Remaining verification boundaries

No matching eight-year-old 2 GB Android phone or real-device account was available. Desktop CPU limits, heap limits and a mobile viewport do not reproduce total phone RAM, an old processor or Android file/print/audio behaviour. The response proxy does not reproduce upload speed, radio, DNS or TLS. The matching physical-device statement remains a design target.

The browser automation download event timed out, so completed file delivery is not claimed as a browser acceptance result. Encryption/restoration logic and save-state behaviour passed the release checks; the user must confirm the file exists. Browser storage denial keeps work unsaved and displays recovery guidance.

Virasat prepares and tracks an institution's steps. The institution controls acceptance, authenticated access, required documents, confirmation and remedy. The directory is not an API connection to those services. No real-user outcome or institutional acceptance was tested.
