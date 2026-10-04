# Bharat performance evidence

Date: 3 October 2026. This report records a reproducible desktop-browser lab exercise of Virasat. It does **not** establish that the product runs reliably on a physical 2 GB Android phone, all unstable mobile networks, or every translated journey. The previous [low-bandwidth audit](low-bandwidth-audit-2026-10-03.md) remains a historical six-language release audit; its numbers must not be attributed to this expanded release.

## What was measured

The interim snapshot at `/private/tmp/virasat-expanded-audit-snapshot` was copied before all language packs were complete: **21 entry pages**, including English, and not yet all 22 scheduled languages. Its SHA-256 manifest identifier is `d9b385e4ad33132f4e52550c4fded3814847dd7a3055b414a0546f501b9c01ac`. Findings below apply only to that exact snapshot. Later generated packs or shell changes require another source manifest and measurement; an interim report is not final-release evidence.

The runner opens only `/hi`. It performs Lighthouse navigation audits; it does not interact with account forms, enter real data, play audio, save records or claim field interaction latency. Each profile receives three fresh Chrome processes and cold user directories. Reports preserve raw Lighthouse JSON, gzip-compressed traces, DevTools network logs, response-body request records and operating-system process-memory samples. Actual browser interaction checks use CUA separately.

| Setting | Configuration and limit |
|---|---|
| Browser/tool | Lighthouse 13.5.0, installed Chrome 154; exact host/mobile user agents and CPU benchmark index retained in every report |
| Viewport | 360 × 800 CSS pixels, mobile viewport, device scale factor 1 |
| CPU | Lighthouse real-time DevTools 8× slowdown relative to the host; no calibration to a named 2 GB phone |
| JavaScript memory constraint | Chrome launched with `--js-flags=--max-old-space-size=64`; this requests a 64 MiB V8 **old-space** cap, not a total heap, renderer, browser or device RAM cap |
| Download bandwidth | One shared token budget across concurrent response bodies, updated every 20 ms; decimal kbps |
| Latency | Per-request delay applied by the loopback proxy; not packet-level round-trip latency |
| Outage | Drop outstanding response bodies and fail new requests during a scheduled three-second disconnect |
| Transport | Local HTTP and gzip text; no mobile DNS/TLS/radio, packet retransmission, UDP, upload bandwidth, thermal throttling, background apps or battery conditions |
| Content accounting | Request logs count emitted response-body bytes including public worker installation activity where observed; Lighthouse transfer accounting differs and includes its own network bookkeeping |

The proxy's profile clock starts at the first request after reset, avoiding unrelated Lighthouse startup delay. The schedule is deterministic; page timings and the exact requests interrupted vary with host scheduling. Google's [throttling documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) distinguishes proxy shaping from packet-level testing and explains that CPU multipliers depend on host performance. These settings are a severe repeatable approximation, not a claim to reproduce a whole mobile network or a specific handset.

## Network profiles

| Profile | Time from first navigation request | Shared download | Request delay | Availability |
|---|---|---:|---:|---|
| Steady severe | Entire navigation | 160 kbps | 800 ms | Online |
| Changing | 0–1 s | 256 kbps | 600 ms | Online |
| Changing | 1–3 s | 96 kbps | 1,000 ms | Online |
| Changing | 3–6 s | 0 | 0 | Disconnect; in-flight downloads fail |
| Changing | 6–12 s | 128 kbps | 900 ms | Online |
| Changing | After 12 s | 256 kbps | 600 ms | Online |
| Recovered cold | New, independent navigation | 256 kbps | 600 ms | Online |

The recovered-cold profile is a new navigation after connectivity returns. It does not prove that the failed page automatically resumed or that a private draft survived an operating-system tab eviction. A separate CUA check verified the visible retry action on the same failed startup in **one trial**. [Browser result](audits/2026-10-03-expanded-retry/browser-result.json) and [request log](audits/2026-10-03-expanded-retry/network.json) record Hindi introduction and a native retry link while controls were disabled after interruption. After the connection recovered, the reviewer clicked that visible Hindi retry link and observed an enabled account-start button plus home, language, reading and listening controls. [Recovered screen](audits/2026-10-03-expanded-retry/recovered-home.png) documents the result. This is manual retry in one desktop browser trial, not automatic recovery, a physical Android result, a timed recovery distribution or a measured user task-completion rate.

## Audit apparatus validation

[Proxy self-check](audits/2026-10-03-bharat-smoke/proxy-self-check.json) passed. Two simultaneous 20,000-byte synthetic public files took **2,755 ms** together under 160 kbps plus 800 ms request latency, consistent with one shared 40 KB transfer budget. A 128,000-byte synthetic file was interrupted at **3,005 ms** after 38,654 emitted bytes. A later 100-byte `206` range request completed after service recovery. These fixture checks validate the test proxy, not Virasat's audio playback.

## Interim navigation observations

All nine navigation runs completed without a Lighthouse runtime error or run warning. Host CPU benchmark indices ranged from 2,795 to 3,045; the 8× multiplier was not calibrated against a physical target phone. Raw reports are retained in [the expanded lab evidence directory](audits/2026-10-03-expanded-lab/summary.json). These are completed **interim-snapshot** medians, not final-release medians.

