# Branch visit pack · 4 October 2026

An account-specific preparation sheet is available from the account screen and guided nomination preparation. It provides four outputs: where to go, what to bring, what to ask, and what confirmation to keep. The browser can print or save PDF; a standalone HTML download opens offline.

The pack reuses reviewed route guidance and existing translated public copy. It distinguishes bank, joint securities, uncertain mutual fund, demat-held fund and deceased-holder paths. A linked fund uses its linked demat account when available. Unknown routes point to official contact discovery instead of inventing an office or checklist. Receipts are distinguished from confirmed nomination, and claim cases use claim-team questions.

Downloads omit owner and nominee names, private notes, complaint details and document locations. Only institution, account category and at most four numeric reference digits are included. A download does not change status or submit anything. Downloaded copies are not password protected; this is stated before download. Example downloads retain the fictional-example label. No scripts or remote assets are embedded; Meetei Mayek and Ol Chiki fonts are embedded when needed. External official links still require internet.

## Verification

- Release gate: 174 passed, zero failures. Five new tests cover all 21 language packs, route distinctions, private-data canaries, escaped input/unsafe URLs, example labels, download cancellation and retry after a blocked download.
- Desktop browser walkthrough: fictional bank example → account → branch pack → successful HTML download. Inspected console contained no errors.
- At 320 × 800 pixels: four sections present, document width 320 pixels, no horizontal overflow. Desktop and mobile screenshots are retained below.
- Desktop Chrome for Testing 138.0.7204.183: all 21 translated joint-demat fixtures, including joint-holder and thumb-impression guidance, printed to one A4 page at 12 mm margins with browser headers off. Hindi, Urdu and Santali previews were visually inspected for clipping, script rendering and direction. This does not establish fluent-language approval or actual printer behaviour; unusually long institution names and other print settings may change page count.
- Full standalone HTML size in the joint-account fixture: 4,239–23,495 bytes including embedded fonts where needed. The separate English bank download was 3,735 bytes before the example-label addition. Local generation and hypothetical gzip arithmetic are supplementary evidence, not measured mobile performance or user effort saved.

Evidence: [release checks](audits/2026-10-04-branch-pack/release-check.txt), [print checks](audits/2026-10-04-branch-pack/print-check.json), [generation inventory](audits/2026-10-04-branch-pack/generation-check.json), [desktop](audits/2026-10-04-branch-pack/desktop.jpg), [320px view](audits/2026-10-04-branch-pack/mobile-320.jpg).

Coverage and print numbers are also published in the public statistics page and JSON register. No real-user completion, avoided-visit, recovery or target-phone outcome is inferred from these checks.
