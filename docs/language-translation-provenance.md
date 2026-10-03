# Language translation provenance

Date: 2026-10-03. Every non-English pack remains a draft. A fluent reader has not signed off on the complete account journey, institution guidance, privacy wording, accessibility labels, or audio pronunciation. Native script, nonempty text, and matching keys are structural checks; they do not establish linguistic or legal accuracy.

## Source and data handling

The 364 effective English interface strings were compared with the publicly deployed dictionaries at [sangyan-xi.vercel.app](https://sangyan-xi.vercel.app/). Public `virasat-copy.js`, `journey-copy.js`, and `audio-copy.js` were merged in the same order as the site's `i18n.js`. All 364 local source keys and values matched that public English dictionary, with zero unmatched strings. The deployed [English locale](https://sangyan-xi.vercel.app/locales/en-03602502de66.json) was also available.

Only this verified public instructional copy, and five generic newly authored language-selector labels plus a generic audio-availability explanation, were provided to translation services. No account entries, passwords, account numbers, private notes, or user files were submitted. The 364-key language dictionaries and five-key `coverage-{code}.json` files remain separate authoring artifacts.

## Completed machine drafts

| Codes | Languages and scripts | Provider | Date | Review performed |
| --- | --- | --- | --- | --- |
| `kn`, `te`, `ml` | Kannada, Telugu, Malayalam; respective native scripts | Google Translate public text service | 2026-10-03 | Machine drafts with targeted editorial corrections to nominee explanation, submission versus registration, receipt versus confirmation, inheritance, private notes, encrypted save, password recovery, sharing, device storage, and deceased-holder scope |
| `kok`, `mai`, `doi` | Konkani, Maithili, Dogri; Devanagari | Google Translate public text service | 2026-10-03 | Same targeted editorial corrections; service-generated marker artifacts removed |
| `mni` | Manipuri/Meitei; Meitei Mayek, provider target `mni-Mtei` | Google Translate public text service | 2026-10-03 | Native-script and exact-key checks; service-generated marker artifacts removed; complete fluent-reader review pending |
| `sat` | Santali; Ol Chiki | Google Translate public text service | 2026-10-03 | Native-script and exact-key checks; complete fluent-reader review pending |
| `sd` | Sindhi; Arabic | Google Translate public text service | 2026-10-03 | Native-script and exact-key checks; targeted corrections on 2026-10-04 to claim direction, boundary negation, private-note exclusion, registration evidence, self-report and unprotected sharing; complete fluent-reader review pending |

These nine dictionaries each have all 364 source keys, nonempty string values, no unchanged complete English source values, and no remaining numbered batching-marker lines. Each has all five coverage labels. Brand names, account terms, product labels, and identifiers such as HDFC, FD/RD, DP ID, PAN, and `.virasat` can legitimately retain their original spelling. The `voiceHelp` text was replaced with language-availability guidance so new written packs do not claim prerecorded audio exists.

Automated structural checks and targeted editorial changes are not independent fluent-reader validation. In particular, the Meitei, Santali, and Sindhi packs require close review of claim direction, nominee versus legal heir, financial nomination terminology, negation, account linkage, and privacy meaning. The same independent review remains necessary for the six other packs.

## Bodo and Kashmiri: deferred from this release

No `brx.json` or `ks.json` dictionary has been created. Neither language is represented using Hindi, English, or another language as a substitute.

The Google public text endpoint returned HTTP 400 for Bodo (`brx`) and Kashmiri (`ks`). The current [Google Cloud language table](https://docs.cloud.google.com/translate/docs/languages) did not list these codes. [Microsoft's official language table](https://learn.microsoft.com/azure/ai-services/Translator/language-support) supports both languages. Its public consumer interface successfully returned a Bodo sample and a first numbered batch. Full batch processing stopped after automatic approval review rejected further use as an inferred provider usage restriction; no denied route was continued and no partial sample was presented as full coverage.

The [official IndicTrans2 repository](https://github.com/AI4Bharat/IndicTrans2) supports `brx_Deva` and `kas_Arab`. Its [official demo](https://models.ai4bharat.org/#/nmt/v2) loaded and allowed Boro selection, but a normal translation request returned no result and logged `TypeError: Failed to fetch`. A separate connection check could not reach the demo API on port 443. The repository's official distilled Fairseq download link returned HTTP 401 Unauthorized. No gated download or access restriction was bypassed.

On 4 October 2026 the user revised the release scope to 21 text languages: English plus 20 scheduled languages, excluding Bodo and Kashmiri. They are not selectable, counted as supported, or blockers for this release. Their handoff artifacts preserve the source and terminology work for any future genuine translation; no substitute language is published.

## Additional six draft packs

Gujarati (`gu`) and Punjabi (`pa`) were authored as assistant-generated drafts. Nepali (`ne`), Assamese (`as`), Odia (`or`) and Sanskrit (`sa`) used the verified-public-source translation baseline followed by targeted editorial correction. All six contain the exact 364 source keys and five separate coverage labels. The editorial pass corrected nominee/candidacy confusion, deceased-holder transfer versus broadcasting/infection, receipt versus registered nomination, inheritance boundaries, same-holder demat linkage, passwords/shared-device privacy and private-note exclusion. Numeric batch prefixes were removed, including 287 Sanskrit prefixes. These checks were completed by the assistant, not independent fluent reviewers; draft labels remain required.
