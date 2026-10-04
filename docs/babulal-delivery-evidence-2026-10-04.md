# Babulal: completed gaps and defensible delivery claims

Reviewed 4 October 2026. Scope: the local Virasat Track B prototype, focused on a retired person with old account papers, uncertain nomination status and difficulty following institutions. No real-user trials, institutional outcomes or fluent-language assessment were performed. The numbers below are technical measurements or explicitly labelled arithmetic. Earlier reports remain historical snapshots.

## The story the product now supports

Babulal finds an old fund statement. He needs to identify the holding, find the correct institution, ask whether nomination is registered, prepare a request if necessary, keep its receipt, understand a rejection, check the resulting record and leave usable instructions for a chosen family member. Completing a form is only one part of that journey.

The product gives him one next action at a time. Institution rules, private case details and advanced complaint stages sit behind optional disclosures. It distinguishes finding an account, submitting a request, receiving a reply, checking registered details and preparing a family handover. Each observation is his report; the app cannot authenticate an institution's record.

| Pain point | What is implemented | Evidence and boundary |
|---|---|---|
| Old papers do not say where to start | Separate mutual-fund MITRA/MFCentral, bank UDGAM and share/dividend IEPF orientation; found, not found and unable-to-search outcomes | Routing regressions pass. A negative search is not proof that no holding exists; discovery still happens at the official service. |
| Technical information overwhelms the first action | Familiar-paper entry, one setup question at a time, account-specific next action, optional detailed guidance | Observed desktop journey with fictional accounts; comprehension is unmeasured. |
| A request receipt looks like completion | Receipt and registration remain separate. Claiming intended details requires three explicit checks: correct account, intended people and other intended details | Tests reject incomplete detail checks and downgrade older unsupported claims. New confirmations reset previous checks. |
| A rejection leaves no clear next move | Private worksheet for the problem, requested fix, corrected field, exact reason, evidence supplied and next action; separate evidence-location note | Bounded fields survive encrypted saves and remain excluded from the readable family sheet. |
| Complaint replies and deadlines are confusing | Separate entity and designated-body SCORES review stages, each with a receipt-date-based 15-day reminder; expired, waiting and unknown states | Deterministic date tests. Ordinary replies do not start the ATR reminder; bank cases have a separate route. Official portal instructions govern action. |
| Family members cannot act from a vague account list | Deliberate family summary and helper checklist, separate from registration; asks the helper to attempt the tasks independently | Fictional browser handover inspected. Passwords, OTPs and private evidence stay off the sheet. The sheet grants no legal authority. |
| Small text, lost answers and difficult recovery | 44-pixel controls, larger help text, text/contrast/spacing controls, wrapping narrow layouts, linked error summary with focus and retained answers | Final 320-pixel/200% confirmation inspection plus axe scans; scope detailed below. |
| Connection or JavaScript is unavailable | Script-free written guides in 21 text languages; startup and help links; selected guide can be cached for later offline use | All 21 guide artifacts checked; service-worker cache regressions pass. First visit, official portals and an uncached language still require connectivity. |
| Listening might exhaust data/storage | Fixed public recordings requested on demand; bounded shared audio cache; private entries never become recording requests | Exact clip-body totals and cache tests below. Recordings decode, but pronunciation quality is unreviewed. |

The HDFC Mutual Fund handoff now links its revised public nomination form, effective 1 September 2026, alongside the official service instructions. The inspected form separates mandatory and optional fields and requires all joint holders' signatures where applicable. Acknowledgement still does not establish registration. Sources: [HDFC MF service](https://www.hdfcfund.com/services/registration-of-nominee), [forms directory](https://www.hdfcfund.com/services/forms), [revised form](https://files.hdfcfund.com/s3fs-public/2026-08/Nomination%20Registration%20Form%20310826%20V1%20(Revised).pdf), [SCORES](https://scores.sebi.gov.in/).

## Government-service patterns adopted

These are published practices and inspected service patterns, not a ranking of the “best” portals or proof of their nationwide usability.

