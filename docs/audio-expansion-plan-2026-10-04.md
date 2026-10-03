# Audio expansion checkpoint — 4 October 2026

The current release scope is 21 written languages: English plus 20 scheduled languages, excluding Bodo and Kashmiri. Only English, Hindi, Bengali, Marathi, Tamil and Urdu have bundled recordings. Candidate model availability is not released audio coverage. All existing voices and translations remain drafts pending fluent-reader/listener review.

## Concrete build changes

The public-audio exporter now uses the effective language dictionaries rather than the original fixed six-language table. Its default output remains exactly the existing six-language, 357-key public source. A candidate language requires a separate `--output` path and cannot overwrite that released source. It accepts only registered language codes and fixed public UI keys; arbitrary text, account values and user files are not inputs.

The audio catalog builder now checks the current audio-language registry against the public source before inspecting every recording's text hash, media hash, duration and byte count. A candidate is not enabled by changing a label alone. The release asset test also requires the advertised audio languages, real catalog and source languages to agree. Translation draft disclosure is independent of audio availability for every non-English language; adding recordings cannot imply fluent translation approval.

## Verified candidates

The following primary Meta model cards were inspected on 4 October 2026. They identify the named language and CC BY-NC 4.0 model licence. These public cards support a build-time evaluation route under the existing non-commercial scope. No candidate weights were downloaded or inference performed during this checkpoint.

| Interface | Model | Current state |
| --- | --- | --- |
| Gujarati `gu` | [facebook/mms-tts-guj](https://huggingface.co/facebook/mms-tts-guj) | Candidate; Gujarati pronunciation mapping and synthesis needed |
| Punjabi `pa` | [facebook/mms-tts-pan](https://huggingface.co/facebook/mms-tts-pan) | Eastern Punjabi candidate; verify Gurmukhi tokenizer and spoken financial terms |
| Kannada `kn` | [facebook/mms-tts-kan](https://huggingface.co/facebook/mms-tts-kan) | Candidate; normalization and synthesis needed |
| Telugu `te` | [facebook/mms-tts-tel](https://huggingface.co/facebook/mms-tts-tel) | Candidate; normalization and synthesis needed |
| Malayalam `ml` | [facebook/mms-tts-mal](https://huggingface.co/facebook/mms-tts-mal) | Candidate; normalization and synthesis needed |
| Assamese `as` | [facebook/mms-tts-asm](https://huggingface.co/facebook/mms-tts-asm) | Candidate; check Assamese letters and bank names |
| Odia `or` | [facebook/mms-tts-ory](https://huggingface.co/facebook/mms-tts-ory) | Candidate; verify standard Odia spelling against tokenizer |
| Dogri `doi` | [facebook/mms-tts-dgo](https://huggingface.co/facebook/mms-tts-dgo) | Candidate; verify Devanagari tokenizer and financial pronunciation |
| Maithili `mai` | [facebook/mms-tts-mai](https://huggingface.co/facebook/mms-tts-mai) | Candidate; verify Devanagari tokenizer and financial pronunciation |

For Nepali, Konkani, Meitei, Sanskrit, Santali and Sindhi, this checkpoint did not establish a matching usable MMS checkpoint for the exact written script. Failed page fetches are not evidence that no model exists. Keep these six text-only until exact language/script support and real recordings are verified.

[AI4Bharat Indic Parler-TTS](https://huggingface.co/ai4bharat/indic-parler-tts) lists official support for 20 of the current 21 interface languages; Punjabi is explicitly unofficial support. Its model card lists Apache 2.0 and Indian-English accent capability, but file access currently requires accepting contact-sharing conditions. No gate was bypassed and no account acceptance was performed. If legitimately available later, evaluate a consented/licensed named voice against the same public text, checks and target-user criteria.

[BHASHINI](https://bhashini.gov.in/) offers registration for language-service access. Its [model directory](https://dibd-bhashini.gitbook.io/bhashini-apis/available-models-for-usage) and [pipeline configuration documentation](https://bhashini.gitbook.io/bhashini-apis) can establish specific TTS service IDs and language availability after authorized access. Verify downloadable-output rights, cost, available voices, script and service terms before using it. Send only fixed public instructions during build time; introduce no runtime account-data or password service.

## Next implementation sequence

1. Start with Gujarati, then Kannada/Telugu/Malayalam and Punjabi. Prioritization is an implementation judgment based on verified cards and available draft text, not a measured quality ranking. Export a candidate with `node app/scripts/export-audio-text.mjs --language gu --output /private/tmp/virasat-gu-audio-public.json`.
2. Prepare an isolated build environment using `app/audio/requirements.txt`, FFmpeg and a compatible Python. Default Python in this session has no Torch, Transformers or NumPy; FFmpeg is present. A shallow, task-specific check of `/private/tmp`, the workspace root and `app` found no prepared model/environment directory. This does not establish that none exists elsewhere. Do not scan private data to find one.
3. Pin the official model revision and retain source/licence metadata. Add the exact model code and per-language number/Latin-name spellings to the synthesis configuration. The current generator intentionally knows only six models and six pronunciation columns; changing the candidate export alone is insufficient.
4. Generate a small set first: account introduction, nominee explanation, unknown/missing distinction, request receipt versus registration, deceased-holder scope and password/privacy. Reject unsupported letters and missing pronunciation entries rather than dropping tokens. Inspect waveforms and have a fluent listener assess meaning and accent. Human review should identify a reviewer/date and text revision before any reviewed claim.
5. Generate the complete 357 public keys and retain text/media hashes, duration, size, source revision and explicit draft status. If wording such as `voiceHelp` changes to describe new playable coverage, regenerate affected audio from that exact text. Candidate media must remain outside the release catalog until complete. Enable the language only when actual files and checks agree, then update audio credits and readable support notices together.
6. Repeat mobile Listen/pause/retry/read-along, weak-connection, offline-repeat and cache-budget checks using the final source. Keep first-use media on demand and the existing 12 MiB/256-recording cache limit. Recheck all current six languages to catch catalog regressions.

## Checkpoint evidence

`npm run check:release` passed 77 tests, all 21 text dictionaries, exact registry checks, content hashes, immutable locale addresses and the 16 KB compressed per-language text budget. `node app/scripts/build-audio.mjs` independently verified the six released recording sets. This is structural/build evidence, not proof of fluent translation, pronunciation, government accessibility certification or physical low-memory-device performance. No deployment was performed.
