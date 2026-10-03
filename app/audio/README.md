# Bundled public instructions

The app plays small MP3 recordings in English, Hindi, Bengali, Marathi, Tamil and Urdu. It never sends user text to a speech service and never depends on an installed device voice. Browser media playback and a connection for a clip's first use are required. Recently played clips are cached where service workers and browser storage work; eviction/private browsing can remove that cache.

These are **prototype synthetic recordings, not fluent-speaker-approved voices**. Meta MMS supplies one language-specific voice per model. The English model is not an Indian-accent guarantee. Regional script coverage and explicit pronunciation spellings prevent important Latin menu labels from disappearing. Comprehension, naturalness and accent suitability need target-user listening review; an automated waveform check cannot prove them.

## Rebuild

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

The release currently has 21 written languages and six audio languages. `export-audio-text.mjs` defaults to the six released languages. For another supported text language, use a separate output, for example `node app/scripts/export-audio-text.mjs --language gu --output /private/tmp/virasat-gu-audio-public.json`. A candidate export never enables listening or replaces the released source. See [the verified expansion plan](../../docs/audio-expansion-plan-2026-10-04.md) for model/script/licence checks and the remaining synthesis/pronunciation steps.
