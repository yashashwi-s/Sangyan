# Final-source Bharat performance evidence

Historical published-source measurement: 4 October 2026. A subsequent Nepali/startup recovery release is described in [startup recovery evidence](startup-recovery-2026-10-04.md); the source identifiers and measurements below remain tied to the earlier 15-audio build.

Date: 4 October 2026. The measured and published public snapshot contains **21 text languages and 15 complete draft audio languages**. Its SHA-256 manifest identifier is `378b5ab2e9fb2fc44f5865d951fe9ac55698eb4c788d45d6a8405ba35d66cbff`; every public file matched the corrected release at commit `7d9d350`. Measurements below apply to this exact source. The [3 October report](bharat-performance-evidence.md) and [earlier 4 October measurement](audits/2026-10-04-final-lab/compact-evidence.json) are separate historical source evidence. The repeated final run includes the native-script numeral correction.

The nine Lighthouse navigation runs opened `/hi`, with three fresh Chrome processes and cold profiles per network condition. They did not enter private information, complete account tasks, save a draft, switch languages or play audio. [Raw results](audits/2026-10-04-published-lab/summary.json), [compact metrics](audits/2026-10-04-published-lab/compact-evidence.json), the [source manifest](audits/2026-10-04-published-lab/source-manifest.json), compressed traces, network logs and process-memory samples are retained together. All 68 non-MP3 public assets were individually compared against production, alongside all native entry routes and a complete MP3 sample per audio language; see [live checks](audits/2026-10-04-production/live-public-serving.json).

## Conditions

Lighthouse 13.5.0 and Chrome 154 used a 360 × 800 mobile viewport, device scale factor 1 and real-time DevTools 8× host CPU slowdown. Chrome requested a 64 MiB V8 old-space cap; this does not cap total browser memory or reproduce a physical phone. The same loopback proxy and validated shared response-body bandwidth apparatus described in the [interim report](bharat-performance-evidence.md) were used.

The steady profile shared 160 kbps across downloads and added 800 ms per-request delay. The changing profile started at 256 kbps/600 ms, changed at one second to 96 kbps/1,000 ms, disconnected at three seconds for three seconds (dropping in-flight response bodies), resumed at 128 kbps/900 ms and changed at twelve seconds to 256 kbps/600 ms. The recovered profile was a new cold navigation at 256 kbps/600 ms. Bandwidth uses decimal kbps. Uploads, DNS/TLS/radio behavior, retransmissions and physical-device thermal/memory conditions were not emulated.

## Navigation results

All nine audits completed without Lighthouse runtime errors or warnings. A completed audit is distinct from a usable application startup.

| Median (range), three runs per profile | Steady severe | Changing with outage | Recovered cold |
|---|---:|---:|---:|
| Largest contentful paint | 2.896 s (2.683–3.371) | 3.053 s (3.005–3.331) | 1.903 s (1.867–1.908) |
| Controls ready, `virasat-ready` | 5.606 s (5.482–5.688), 3/3 | **Absent, 0/3** | 3.855 s (3.841–3.918), 3/3 |
| Total blocking time | 29.91 ms (0–44.24) | 0 ms | 0 ms (0–21.70) |
| Layout shift | 0 | 0 | 0 |
| Navigation transfer | 63,124 bytes | 26,919 bytes (25,197–26,919), incomplete startup | 63,124 bytes |
| Lighthouse performance score | 90 (84–92) | 88 (85–89), incomplete startup | 98 |

Automated accessibility and SEO scores were 100 throughout. Best-practices scores were 96 during interruption and 100 otherwise. These scores do not certify accessibility, legal correctness, translation understanding or completion of a financial task. Lower transfer during interruption is a failed download, not a performance improvement. TBT is not a field typing-latency or INP measurement.

The interruption prevented the initial module graph from finishing in all three runs. The native introduction and translated reload/retry link are part of the generated HTML and remain available without the application scripts. An earlier, separate CUA trial verified manual retry on the same interrupted page; it is documented in the interim report. No new final-source interactive retry trial was performed: this continuation had no enabled browser surfaces. Recovered-cold success here proves only that a fresh navigation works after connectivity returns, not automatic recovery of the failed page or private-draft survival after Android terminates a tab.

No MP3 was requested during any of the nine navigation runs. This is evidence that optional audio remains lazy at startup; it does not measure playback startup, stalls, intelligibility or accent. The fifteen-language audio coverage is backed separately by [complete-pack technical validation](audits/2026-10-04-audio-candidates/complete-pack-metrics.json) and [public HTTP coverage checks](audits/2026-10-04-audio-candidates/serving-all-fifteen.json).

## Observed memory

Trace heap counters and operating-system Chrome process-tree RSS samples measure different resources. Samples are observed peaks, not continuous true maxima. Trace counters include instrumented audit activity and may cover multiple processes. RSS sums include browser, renderer, worker and other Chrome processes and can double-count shared pages.

| Per-run observed peak, MiB | Steady severe | Changing with outage | Recovered cold |
|---|---|---|---|
| Trace `jsHeapSizeUsed` | 21.175 / 28.423 / 25.420 | 26.713 / 20.070 / 19.320 | 8.564 / 7.515 / 26.918 |
| Chrome process-tree RSS sum | 1,082.656 / 1,081.750 / 1,031.422 | 1,047.562 / 1,095.109 / 1,146.703 | 1,194.578 / 1,282.672 / 1,170.297 |

The substantial browser RSS is retained rather than presenting only the smaller heap number. Neither a 64 MiB old-space setting nor these diagnostic desktop samples establish performance on a physical 2 GB Android phone. Physical-device testing still needs TalkBack, large text, the on-screen keyboard, save/unlock with many accounts, optional audio, background termination and repeated connectivity interruptions.

## Reproduce and release limits

Use the checked-in `app/scripts/performance-audit.mjs` runner with a frozen copy of public `app/dist`, a temporary tool installation containing `lighthouse@13.5.0` and `chrome-launcher`, and `VIRASAT_AUDIT_TOOLS` pointing to those build-only tools:

```sh
node app/scripts/performance-audit.mjs SNAPSHOT OUTPUT_DIRECTORY hi 3
```

The final public directory contains 5,424 files totaling 102,549,565 bytes (97.799 MiB); the largest file is 150,069 bytes. All 5,355 MP3 recordings total **100,779,936 bytes** across fifteen languages. This is server-side release storage, not each person's download: successful Hindi navigation transferred **63,124 bytes**, with **zero MP3 requests**. The isolated deployment excluded build-only models, Python dependencies, translation/audio source reports, tests and audit traces. Vercel accepted the supported compressed CLI archive (reported upload 85.1 MB), extracted 5,424 public/configuration files, completed the static build and assigned the production alias. No hosting upload-limit failure occurred.

The current release passes 84 automated checks and all 21 text routes/15 audio languages passed live HTTP checks, including MP3 partial-content delivery, privacy headers and exact source comparisons. Production is [sangyan-xi.vercel.app](https://sangyan-xi.vercel.app), deployment `dpl_8kpj7QruDcaAro3KT4VF6s37u3iC`; [deployment evidence](audits/2026-10-04-production/deployment.json) records the ready status and source identifier. Translation and synthetic voice disclosures remain necessary. New audio packs have complete technical integrity/decoding evidence; no fluent-reviewer or auditory intelligibility signoff was obtained. Final interactive browser checks remain separate human evidence.