| Metric: median (range), three runs each | Steady severe | Changing with outage | Recovered cold |
|---|---:|---:|---:|
| First/largest visible content | 2.735 s (2.588–2.859) | 2.820 s (2.820–3.641) | 2.057 s (1.876–2.330) |
| Controls ready, `virasat-ready` | 5.358 s (5.295–5.715) | **Absent in 3/3 runs** | 3.818 s (3.799–3.870) |
| Total blocking time | 8.3 ms (0.5–295.0) | 0 ms | 55.4 ms (11.0–106.2) |
| Layout shift | 0 | 0 | 0 |
| Lighthouse performance score | 91 (84–93) | 91 (82–91), incomplete startup | 96 (95–98) |
| Navigation transfer | 58,170 bytes (identical) | 24,687 bytes (24,325–26,979), incomplete download | 58,170 bytes (identical) |
| Emitted response bodies, entire recorded run | 58,955 bytes (identical) | 23,031 bytes (21,090–23,382), incomplete download | 58,955 bytes (identical) |

The steady and recovered samples scored 100 in Lighthouse's automated accessibility, best-practices and SEO categories. All changing-network runs scored accessibility 100, best-practices 96 and SEO 100. These are automated checks and do not establish accessibility certification or usable controls. TBT varies between steady runs, including a 295 ms sample; all samples are included. Visible-content timing does not stand in for controls ready, and TBT does not establish field INP or typing speed.

The initial changing-network observations are a warning against using a page score as a completion verdict. Introductory text remains visible even when the initial module graph is interrupted. The `virasat-ready` mark is absent in the failed startups; controls are not ready, despite high Lighthouse performance scores. A native translated retry link was added to generated entries so a person can request the page again after connectivity returns without relying on the failed script. This provides a recovery action; it does not remove the need to retry or prove uninterrupted first use.

No MP3 requests occurred in the observed navigation runs. That supports optional audio at startup; it does not measure streaming quality, audible start time, stalls or pronunciation. The uncommon-script fonts are bundled locally: Meetei Mayek **8,896 bytes**, Ol Chiki **4,896 bytes**, regular 400, script subsets with SIL OFL 1.1. [Font source metadata](../app/dist/fonts/SOURCES.json) records exact official URLs and hashes. Hindi navigation cannot establish the cost or rendering quality of those two scripts; a chosen-language check is necessary.

## Memory evidence and what it cannot prove

The runner extracts `jsHeapSizeUsed` counters from the standard Lighthouse trace and samples the launched Chrome process tree with the operating system every 500 ms. These are observed samples, not continuous true maxima. Trace counters can belong to more than one Chrome process and include Lighthouse's own instrumented audit activity. Whole-tree RSS includes the browser, renderer, worker and other Chrome processes; sums can double-count shared pages. RSS peaks during an accessibility/diagnostic audit are not equivalent to a person's steady app memory.

| Observed per-run peak: median (range), three runs each | Steady severe | Changing with outage | Recovered cold |
|---|---:|---:|---:|
| Trace `jsHeapSizeUsed`, MiB | 13.63 (7.54–24.13) | 9.16 (7.21–23.33) | 7.39 (7.36–7.40) |
| Chrome process-tree RSS sum, MiB | 1,076.47 (1,040.48–1,156.22) | 1,120.89 (915.31–1,131.39) | 1,079.47 (999.67–1,136.69) |
| Largest individually sampled renderer RSS, MiB | 219.94 (206.28–264.78) | 229.06 (193.64–232.56) | 212.47 (194.05–220.75) |

The surprisingly large whole-browser RSS is retained instead of presenting only the smaller JavaScript heap number. Audit overhead, shared-page accounting and multiple Chrome processes mean these columns measure different resources. The requested old-space cap and observed trace heap are not total browser-memory budgets. The absent readiness mark in the changing profile means that lower transfer or heap cannot be counted as successful resource savings.

A bounded old-space launch does not reproduce Android's total available memory, GPU allocation, allocator behaviour, low-memory killer, storage eviction or background-tab lifetime. Browser memory below 2 GB would still not prove a usable experience on a 2 GB phone. Account-list rendering, keyboard typing, 50-account encryption save/unlock, audio playback and returning after Android kills the tab need direct measurement on physical hardware.

## Reproduce and interpret

Audit scripts live in `app/scripts/performance-network.mjs`, `performance-audit.mjs`, `performance-preview.mjs` and `performance-proxy-check.mjs`. Install `lighthouse@13.5.0` and `chrome-launcher` in a temporary tools directory, provide its path with `VIRASAT_AUDIT_TOOLS`, copy the entire completed public `app/dist` to a frozen directory, then run:

```sh
node app/scripts/performance-audit.mjs SNAPSHOT OUTPUT_DIRECTORY hi 3
```

The audit serves only the snapshot on loopback, changes only its own proxy profile, uses standard Lighthouse navigation and never issues custom page automation or raw CDP commands. `performance-preview.mjs` exposes an audit-only loopback reset endpoint for independent CUA outage/retry checks. It is not a public production endpoint.

Google recommends considering [performance as a distribution](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), rather than one score. Report all three runs, medians and ranges for each profile separately. Do not compare these proxy results directly with historical request-level or simulated Lighthouse numbers as though they were the same experiment. A null readiness mark under outage is a failed interactive startup, even when paint metrics or the aggregate score look good.

## Remaining release evidence

Complete final-source measurements for the revised 21 text entries (English plus 20 scheduled languages, excluding Bodo and Kashmiri). Check selected Meetei Mayek/Ol Chiki font bytes and offline reuse. The single CUA startup-retry trial is recorded above; repeat it on the final source, and separately verify a retained draft through an uncached-language retry. Then test actual 2 GB Android hardware with TalkBack, a small screen and keyboard, 50 accounts, save/unlock, optional audio, repeated outages and background tab termination. Fluent reviewers and intended users remain necessary for translation, voice understanding and independent task-completion claims.
