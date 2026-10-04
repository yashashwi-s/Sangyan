# Bundled public instructions

The app offers 21 text languages and plays small MP3 recordings in 16: English, Hindi, Bengali, Marathi, Tamil, Urdu, Gujarati, Punjabi, Kannada, Telugu, Malayalam, Assamese, Odia, Dogri, Maithili and Nepali. Konkani, Manipuri/Meitei, Sanskrit, Santali and Sindhi remain text-only. It never sends user text to a speech service and never depends on an installed device voice. Browser media playback and a connection for a clip's first use are required. Recently played clips are cached where service workers and browser storage work; eviction/private browsing can remove that cache.

These are **prototype synthetic recordings, not fluent-speaker-approved voices**. Meta MMS supplies fifteen language-specific packs; Nepali uses the separately attributed Piper Chitwan voice. The English model is not an Indian-accent guarantee. Regional script/phoneme checks prevent unsupported symbols from being silently dropped; documented phonetic aliases remain pronunciation risks. Comprehension, naturalness and accent suitability need target-user listening review; an automated waveform check cannot prove them.

## Rebuild the original six MMS packs

1. In an isolated Python environment install `requirements.txt`; install FFmpeg from its official distribution.
2. Download `config.json`, `tokenizer_config.json`, `vocab.json`, `special_tokens_map.json` and `model.safetensors` from the pinned Meta model repositories/revisions in the six `recordings-*.json` files. Put each model in a directory named for its ISO code (`eng`, `hin`, `ben`, `mar`, `tam`, `urd-script_arabic`). Include `source.json` containing that report's `model` object.
3. Run `node app/scripts/export-audio-text.mjs`.
4. Run `python app/scripts/generate-audio.py --models /path/to/models`.
5. Run `node app/scripts/build-audio.mjs`. This refuses stale/missing recordings and writes the small public catalog.
6. Run the tests and audit the actual audio before release. A text revision changes the audio-directory hash. Replace recordings with fluent-reviewed narration using the same catalog contract; do not add a runtime external service that sends entries.

Only the public dictionary is accepted by the build. Reports retain normalized spoken text, source revision, text and audio checksums, duration, size and the unreviewed flag. Reports and model weights are not deployed. The browser downloads only a requested clip, not a language pack or model. Mono 24 kHz MP3 at 32 kbps targets bandwidth and broad playback compatibility.

## License and provenance

Generated using Meta AI's [Massively Multilingual Speech](https://github.com/facebookresearch/fairseq/tree/main/examples/mms) VITS checkpoints: [English](https://huggingface.co/facebook/mms-tts-eng), [Hindi](https://huggingface.co/facebook/mms-tts-hin), [Bengali](https://huggingface.co/facebook/mms-tts-ben), [Marathi](https://huggingface.co/facebook/mms-tts-mar), [Tamil](https://huggingface.co/facebook/mms-tts-tam), [Urdu](https://huggingface.co/facebook/mms-tts-urd-script_arabic). Models are licensed **CC BY-NC 4.0**; see the linked model cards and [license](https://creativecommons.org/licenses/by-nc/4.0/). Keep this prototype and recordings non-commercial. Attribution: Vineel Pratap et al., Meta AI, *Scaling Speech Technology to 1,000+ Languages* (2023), [paper](https://arxiv.org/abs/2305.13516). Virasat supplies the instruction text, pronunciation mappings, synthesis, normalization and compression; Meta does not endorse Virasat. No person's voice was cloned for this project.

## Expansion staging

`export-audio-text.mjs` now defaults to all sixteen released languages, 357 fixed public strings each. The nine additional MMS packs are rebuilt with `prepare-audio-runtime.py`, `prepare-audio-models.py`, `run-audio-candidates.py`, complete validation and promotion, described in [the expansion checkpoints](../../docs/audio-expansion-plan-2026-10-04.md). Nepali has its own provider pipeline below. Candidate exports require a separate output and do not enable listening or replace released source. After all recordings match current text/model/rules, run `npm --prefix app run check:release` to verify the complete registry/catalog/credits and rebuild the offline shell. Every advertised language must have all real files; a changed label alone fails release checks.


## Separate Nepali voice provider

Nepali uses the public pinned Piper Chitwan medium voice (MIT repository metadata, CC0 dataset), distinct from the fifteen Meta MMS packs. Piper 1.8.0/GPL-3.0 is build-only. Model weights and dependencies are never public assets. The exact 357-key source, no-alias phoneme preflight, independent full MP3 validation and model/card hashes are retained. See [source/licensing/build steps and review limits](../../docs/audio-remaining-languages-2026-10-04.md). No fluent listening or semantic certification is claimed.

## Guided learning and persona-support recordings

An independent supplemental corpus contains the 111 retained fixed guided-learning strings and 157 simplified journey/persona-support strings: 268 per audio language, alongside the earlier 357 clips. `support-public-text.json` is generated from the committed guidance/resilience translations by `export-support-audio.mjs`. Both supplemental generators reject arbitrary input and require the exact current public corpus. MMS synthesis uses the same fifteen pinned models; Nepali uses the same independent Piper model. `support-pronunciation.json` spells otherwise unsupported public acronyms/digits explicitly. Model-vocabulary/phoneme checks fail on missing symbols. These are pronunciation drafts, not certified translations or naturalness checks.

Generate each MMS language with `generate-support-audio.py --models /pinned/models --language LANGUAGE --source app/audio/support-public-text.json --staging /outside/the/app`; generate Nepali separately with `generate-support-piper-ne.py --models /pinned/ne --source app/audio/support-public-text.json --staging /outside/the/app`. Stage directories keep models and intermediate artifacts out of the deployed output. Copy only the complete reported MP3 revision directories and reports into `dist/audio/LANGUAGE/support-REVISION/` and `audio/support-recordings-LANGUAGE.json`. Build/release checks verify every text/audio hash, key, duration, model revision, license and unreviewed disclosure before publishing the supplemental catalog.

The browser matches visible fixed public text to a bundled same-origin clip. Private complaint notes, names and account references are excluded. Supplement clips share the existing 12 MiB/256-entry cache, range playback and retry controls; no speech model is shipped to the user. Unchanged recordings can be reused across text revisions only after matching text, spoken normalization, model, pronunciation rules and audio checksum.
