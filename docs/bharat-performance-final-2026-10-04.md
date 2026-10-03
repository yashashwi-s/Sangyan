# Final-source Bharat performance evidence

Date: 4 October 2026. The measured public snapshot contains **21 text languages and 15 complete draft audio languages**. Its SHA-256 manifest identifier is `a8849e795a78f588106d08e24a5c3650d53402515c80e4bea054175f3a6d0e05`; every public file matched the integrated release at commit `78913e0`. Measurements below apply to this exact source. The [3 October report](bharat-performance-evidence.md) is separate historical interim evidence.

The nine Lighthouse navigation runs opened `/hi`, with three fresh Chrome processes and cold profiles per network condition. They did not enter private information, complete account tasks, save a draft, switch languages or play audio. [Raw results](audits/2026-10-04-final-lab/summary.json), [compact metrics](audits/2026-10-04-final-lab/compact-evidence.json), the [source manifest](audits/2026-10-04-final-lab/source-manifest.json), compressed traces, network logs and process-memory samples are retained together.

## Conditions

Lighthouse 13.5.0 and Chrome 154 used a 360 × 800 mobile viewport, device scale factor 1 and real-time DevTools 8× host CPU slowdown. Chrome requested a 64 MiB V8 old-space cap; this does not cap total browser memory or reproduce a physical phone. The same loopback proxy and validated shared response-body bandwidth apparatus described in the [interim report](bharat-performance-evidence.md) were used.

The steady profile shared 160 kbps across downloads and added 800 ms per-request delay. The changing profile started at 256 kbps/600 ms, changed at one second to 96 kbps/1,000 ms, disconnected at three seconds for three seconds (dropping in-flight response bodies), resumed at 128 kbps/900 ms and changed at twelve seconds to 256 kbps/600 ms. The recovered profile was a new cold navigation at 256 kbps/600 ms. Bandwidth uses decimal kbps. Uploads, DNS/TLS/radio behavior, retransmissions and physical-device thermal/memory conditions were not emulated.

## Navigation results

All nine audits completed without Lighthouse runtime errors or warnings. A completed audit is distinct from a usable application startup.

| Median (range), three runs per profile | Steady severe | Changing with outage | Recovered cold |
|---|---:|---:|---:|
| Largest contentful paint | 2.689 s (2.624–2.857) | 3.115 s (2.947–3.151) | 1.883 s (1.864–1.895) |
| Controls ready, `virasat-ready` | 5.556 s (5.371–5.608), 3/3 | **Absent, 0/3** | 3.842 s (3.791–3.870), 3/3 |
| Total blocking time | 2.56 ms (0–30.16) | 0 ms | 0 ms (0–13.63) |
| Layout shift | 0 | 0 | 0 |
| Navigation transfer | 62,975 bytes | 26,647 bytes, incomplete startup | 62,975 bytes |
| Lighthouse performance score | 92 (90–92) | 88 (87–89), incomplete startup | 98 |

Automated accessibility and SEO scores were 100 throughout. Best-practices scores were 96 during interruption and 100 otherwise. These scores do not certify accessibility, legal correctness, translation understanding or completion of a financial task. Lower transfer during interruption is a failed download, not a performance improvement. TBT is not a field typing-latency or INP measurement.

The interruption prevented the initial module graph from finishing in all three runs. The native introduction and translated reload/retry link are part of the generated HTML and remain available without the application scripts. An earlier, separate CUA trial verified manual retry on the same interrupted page; it is documented in the interim report. No new final-source interactive retry trial was performed: this continuation had no enabled browser surfaces. Recovered-cold success here proves only that a fresh navigation works after connectivity returns, not automatic recovery of the failed page or private-draft survival after Android terminates a tab.

No MP3 was requested during any of the nine navigation runs. This is evidence that optional audio remains lazy at startup; it does not measure playback startup, stalls, intelligibility or accent. The fifteen-language audio coverage is backed separately by [complete-pack technical validation](audits/2026-10-04-audio-candidates/complete-pack-metrics.json) and [public HTTP coverage checks](audits/2026-10-04-audio-candidates/serving-all-fifteen.json).

## Observed memory

Trace heap counters and operating-system Chrome process-tree RSS samples measure different resources. Samples are observed peaks, not continuous true maxima. Trace counters include instrumented audit activity and may cover multiple processes. RSS sums include browser, renderer, worker and other Chrome processes and can double-count shared pages.

| Per-run observed peak, MiB | Steady severe | Changing with outage | Recovered cold |
|---|---|---|---|
| Trace `jsHeapSizeUsed` | 7.540 / 7.383 / 17.563 | 26.321 / 19.820 / 13.160 | 29.417 / 19.503 / 14.504 |
| Chrome process-tree RSS sum | 1,111.719 / 1,240.375 / 1,334.219 | 1,036.516 / 1,089.328 / 1,135.297 | 1,217.703 / 1,202.906 / 1,279.516 |

The substantial browser RSS is retained rather than presenting only the smaller heap number. Neither a 64 MiB old-space setting nor these diagnostic desktop samples establish performance on a physical 2 GB Android phone. Physical-device testing still needs TalkBack, large text, the on-screen keyboard, save/unlock with many accounts, optional audio, background termination and repeated connectivity interruptions.

## Reproduce and release limits

Use the checked-in `app/scripts/performance-audit.mjs` runner with a frozen copy of public `app/dist`, a temporary tool installation containing `lighthouse@13.5.0` and `chrome-launcher`, and `VIRASAT_AUDIT_TOOLS` pointing to those build-only tools:

```sh
node app/scripts/performance-audit.mjs SNAPSHOT OUTPUT_DIRECTORY hi 3
```

The final public directory contains 5,424 files totaling 102,549,227 bytes (97.799 MiB); the largest file is 150,069 bytes. This is server-side release storage, not the navigation download above. Deployment staging must exclude build-only models, Python dependencies, translation/audio source reports, tests and audit traces. Confirm the hosting upload limit and actual deployment packaging before publishing; no quota failure has been observed in this continuation.

The current release passes 82 automated checks and all 21 text routes/15 audio languages passed local HTTP checks, including MP3 partial-content delivery. Translation and synthetic voice disclosures remain necessary. New audio packs have complete technical integrity/decoding evidence; no fluent-reviewer or auditory intelligibility signoff was obtained. Final interactive browser checks and deployed-source verification remain separate release work.
