# Remaining-language audio investigation — 4 October 2026

This continuation investigates the six languages that were text-only in deployment `dpl_8kpj7QruDcaAro3KT4VF6s37u3iC`. Public model names alone do not establish playable coverage. No private input, gated-model acceptance, restricted-provider retry or access workaround was used.

| Language and written script | Primary-source finding | Concrete disposition |
| --- | --- | --- |
| Nepali, Devanagari | Public [Piper Chitwan medium voice](https://huggingface.co/rhasspy/piper-voices/tree/c10ece1aade47bb51c153c893d14e5bf8e5b7117/ne/ne_NP/chitwan/medium), language `ne_NP`, eSpeak voice `ne`, mono 22,050 Hz; voice repository metadata declares MIT and its model card declares CC0 for the [OHF dataset](https://github.com/OHF-Voice/voice-datasets). | Independent pinned ONNX build route implemented. All 357 exact public texts have phoneme coverage without aliases. Seven critical samples and a full pack were synthesized separately from the website; complete validation/promotion evidence accompanies the release. No fluent listening approval. |
| Manipuri/Meitei, Meitei Mayek | Official [Indic-TTS release](https://github.com/AI4Bharat/Indic-TTS/releases/tag/v1-checkpoints-release) lists a public `mni.zip` checkpoint, 1,518,195,233 bytes. The [official model declaration](https://github.com/AI4Bharat/Indic-TTS/blob/master/inference/triton_server/ulca_models/misc.json) lists Manipuri `mni`, male/female voices, IITM IndicTTS training data and MIT. The [official code](https://github.com/AI4Bharat/Indic-TTS) describes FastPitch/HiFiGAN and an older Coqui/GPU runtime. | Exact Meitei Mayek alphabet compatibility and safe runtime/checkpoint loading remain unresolved. Public archive range inspection returned `501 Unsupported client range`; no bulk 1.5 GB download or access workaround was attempted. No script conversion or coverage claim made. |
| Konkani, Devanagari | [Indic Parler-TTS](https://huggingface.co/ai4bharat/indic-parler-tts) advertises the language but requires contact-sharing conditions for file access. | Text-only. No terms accepted or gated weights accessed. Need legitimately authorized exact-script model/voice and output rights, then the same public-only build checks. |
| Sanskrit, Devanagari | Same primary gated Parler source advertises support. | Text-only; no Hindi voice substituted and no unsupported pronunciation mapping invented. |
| Santali, Ol Chiki | Same primary gated Parler source advertises support; the named voice/training tables do not by themselves resolve exact Ol Chiki compatibility. | Text-only; exact script and representative financial/private-entry notices need verification. |
| Sindhi, Arabic | Same primary gated Parler source advertises support. | Text-only; do not substitute Urdu based on shared script. |

The official [MMS collection](https://huggingface.co/facebook/mms-tts) was checked. A corresponding public checkpoint for these six exact interface languages/scripts was not established. Guessed identifiers returned unavailable/unauthorized responses and were not repeatedly retried; those responses do not prove that no matching model exists anywhere. The Piper public catalogue contains Nepali voices but no entries for the other five languages above. This is the set of sources examined, not an exhaustive claim about all speech research.

## Nepali build and provenance

`app/scripts/prepare-piper-ne.py` pins repository revision `c10ece1aade47bb51c153c893d14e5bf8e5b7117`, checks sizes and all three file SHA-256 values, verifies the Nepali phonemizer/card and rejects storage inside the app. The ONNX model is 62,950,044 bytes, upstream SHA-256 `f7ba6b0927688f92717e93ca52bc06f5783ce8edc765d5f85365acef1d41822c`. No Python pickle or remote custom code is loaded. `piper-ne-model-source.json` retains exact provider URLs/checksums.

The isolated runtime uses [Piper](https://github.com/OHF-Voice/piper1-gpl) 1.8.0, GPL-3.0, with embedded eSpeak NG and ONNX Runtime 1.30.0. The engine, voice repository and dataset have distinct licences. Dependencies/model weights remain under `/private/tmp`, outside the deployed tree. The model card records fine-tuning from U.S. English Lessac; this provenance does not establish correct Nepali accent or fluency. The site remains non-commercial, including its fifteen existing CC BY-NC MMS packs.

The generator accepts exactly the current committed 357 public Nepali strings, rejects arbitrary input and unknown phonemes, and uses no text substitutions or phonetic aliases. MP3s are mono 24 kHz at 32 kbps, normalized with the same loudness target as existing packs. Every clip must pass source/media hashes, non-silent waveform, duration, FFprobe and full FFmpeg decoding. The independent validator rejects stale or incomplete packs before optional local promotion. The release builder checks the separate provider/licence and exact text/model/engine revision; public credits identify Nepali separately from Meta MMS.

```sh
python3 -m venv /private/tmp/virasat-piper-env
/private/tmp/virasat-piper-env/bin/python -m pip install -r app/audio/piper-requirements-lock.txt
python3 app/scripts/prepare-piper-ne.py --models /private/tmp/virasat-piper-models/ne
node app/scripts/export-audio-text.mjs --language ne --output /private/tmp/virasat-piper-stage/public-text.json
/private/tmp/virasat-piper-env/bin/python app/scripts/generate-piper-ne.py --models /private/tmp/virasat-piper-models/ne --source /private/tmp/virasat-piper-stage/public-text.json --staging /private/tmp/virasat-piper-stage --sample
/private/tmp/virasat-piper-env/bin/python app/scripts/generate-piper-ne.py --models /private/tmp/virasat-piper-models/ne --source /private/tmp/virasat-piper-stage/public-text.json --staging /private/tmp/virasat-piper-stage
python3 app/scripts/validate-piper-ne.py --staging /private/tmp/virasat-piper-stage
# --promote copies a fully checked pack locally; it does not change registry or deploy.
```

Technical synthesis/decoding is not an auditory, accent, semantic or legal-language review. This assistant cannot listen to the recordings in this runtime. The public draft notice remains essential, and a fluent listener should review all instructions, institution names, numbers, nomination/request/registration distinctions and privacy before any quality-certification claim.