| Primary reference | Useful pattern | Applied in Virasat |
|---|---|---|
| [GIGW accessible forms](https://guidelines.india.gov.in/designing-accessible-and-usable-forms/) | Clear labels, understandable errors, logical focus and alternatives | Linked error summary, field-level messages, preserved answers, written alternative. The account application still needs JavaScript; its paper guide does not. |
| [S3WaaS](https://s3waas.gov.in/) | Reusable responsive presentation and reading controls | Consistent controls, contrast, spacing and text settings; narrow-screen choice rows fixed after an actual overflow was found. |
| [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/) | Focus the error summary and link errors to their inputs | Error title prefix, focused summary and links to the relevant field or first unchecked intended-detail check. |
| [GOV.UK check answers](https://design-system.service.gov.uk/patterns/check-answers/) and [confirmation](https://design-system.service.gov.uk/patterns/confirmation-pages/) | Review before completion; explain the following action | Explicit evidence checks and a next action, with receipt, registration and family review kept separate. |
| [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Narrow content should remain readable without two-dimensional scrolling | Inspected the confirmation form at 320 CSS pixels and 200% text, with contrast and extra spacing enabled. |

Automated accessibility results do not establish WCAG/GIGW conformity or STQC certification. Language quality is deliberately outside this hackathon review.

## Measured network and memory behaviour

Tool: **Lighthouse 13.5.0**, desktop headless Chrome 154, 360 × 800 CSS-pixel mobile viewport, device scale 1, 8× CPU slowdown, a **64 MiB V8 old-space limit**. Three independent cold runs per profile, **12 total**, selected Hindi start screen. All runs reached the ready marker without a Lighthouse runtime error. Layout shift was zero; the home-page automated accessibility score was 100 in all runs.

| Response-body network profile | Ready times, seconds: all three runs | Median ready | Largest-contentful-paint range |
|---|---|---:|---:|
| 1,600 kbps; 150 ms fixed request latency | 2.277 / 1.810 / 1.743 | **1.810 s** | 1.808–2.363 s |
| 160 kbps; 800 ms fixed request latency | 7.986 / 7.757 / 7.860 | **7.860 s** | 7.808–8.055 s |
| Changing speed with a three-second outage | 5.547 / 5.411 / 5.531 | **5.531 s** | 5.491–5.618 s |
| Fresh navigation after availability returns: 256 kbps / 600 ms | 5.579 / 5.534 / 5.606 | **5.579 s** | 5.603–5.666 s |

The changing profile starts at 256 kbps/600 ms; at one second it becomes 96 kbps/1,000 ms; offline from seconds three to six; then 128 kbps/900 ms, then 256 kbps/600 ms at second twelve. Its ready marker can precede the end of the outage because already-delivered resources suffice. This is not proof that every operation works through an outage. “After availability returns” runs use a fresh browser, not the same failed page.

The proxy shapes aggregate response bodies and adds fixed request latency. It does **not** emulate cellular uplink, radio, DNS, TLS, an actual carrier or a physical device. The faster profile uses the download/latency magnitudes associated with Lighthouse's upper-3G/lower-4G reference; do not describe it as a full cellular 3G test. [Lighthouse throttling documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md).

Peak sampled used JavaScript heap per run ranged from approximately **7.30 to 28.61 MiB**. This is sampled Chrome trace evidence, not total browser or phone RAM. The 64 MiB limit applies to V8 old space, not all allocations. The host benchmark index was recorded in each run; CPU slowdown is relative to that host and cannot identify the age of an equivalent phone. [Chrome CPU calibration documentation](https://developer.chrome.com/docs/devtools/settings/throttling).

**Do not claim “works on an eight-year-old 2 GB phone.”** No such phone, Android emulator or old-browser engine was tested. Current Chrome requires Android 10 or later; Chrome 138 was the last supported version for Android 8/9. Age and RAM alone cannot establish compatibility. The app also needs ES modules, Web Crypto and native dialogs. Sources: [Chrome requirements](https://support.google.com/chrome/a/answer/7100626?hl=en-EN), [Android 8/9 support notice](https://support.google.com/chrome/thread/352616098/sunsetting-chrome-support-for-android-8-0-oreo-and-android-9-0-pie?hl=en-GB).

## Data use and bounded storage

Decimal KB means 1,000 bytes; MiB means 1,048,576 bytes. These categories must not be interchanged.

| Measurement | English | Hindi | Interpretation |
|---|---:|---:|---|
| Selected-language eager app bodies, each file gzip-compressed | 91,761 bytes | **97,576 bytes** | File inventory, excluding worker installation, headers, retries and optional audio. Across all 21 routes the maximum is 109,281 bytes. |
| Lighthouse navigation transfer, stable/recovered profiles | Not tested in this run | **106,698 bytes** | Recorded start-page network transfer, approximately 107 KB; not a complete nomination task. Changing-profile runs used 131,873–133,044 bytes. |
| Four specified home instruction clips | 97,425 bytes | **118,833 bytes** | Additional cold MP3 file bodies when those clips are requested. |
| Seventeen specified core nomination clips, including the child explanation | 303,572 bytes | **383,828 bytes** | Exact listed clip sum; not measured typical listening or a complete user journey. |
| Script-free paper HTML alone, gzip | 1,595 bytes | **2,308 bytes** | Shared CSS/font and network overhead are additional. |

The public release contains 10,764 files totalling 238,855,244 bytes, principally the full multilingual audio library. **A user does not download that entire catalog on arrival.** Only the selected text language/font loads, and audio is requested on demand. Cache response-body ceilings are 8 MiB for the public shell and 12 MiB/256 entries for audio; browser metadata and eviction are separate.

Private workspaces are bounded to 50 accounts, 20 nomination events and 20 support events per account, a 1 MiB plaintext save and 2 MiB import. A synthetic maximum fixture including the new private fields was **542,316 bytes** plaintext and **723,275 bytes** encrypted. Three desktop Node WebCrypto round trips recovered it exactly; sealing took 186–324 ms and unlocking 160–173 ms. This does not measure Android import, keyboard latency or tab eviction.

## Accessibility and scale evidence

The final axe-core **4.13.0** scans recorded zero violations and zero unresolved checks on the inspected home and expanded confirmation screens. The confirmation was inspected at **320 × 800**, **200% text**, high contrast and extra spacing. No inspected app element extended beyond the viewport. The diagnostic-only JSON panel could widen the QA page; it is excluded from that observation and never ships. Automated testing covers a subset of accessibility requirements. [axe-core](https://github.com/dequelabs/axe-core).

The full release check passed **160/160 tests**. All **4,960 newly generated supplemental MP3 files** decoded without error. Neither result proves understandable speech or senior task completion.

Nine bounded loopback HTTP runs at one, three and six simultaneous synthetic asset journeys completed **99,802 requests**, with zero reported request errors. Six-journey concurrency runs had request p95 latencies of **11.83–15.07 ms**. This exercises the local static server, public files and range audio delivery; it is not a production CDN, internet load or concurrent human-session capacity test.

For planning only: one million independent cold Hindi text loads at the measured gzip-body inventory imply **97.576 GB** before overhead. Assuming another 1 MiB of audio per session adds **1,048.576 GB**. That audio volume is a scenario assumption. Browser reuse, CDN policy, charges and quotas need a deployment-specific assessment; no “supports one million users” claim follows.

## Pitch wording supported by this build

- “The Hindi start screen transferred about **107 KB** in our controlled browser test. Optional listening downloads separately.”
- “Across **12 cold lab runs** with **8× CPU slowdown**, the app reached its ready state, including a **160 kbps / 800 ms** profile with a **7.86-second median**. These are desktop browser simulations.”
- “The inspected confirmation form worked at **320-pixel width and 200% text**, with zero automated axe violations; **160 release tests passed**.”

Use these as delivery measurements. **Recovered money, fewer visits, nomination completion, reduced rejection and time saved for Babulal remain unmeasured.** Existing public problem-scale data and scenario models are documented in [the Track B reassessment](track-b-reassessment-2026-10-04.md); they must not become app outcome claims.

## Reproducible evidence and release identity

Final public source SHA-256: `2b255a132d85daaa9ea915c463e9d3328de6e3cdde07da47d82dc1ff00857491`. Performance, delivery inventory and loopback-capacity evidence share this hash. Tests use synthetic records. No official account changes, complaints or recoveries were submitted.

- [Final performance summary](audits/2026-10-04-babulal/performance-verified/summary.json); accompanying per-run Lighthouse JSON, compressed trace/devtools logs, network logs and process-memory samples.
- [Delivery inventory and scenarios](audits/2026-10-04-babulal/delivery-scale.json), [loopback capacity](audits/2026-10-04-babulal/local-capacity.json), [bounded private workspace](audits/2026-10-04-babulal/workspace-scale.json).
- [Exact audio and paper sizes](audits/2026-10-04-babulal/audio-paper-data.json), [audio decode check](audits/2026-10-04-babulal/audio-decode.json).
- [Final axe scans](audits/2026-10-04-babulal/accessibility-verified/03.json), [layout observation](audits/2026-10-04-babulal/layout-observation.json), [release test log](audits/2026-10-04-babulal/release-check.txt), [completed preview](audits/2026-10-04-babulal/completed-preview.jpg).

Local preview: `http://127.0.0.1:4322/`. This build has not been publicly deployed. The review server and diagnostic output are outside the public release allowlist.
