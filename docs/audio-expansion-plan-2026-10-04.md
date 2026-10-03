# Audio expansion checkpoint — 4 October 2026

The current release scope is 21 written languages: English plus 20 scheduled languages, excluding Bodo and Kashmiri. The locally integrated release now has fifteen bundled draft recording languages: English, Hindi, Bengali, Marathi, Tamil, Urdu, Gujarati, Punjabi, Kannada, Telugu, Malayalam, Assamese, Odia, Dogri and Maithili. All nine added packs are complete and technically validated; no fluent/accent/meaning approval is claimed. Candidate model availability is not released audio coverage. All existing voices and translations remain drafts pending fluent-reader/listener review.

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

## Actual staged synthesis, 4 October continuation

The isolated runtime is now installed at `/private/tmp/virasat-audio-env`; all nine public models were downloaded into `/private/tmp/virasat-mms-candidates`. Pinned revisions, model/tokenizer checksums and licence metadata are retained in `app/audio/candidate-model-sources.json`. Dependency versions are locked in `app/audio/requirements-lock.txt`. Neither dependencies nor model weights are inside the website payload.

All nine languages produced seven representative sample clips. Every sample passed text/hash/provenance checks, mono 24 kHz MP3 inspection, duration checks and complete FFmpeg decode. All 357 fixed public keys per candidate passed tokenizer preflight after explicit phonetic approximations described below. This is technical integrity evidence, not a listening/comprehension approval. Fluent review is false throughout.

| Candidate | Initially affected public keys | Build-only phonetic aliases |
| --- | --- | --- |
| Gujarati | 21 | `ઍ→એ`, `ઑ→ઓ`, `ઔ→અઉ`, `ૅ→ે`, `ૉ→ો` |
| Dogri | 26 | `ऑ→ओ`, `ऽ→'` |
| Maithili | 54 | `ऑ→ओ`, `ॉ→ो` |

These mappings approximate sounds missing from a model alphabet; they are pronunciation risks, not evidence that pronunciation is correct. The written dictionary remains unchanged by them. The other six candidates needed no character aliases. Native number names and Latin institution/acronym spellings are explicit in `pronunciation-candidates.json`, remain unreviewed, and are never silently discarded. A fluent listener must check loan vowels, avagraha, financial words, identifiers and meaning before an intelligibility or accent-quality claim.

The text pass also removed four trailing `२.` batch artifacts from Maithili optional-field labels and replaced Dogri's untranslated “OR” and incorrect literal balance wording in the statement-evidence explanation. The current written build and immutable addresses were regenerated and tested.

Sample recordings, reports and preflight logs are retained under `docs/audits/2026-10-04-audio-candidates/`, outside the deployed assets. The samples use the non-commercial Meta MMS models credited above. Source text, media hashes and model licences are in each sample report. No candidate has been added to public `audioLanguages` or `audioCatalog`.

### Resumable build commands

From the repository root:

```sh
python3 app/scripts/prepare-audio-runtime.py --environment /private/tmp/virasat-audio-env
python3 app/scripts/prepare-audio-models.py --models /private/tmp/virasat-mms-candidates
/private/tmp/virasat-audio-env/bin/python app/scripts/run-audio-candidates.py --models /private/tmp/virasat-mms-candidates --staging /private/tmp/virasat-audio-stage --phase sample
python3 app/scripts/validate-audio-candidates.py --staging /private/tmp/virasat-audio-stage
/private/tmp/virasat-audio-env/bin/python app/scripts/run-audio-candidates.py --models /private/tmp/virasat-mms-candidates --staging /private/tmp/virasat-audio-stage --phase full
python3 app/scripts/validate-audio-candidates.py --staging /private/tmp/virasat-audio-stage --complete
npm --prefix app run check:release
```

The runner records phase results and failures in staging `progress.json`, keeps per-language logs and reuses checksum-matching clips for the same revision. `--language gu` selects one candidate without overwriting other public dictionaries. Model preparation accepts only the fixed nine public Meta repositories and rejects gated/private access, wrong licences and unsafe tensor formats. The generator rejects candidate source text that differs from the current public dictionary. These commands synthesize and validate staging assets; they do not promote coverage or deploy.


## Integration gates added during the complete-pack build

The complete nine-language batch runs sequentially, with its state in `/private/tmp/virasat-audio-stage/progress.json`. Gujarati finished its 357 clips in 194 seconds and Punjabi in 223 seconds; this is observed build time on this computer, not a playback or phone benchmark. Gujarati's independent complete-file validation recorded 5,859,328 bytes and 1,411.582 seconds of MP3 audio, with zero technical failures. Other packs must complete and pass their own checks before integration.

