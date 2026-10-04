# Current-release constrained navigation and local capacity evidence

Measured 4 October 2026 against published runtime **07bab9c**, production deployment **dpl_udenZ93DNyPCH6sS7h5gU475ztzw**. The frozen public manifest is **3534dbf6ec4c83d827a88cd19e94ce33825945fa43aa2a62663e40070f7cc83c**, matching the [verified deployment inputs/live source evidence](track-b-privacy-usability-scale-2026-10-04.md). No app code changed or new deployment was needed. These experiments add actual measured results for the current release; they do not certify a physical phone or the production CDN's traffic capacity.

## Physical-device availability

The narrow read-only inventory found Android platform tools but **zero connected Android devices**. No Android emulator executable was found at the known SDK paths; Xcode simulator tooling was unavailable. No debugging prompt was accepted, device data altered, app installed, paid device service connected or large SDK downloaded. [Environment record](audits/2026-10-04-capacity/environment.json).

Measurements used a **MacBook Air Mac14,2, Apple M2, eight CPU cores (four performance/four efficiency), 8 GB RAM, macOS 27.0.1, arm64, Node v26.0.0**. This is the actual test hardware, not a 2 GB Android phone. Chrome documents device mode as an approximation running on a desktop, with CPU throttling relative to that host; actual mobile architecture is not reproduced. [Chrome device-mode limitations](https://developer.chrome.com/docs/devtools/device-mode). Android documents device-dependent heap limits and low-memory process termination; a V8 heap setting does not reproduce these system conditions. [Android memory guidance](https://developer.android.com/topic/performance/memory/manage-app-memory).

## Three current-source slow navigation runs

Three fresh Chrome processes/cold browser profiles opened Hindi `/hi`. Lighthouse **13.5.0**, Headless Chrome **154.0.0.0**, mobile **360 × 800**, scale factor 1, **8× host CPU slowdown**, requested **64 MiB V8 old-space cap**. The validated loopback proxy shared **160 decimal kbps** across response bodies with **800 ms per-request delay**. Load measurements and navigation measurements ran separately. This profile does not emulate DNS/TLS/radio, uploads, packet retransmission, thermal pressure, Android background termination or native keyboard use.

| Metric | Run 1 | Run 2 | Run 3 |
| --- | ---: | ---: | ---: |
| Controls ready (`virasat-ready`) | 5.695 s | 5.568 s | 5.604 s |
| Largest contentful paint | 2.949 s | 2.747 s | 2.784 s |
| Total blocking time | 30.212 ms | 0.307 ms | 0 ms |
| Layout shift | 0 | 0 | 0 |
| Navigation transfer | 65,174 bytes | 65,174 bytes | 65,174 bytes |
| Performance score | 89 | 91 | 91 |
| Observed trace heap peak | 13.598 MiB | 28.847 MiB | 24.841 MiB |
| Observed Chrome process-tree RSS sum peak | 1,057.469 MiB | 1,088.813 MiB | 1,131.313 MiB |

Controls became ready **3/3**, median **5.604 s**; no runtime errors/warnings and **zero MP3 requests**. Automated accessibility/best-practices/SEO scores were 100, which does not certify whole-journey accessibility. TBT is navigation blocking time, not typing latency/INP. Heap and whole-Chrome RSS describe different resources: RSS includes browser/renderers/workers/audit overhead and can double-count shared pages. Peaks are sampled, not continuous maxima; neither measurement establishes physical 2 GB phone behavior.

[Raw summary](audits/2026-10-04-capacity/steady-lab/summary.json), [source manifest](audits/2026-10-04-capacity/steady-lab/source-manifest.json), [network log](audits/2026-10-04-capacity/steady-lab/network.json), [process samples](audits/2026-10-04-capacity/steady-lab/process-memory.json), compressed traces and individual Lighthouse reports are retained together. Reproduce using the existing isolated Lighthouse tool installation and a frozen public directory excluding `_headers`:

```sh
node app/scripts/performance-audit.mjs SNAPSHOT OUTPUT hi 3 steady
```

The runner now permits a specified existing profile and bounds repetitions to one through three. No new outage claim is made by this steady experiment; prior interrupted-recovery evidence retains its earlier hashes.

## Bounded local serving capacity

The current **app/server.mjs preview** served loopback HTTP/1.1 with persistent connections and gzip negotiation. It is not the Vercel server. Each synthetic cold journey issued **20 requests**: Hindi document, **15 eager assets** (CSS/favicon, actual eagerly imported module graph, selected dictionary) in batches of four, three complete public Hindi clips, then a **1,024-byte range**. Clip durations were **2.820 / 6.478 / 9.510 seconds**, totaling **18.808 seconds**. Fetching these clips without playback waits deliberately stresses delivery; this is not observed listening pace or a human account task. Preflight compared every decoded body/range with current source bytes and checked response status/length/range.

Three repeats used synthetic journey concurrency **1/3/6**, producing at most **4/12/24 simultaneous requests**, in rotated order. Each had a **5-second admission window**, maximum **20,000 requests / 128 MiB encoded body reservation**, **3-second request timeout**, **5-second drain allowance**, and **120-second global kill**. All nine completed runs stopped at the admission window, below request/byte limits. Throughput uses actual elapsed admission plus response drain (**5.000–5.007 seconds**), not the nominal window alone. Request latency spans request start to complete body receipt. Quantiles are nearest-rank per run; table medians/ranges compare three per-run results, not pooled percentiles.

| Simultaneous requests, maximum | 4 | 12 | 24 |
| --- | ---: | ---: | ---: |
| Requests/s median (range) | 3,045.8 (3,030.7–3,058.0) | 3,653.1 (3,607.4–3,724.5) | 3,752.3 (3,729.4–3,814.4) |
| Request p95 median (range), ms | 1.980 (1.950–1.986) | 4.561 (4.177–4.883) | 6.715 (6.653–8.684) |
| Request p99 range, ms | 2.086–2.107 | 5.430–5.771 | 7.921–10.133 |
| Complete synthetic journey p95 range, ms | 7.266–7.485 | 16.899–17.811 | 33.005–33.768 |
| Sampled server RSS peak range, MiB | 134.609–167.656 | 134.125–183.828 | 158.656–183.984 |

Across **nine windows / 45.024 elapsed seconds**, **157,164 requests** completed with **zero observed request errors**, delivering **1,076,738,463 encoded response-body bytes (1.076738463 decimal GB)**. This byte count excludes HTTP headers and networking framing. Partial synthetic journeys at the admission boundary are reported separately; their completed requests are included, but incomplete journeys are not counted as completed tasks. No availability percentage or long-term reliability estimate is inferred from these short windows.

Server CPU used roughly **4.76–5.89 CPU seconds per window**; client CPU **757–1,057 ms**. Client/server share the same host. Node's synchronous per-request preview compression, client generation, warm server/disk caches and loopback can constrain the result. Rising concurrency improved median request throughput modestly while increasing latency. This describes tested local-serving behavior, not a measured production saturation ceiling. Sampled server RSS excludes Chrome/phone memory and includes Node/buffers. No unrelated preview optimization was deployed as a CDN fix.

[Full local result](audits/2026-10-04-capacity/local-capacity.json) contains workload paths, per-kind latency distributions, resource samples and caps. The [pilot](audits/2026-10-04-capacity/local-capacity-pilot.json) is retained: its 1,000-request cap stopped runs in 0.28–0.39 seconds, so it served only as calibration and is excluded from sustained results. The final script adds explicit cap stop reasons/reservations; no measurement was rerun during finalization.

```sh
node app/scripts/local-capacity-audit.mjs OUTPUT_JSON
```

It binds only loopback port 4198 and never targets a public URL. Reproduction requires the checked-in current delivery inventory, matching app source, Node and the recorded local ffprobe path. No production load test, provider quota use or paid service was performed.

## Competition wording supported by these results

“On our exact published release, three cold desktop lab runs at 160 kbps/800 ms and 8× CPU slowdown reached working controls in 5.568–5.695 seconds, transferring 65.174 kB with no startup audio. A separate bounded local static-serving test completed 157,164 requests with no observed errors across nine five-second windows, including complete guidance clips and byte ranges, at up to 24 simultaneous requests.”

Keep the labels **desktop constrained-network lab** and **local static-serving benchmark** beside these numbers. Do not say “2 GB Android tested”, “24 simultaneous users”, “production handles 3,752 requests/s”, “100% availability”, or nationwide capacity. Actual physical-device results remain unavailable because no device was connected. Actual CDN capacity needs an explicitly authorized provider-budgeted traffic test; a physical phone trial needs a real accessible device. These are precise missing measurements, while the current-source results above are usable competition evidence now.
