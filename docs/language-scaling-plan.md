# Language coverage and expansion plan

India's Constitution lists **22 languages in the Eighth Schedule**. The user revised this release on 4 October 2026 to **21 interface languages: English plus 20 scheduled languages**, excluding Bodo and Kashmiri. This is a release scope, not a claim to cover all scheduled languages. The excluded-language translation handoffs are retained for a possible future release. Source: [Department of Official Language](https://rajbhasha.gov.in/en/languages-included-eighth-schedule-indian-constitution), checked 3 October 2026.

## Separate text, audio and quality

A language has three independent release states: complete interface text, playable bundled recordings, and human review. A translated interface does not prove usable pronunciation, fluent comprehension or institutional/legal accuracy. New translations are visibly labelled drafts. Missing recordings must be explained without offering an unusable Listen control. Existing six recordings remain synthetic drafts and need fluent pronunciation review.

The language register keeps native and English names, direction and audio availability separate. Users search either name. Only the selected text pack downloads; adding languages increases the catalogue slightly, rather than downloading every translation to every phone. Saved work stores the language code, and restoring it retains a usable current language if its pack cannot download. Existing account data is never sent for translation or speech generation.

## Repeatable release process

1. Freeze the public English key set and collect a glossary for nominee, nomination registration, submission, confirmation and family record. A submitted form must never become a confirmed nomination through translation.
2. Produce a draft for every key. Validate exact key coverage, nonempty strings, interpolation/markup, correct script and unexpected translation-service artifacts. Preserve institution names and official URLs.
3. Have a fluent reviewer and a domain reviewer check critical instructions, privacy, errors and legal boundaries. Then test the account → check → action → family handoff journey with intended users. Record corrections and reviewers against the text revision; machine completeness is not this gate.
4. Generate public-instruction audio offline on a build machine, not on the user's phone. Check license compatibility, supported script, numbers, institution names, clipping, duration and silent output. Require a fluent listener to approve pronunciation and meaning before calling a voice reviewed.
5. Publish content-addressed text and audio files. Download only a requested language and explicitly requested clips. Retain bounded audio storage and a clear deletion control. Do not prefetch all languages, all audio or large model weights.
6. Run the same payload, slow-network, changing-network, offline recovery, large-text and saved-file tests on every release. Keep raw reports, profile definitions, sample counts and source hashes.

## Extending beyond this prototype

- **Scripts:** Sindhi uses Arabic script in this release and may need an alternate-script pack. Kashmiri is deferred and will need an explicit script policy if added. Manipuri/Meitei and Santali require checking native font coverage on older Android versions. A phone lacking glyphs is not supported merely because its JSON loads. Ship a small, licensed, language-specific font only when necessary; measure its download cost independently.
- **Voice service:** BHASHINI or an approved self-hosted model can be evaluated for broader voice coverage. API access, per-language availability, quality, privacy, licensing and costs must be verified before promising support. Pre-render public instructions to keep the runtime private and inexpensive. Do not introduce a live account-data translation/voice API merely to advertise AI.
- **Content ownership:** Assign an owner and review date to each language and institution guide. Expired or changed official instructions require a content update, retranslation and new audio for the affected keys.
- **Delivery costs:** Static hosting/CDN scales without an account database. Traffic cost is selected text plus requested clips; deployment size is not each user's download. Cache immutable revisions while keeping the entry page and worker updateable.
- **Trust:** Remain strictly non-commercial under the bundled MMS voice licence. No stock recommendations, product rankings, commissions or claimed government endorsement. The tool helps a family organise/check records; it does not register nominations or establish succession rights.

## What cannot yet be claimed

No physical 2 GB Android test, fluent review of every language, TalkBack certification, complete alternate-script coverage or production-scale field study has been established. Browser CPU throttling and heap measurements provide narrower lab evidence, not a substitute. Publish those measured conditions rather than a device compatibility badge.

## Implemented offline safeguards

Selected Meitei and Santali script fonts are local assets (8,896 and 4,896 bytes respectively), with their OFL licences. The selected font and licence are cached with the language, rather than preloading every font. Readable family-sheet exports embed the selected font and licence, so they do not depend on a recipient's network or installed script font. Export fails explicitly if the necessary font cannot be obtained, rather than quietly creating an unreadable document.

Worker updates carry forward only exact, current language-pack URLs and selected script assets from previous caches. Changed translations are not silently substituted with old text. Native retry labels are delivered with the small application shell, so an uncached language can still offer a recognisable retry before its full pack arrives.