`promote-audio-candidates.py` re-exports current public copy, rejects changed copy or incomplete manifests, decodes every real staged MP3 and checks its pinned model, licence and pronunciation revision before copying selected complete packs. Its `--check` mode leaves the website unchanged. A seven-clip sample report was deliberately rejected by this gate. Runtime packages and model weights remain outside the app. Integration is local and does not deploy.

```sh
/private/tmp/virasat-audio-env/bin/python app/scripts/promote-audio-candidates.py --staging /private/tmp/virasat-audio-stage --language gu --language pa --check
# After all selected packs pass and release disclosures/credits are updated, omit --check.
```

The service-worker audio matcher now derives its allowed languages from the release registry instead of a hardcoded six-language expression. All played clips remain lazy and share the same 12 MiB / 256-entry cache budget, including after additional languages are enabled. Help and listening settings display the current language's checked coverage label, entry/privacy explanation and synthetic-voice notice; non-English help also shows the translation-review limit. No old `voiceHelp` count or unavailable-audio claim is rendered. The automated guide-route checks now use every effective released dictionary rather than just the original six. All 80 release tests passed after these changes.

For the integrated UX audit, the CUA inventory in this continuation returned no enabled app/browser surfaces; both Chrome and in-app-browser entry attempts reported unavailable. No new interactive-browser or real-device result is claimed. The GIGW quick tips and myScheme accessibility statement were re-read on 4 October 2026 and continue to support synchronized content, keyboard access, clear headings, skip navigation and explicit limitations. This is design guidance, not government certification. Actual mobile, screen-reader, fluent-reader/listener and intended-user checks remain pending.


Coverage and model attribution in the public audio credits page are now generated from the checked real recording manifests, including their pinned model revisions. This keeps available-language claims, licence attribution and the registry aligned. The page retains synthetic/unreviewed, entry-privacy, on-demand download, bounded caching, non-commercial use and no-endorsement disclosures. All 81 release checks passed after this change. The sequential build and its complete-file validation watcher remain outside the website.


## First complete-pack integration checkpoint

Gujarati, Punjabi, Kannada and Telugu have been copied into the local public asset tree after the promotion gate decoded all 1,428 recordings and checked exact current text, pinned models, licence metadata, media hashes and synthesis revisions. This adds 28,901,056 bytes of actual MP3s; it does not add any speech model or Python package to the website. The registry, generated catalog, current public-copy export and credits agree on ten audio languages. The same six text-only languages remain unsupported for audio, and the other five MMS candidates continue generating in staging; neither partial candidate assets nor unverified language labels are exposed.

The release command now always runs the audio integrity/provenance builder before generating the offline shell version and checking translations/tests. Candidate revisions are recalculated from exact text, pronunciation rules, pinned model metadata and generator version. Editing a pronunciation rule without rebuilding its clips therefore fails the release gate.

These files are synthetic unreviewed drafts. Technical decoding is not evidence of accent, fluency or correct understanding. This assistant runtime does not support audio input, so no auditory judgment is claimed. The recorded Gujarati phonetic-alias risk remains outstanding. Publication has not occurred at this checkpoint.


## All nine complete packs integrated

The batch completed all nine candidates successfully. The complete-file validator checked all **3,213 new MP3s**, with zero failures. The final five packs then passed the current-copy promotion gate and were integrated locally. They add 34,313,888 bytes; all nine additions total **63,214,944 bytes**. The complete local release has **15 audio languages and 5,355 clips**. Public HTTP checks passed all 21 language pages and all 15 audio routes with valid media byte ranges, immutable caching and privacy headers. See [complete validation](audits/2026-10-04-audio-candidates/validation-complete.json), [actual pack metrics](audits/2026-10-04-audio-candidates/complete-pack-metrics.json), [batch phases/timing](audits/2026-10-04-audio-candidates/full-build-progress.json) and [public serving checks](audits/2026-10-04-audio-candidates/serving-all-fifteen.json).

Nepali, Konkani, Meitei, Sanskrit, Santali and Sindhi remain text-only. Bodo/Kashmiri remain excluded from the 21-language release. Each added recording pack uses its verified public ungated model and pinned source metadata; all runtime dependencies and model weights stayed outside the website. Synthetic/draft, non-commercial licence, privacy, per-language coverage and pronunciation-risk disclosures remain present. This is a complete technical draft-audio checkpoint, not a listening study. No publication has occurred.
