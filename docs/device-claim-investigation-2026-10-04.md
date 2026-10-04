# Older-phone / 3G claim investigation

4 October 2026. The team has no matching physical phone or real-device-cloud account. The product now includes the requested specification as a **design target with its verification status visible beside it**. It does not assert a completed physical-device result.

## What was actually run

Downloaded Google's official **Chrome for Testing 138.0.7204.183, macOS arm64** from its published milestone download manifest. Chrome 138 is the final generation supporting Android 8/9, but this executable is a desktop build. Google's [download project](https://github.com/GoogleChromeLabs/chrome-for-testing) and [Android support notice](https://support.google.com/chrome/thread/352616098/sunsetting-chrome-support-for-android-8-0-oreo-and-android-9-0-pie?hl=en-GB) establish its provenance and relevance, not physical-phone equivalence.

Three cold browser-native suites each passed **52/52 checks**: **156 successful executions, 52 distinct checks**, not 156 distinct features. Checks include:

- Required browser APIs: ES-related helpers, native-dialog API, Web Crypto, download/MP3 capability and storage APIs.
- Nomination transitions across bank, demat and fund accounts; incomplete/invalid data; blocked, opt-out and correction states.
- Exact institution matching, six curated providers, Zerodha's correction path and general fallbacks.
- Both SCORES ATR review stages, expiry, bank separation and the leap-year reminder.
- Private correction/evidence exclusion from the family sheet and helper-readiness invalidation.
- Preparation checkpoints and entry orientation.
- All 21 effective language packs (679 public keys each) and public-audio routing, including exclusion of private values.
- Old-holding referrals, audio-control state transitions with a mock media element, and browser storage of a fictional test key.
- The maximum synthetic workspace: 50 accounts, 20 nomination events and 20 support events per account, retained drafts and learning checkpoints; **542,316 plaintext bytes**. It encrypted/decrypted exactly in the browser; wrong passwords and malformed envelopes were rejected.

Conditions: **384 kbps aggregate response-body delivery, 200 ms fixed request latency, 8× host-relative CPU slowdown, 64 MiB V8 old-space cap**, 360 × 800 mobile viewport. The 384 kbps setting follows the download magnitude of Android's documented UMTS/3G preset. The local proxy does not emulate the preset's upload path, radio, DNS or TLS. [Android emulator network options](https://developer.android.com/studio/run/emulator-commandline).

The suite's finishing used-JavaScript-heap observations were **64.30, 50.68 and 40.20 MiB**, while retaining all 21 language dictionaries and running maximum-workspace encryption. These are point observations, not peaks or total phone RAM. A 64 MiB old-space limit is not a 64 MiB total heap: Chrome reported a 160 MiB overall heap limit in this configuration.

Lighthouse sets a mobile user-agent string for its mobile run. The core JSON therefore contains an Android-looking user agent; the accompanying Lighthouse **hostUserAgent identifies macOS HeadlessChrome 138**. The actual binary came from the official mac-arm64 package. No Android OS, 2 GB guest RAM or aged handset CPU was running.

Three cold **Hindi app navigations** in the same older desktop browser reached controls ready at **2.897 / 2.531 / 2.950 seconds**, median **2.897 seconds**. Navigation transfer was **106,738 bytes** each. Lighthouse 13.5.0 reported no runtime errors, zero layout shift and automated home-page accessibility score 100. These are start-page tests, not full task-completion measurements. Maximum sampled used JS heap across those starts was about **17.44 MiB**; trace sampling does not establish a continuous memory peak.

The current release check also passed **160/160 tests**, zero failures. The original test-server attempt incorrectly served `.mjs` modules as an unknown MIME type, so the runner never executed. It was corrected and all three verified suites rerun. Those failed setup attempts are archived separately and are not counted as passing evidence.

## Rendered UI under slow delivery

An isolated local proxy was reviewed in the normal in-app desktop browser at 360 × 800, using 384 kbps response delivery and 200 ms fixed request latency. With fictional accounts, the observed sequence reached the mutual-fund task, selected registration evidence, retained date/location entries, rejected missing intended-detail checks with a linked focused error, then saved after all three checks were selected. The resulting view reported the checked record and offered the family-record next action.

The Listen button entered its loading/pause/read-along state. Later the review page changed task; completed audible playback was not established by that observation. This is not an all-function rendered-UI acceptance run. The older-engine suite's audio state test uses a mock element and its MP3 probe only checks declared capability. No screen-reader or language-quality review was performed.

## Function coverage and remaining device claims

| Function area | Available evidence | What remains unverified on the requested phone |
|---|---|---|
| Cold start and selected-language delivery | Three older-engine starts and earlier 12 constrained starts | Actual Android/browser/aged CPU and available 2 GB system RAM |
| Account creation, status and nomination checks | Core transition/validation checks; rendered fictional confirmation review; release regressions | Every rendered branch, typing/keyboard and interruption on that phone |
| Official routes and old-holding guidance | Core routing, source inspections and release tests | External portals' login, CAPTCHA, submission and hardware accessibility |
| Correction notes and review reminders | Core privacy, save/restore and date checks | Phone typing, date entry and all rendered states |
| Family handover | Core exclusion/readiness checks and earlier fictional desktop observations | A recipient's independent use and phone layout |
| Encrypted save/restore | Exact maximum fixture browser crypto; wrong-password rejection | File download/import UI, Android file picker, persistence after OS tab termination |
| Audio | All fixed-clip decode/checksum tests, routing and mocked controls; loading observed | Actual complete playback, pause/seek, network recovery and offline replay on that phone |
| Paper/offline fallback | 21 script-free artifacts and cache regressions | Android cache eviction and all offline reopening states |
| Readability/accessibility | Earlier 320px/200% text confirmation and axe scans | Full screen-reader, focus, keyboard and all-language rendered acceptance |
| Print/PDF/calendar | Existing generation/release checks | Android print dialog, exported-font rendering and calendar import |

This table is the reason the phrase **“operable at all functions on an eight-year-old 2 GB RAM phone on a 3G network” cannot be reported as a passed result** from these tests. It is a testable target. A mobile viewport, altered user agent or JavaScript heap cap cannot manufacture the missing hardware evidence.

## Credible tools researched

| Tool | Useful capability | Availability and claim limit |
|---|---|---|
| [BrowserStack Live](https://www.browserstack.com/docs/live/network/network-simulation) | Real devices with preset/custom bandwidth, latency and packet loss | Published network simulation requires Team/Team Pro/Enterprise plans. No account/session is available; verify a matching old 2 GB device before booking. Offline mode has separate OS restrictions. |
| [Android official emulator](https://developer.android.com/studio/run/emulator-commandline) | Virtual RAM setting and UMTS/3G network preset | Useful for Android compatibility. It still executes on host hardware and cannot reproduce the performance of a specific 2018 handset. SDK platform tools are present here; no emulator binary or system image is installed. No emulator run is claimed. |
| [WebPageTest FAQ](https://github.com/catchpoint/WebPageTest.docs/blob/main/src/webpagetest-faqs.md) | Reproducible navigation/performance tests | Its current FAQ recommends mobile emulation. This alone cannot verify the phone's RAM, age or every function. |
| [LambdaTest / TestMu network testing](https://www.lambdatest.com/support/docs/network-throttling/) | Supported network profiles and cloud test environments | Need an account, exact device selection and applicable plan. No device session was run. |
| [Google Chrome for Testing](https://github.com/GoogleChromeLabs/chrome-for-testing) | Pinned browser engine for reproducible local checks | Used successfully here; desktop engine evidence only. |

A concrete reference handset is the Redmi 6A: Xiaomi's [specifications](https://www.mi.com/in/redmi-6a/specs/) identify 2 GB RAM and a quad-core Helio A22. Its [manufacturer user guide](https://alsgp0.fds.api.xiaomi.com/gl123/Redmi/Redmi%206A/%E9%87%8F%E4%BA%A7/Redmi%206A%3DGUID-12D09DF2-0DD1-485A-A2D8-F79DB1F302E2%3D1%3Den%3D.pdf) identifies the 2018 model/date code. We did not test one. RAM sold with a phone is not all available to its browser. HTTPS is needed for Web Crypto and service workers outside trustworthy loopback origins.

## Product wording and evidence

Visible on the new statistics page:

> Device target: all app functions on an eight-year-old Android phone with 2 GB RAM and a 3G connection.

The adjacent status says **“Design target — not verified on a matching physical phone.”** A separate paragraph gives the passed older-engine checks and network measurements. The qualification stays beside the target rather than being hidden in a footnote.

Measured public snapshot SHA-256: `ba43e3703ffae66e90633cca7b6a170f75241be1509bdf436982fe8f250f613f`. The subsequent evidence-page update changes its own files; tested runtime modules and selected-language entries remain the same. No prototype was publicly deployed during this investigation.

Raw results: [core summary](audits/2026-10-04-device-claim/core-chrome138-verified/summary.json), [core cases](audits/2026-10-04-device-claim/core-chrome138-verified/core-1.json), [navigation summary](audits/2026-10-04-device-claim/navigation-chrome138/summary.json), [manual network log](audits/2026-10-04-device-claim/interactive-network.json), [release log](audits/2026-10-04-device-claim/release-check.txt). Scripts: `app/scripts/browser-core-audit.mjs`, `browser-core-checks.mjs`, `interactive-network-review.mjs` and `performance-audit.mjs`. Test pages, collectors, downloaded browsers and diagnostics are excluded from the public release.

All institution counts, language/recording counts, public observations, scenarios, data/storage limits and dated lab results are consolidated in [all statistics](all-statistics-2026-10-04.md), the product's `/stats.html`, and downloadable `/stats.json`. The evidence page is reached through Privacy & help and loads on demand.
