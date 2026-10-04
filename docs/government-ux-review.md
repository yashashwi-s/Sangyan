# Government service UX review

Reviewed 3 October 2026. This is a design review of the private Virasat prototype, using primary Indian government sources. It is not STQC certification, a legal compliance finding, or a measured usability study. Source pages were retrieved on the review date; this report distinguishes published guidance from our product decisions.

## Primary sources and useful patterns

- [GIGW 3.0 introduction](https://guidelines.india.gov.in/introduction/) describes user-centred information architecture, consistency, mobile accessibility and lifecycle ownership. Its scope is government websites/apps. Virasat borrows useful design principles; it is not a government service and must not display an official emblem or imply endorsement.
- [GIGW quick tips](https://guidelines.india.gov.in/quick-tips/) recommends meaningful page titles, a heading hierarchy, a skip link, keyboard operation, sufficient reading time, plain citizen-focused language and synchronised multilingual content. The audio credits page now has a unique title, description, skip link, one main heading, scannable sections and native keyboard-operable disclosure.
- [GIGW scope and objectives](https://guidelines.india.gov.in/scope-and-objective/) identifies usability, user-centred design and universal accessibility as its objectives, and connects assessment with STQC. A Lighthouse accessibility score alone cannot establish GIGW conformity.
- [myScheme](https://www.myscheme.gov.in/) presents a short sequence from entering details to finding relevant schemes and opening the applicable service. The reusable pattern is a visible next step with enough information to decide. In Virasat, the account record should lead to checking a nomination, confirming its status and saving a family handoff. Opening an institution website must be recognisable as leaving Virasat and requiring connectivity.
- [myScheme accessibility statement](https://www.myscheme.gov.in/accessibility-statement) describes its accessibility intent and explicitly discloses limitations in Hindi information and PDFs. This is a useful honesty pattern, not evidence that the portal is fully accessible. Virasat must similarly disclose unreviewed translation/audio and distinguish text from recording coverage.

## Decisions for this prototype

| User need | Decision | What still needs evidence |
|---|---|---|
| Start without understanding technical terms | Task-first account → nomination check → next action → family handoff; place explanation beside the decision | Seniors/homemakers independently completing the journey |
| Find the same controls in another language | Keep home, language and reading/listening controls in stable positions; isolate mixed-direction institution names | Fluent review of all languages and actual RTL screen-reader checks |
| Understand what is saved | Explain unsaved draft, encrypted saved file/device copy and readable family sheet in context | Interrupted save/reopen, wrong password and tab eviction on Android |
| Recover from lost connectivity | Keep current text and in-memory draft; expose a retry for an uncached language or audio; identify external official links | Whole journey during repeated radio/network changes; offline cache eviction |
| Read on a small screen or listen | 44px controls, wrapping labels, text size/spacing/contrast settings, complete on-screen instructions and optional listening | Physical small-screen keyboard, TalkBack, 200% text, human comprehension |
| Trust the recordings | Put entry privacy, optional download, replay/clearing and synthetic-voice limitations before detailed model credits | Fluent pronunciation/accent review of the fifteen current bundled draft voices |
| Know the product boundary | Avoid government branding or claims that this record changes a bank nomination; link official institution instructions | Review each institution's current rules and language-specific legal wording |

## Audio page changes

`app/dist/audio-credits.html` groups the page into private entries, listening/storage, synthetic voices, and model credits. It requires no JavaScript. Attribution to Meta MMS, Vineel Pratap and colleagues, the research paper, the six original and nine added pinned model links, CC BY-NC 4.0, non-commercial use, no endorsement and the changes made by Virasat remain present. The page clearly states that text coverage and audio coverage differ, and that fluent-speaker validation is outstanding. Privacy disclosure still includes hosting request logs and bounded browser audio storage. The English-only status is explicit; the page does not pretend to be a translated 21-language legal disclosure.

## Review gates

Do not claim measured ease of use, certified accessibility, fluent translation quality or real-device readiness from this review. Before broad public use, recruit intended users across literacy levels; record task completion, wrong turns and recovery independently of a facilitator. Review translated text and audio with fluent speakers. Test the full journey with TalkBack on actual 2 GB Android hardware, including 50 accounts and an open keyboard. Maintain dated ownership for official links, language content, translations and recordings. A service cannot stay reliable through visual polish alone.


## 4 October integration review

Re-read the [GIGW quick tips](https://guidelines.india.gov.in/quick-tips/) and [myScheme accessibility statement](https://www.myscheme.gov.in/accessibility-statement) during the 21-language release work. Their useful patterns remain keyboard operation, clear headings/skip navigation, synchronized multilingual information and explicit limitations. No government endorsement or accessibility certification is claimed.

The app's help and listening settings now show availability for the selected language from the real recording registry, beside the entry-privacy and synthetic-voice notices. Help retains non-English translation-review disclosure. The audio credits builder derives the available-language list and exact pinned Meta model links from each validated recording manifest, avoiding a stale six-language claim after expansion. The service worker similarly derives listening support from that registry while retaining one shared bounded cache. The guide-route regression check now covers all 21 effective dictionaries.

The same continuation re-read the current [SEBI nomination circular](https://www.sebi.gov.in/sebi_data/attachdocs/jun-2026/1780397706130.pdf), the nomination sections of [HDFC NetBanking FAQs](https://www.hdfc.bank.in/need-help/net-banking-faqs), and [Zerodha correction instructions](https://support.zerodha.com/category/your-zerodha-account/nomination-process/articles/add-modify-or-remove-nominee). Within those inspected routes, the app continues to separate a request receipt from a registration record, single from joint-holder guidance, and initial nomination from correction. This is a source check of public guidance, not a tested logged-in provider journey or legal opinion.

CUA returned an empty browser/app inventory in this continuation and again at the final publication review. The current additions therefore have automated/source and media checks but no new interactive browser observation. All 84 final release checks passed, including native decimal input with preserved leading zeros. The [published release review](bharat-release-review-2026-10-04.md) records the final live privacy/source checks. Mobile keyboards, large-text reflow, physical low-memory devices, screen readers, fluent listening and independent task-completion studies remain separate evidence gaps.


### Native institution identity correction

A deeper source/regression pass found that generic input `bank` silently matched SBI, while `बैंक` matched HDFC Bank. The old exact-match helper split search aliases into individual words and also removed Indic combining marks. It could therefore turn a custom/unknown institution into an unrelated specific guide. Exact identity now uses complete explicit aliases or the canonical name/ID, returns no identity for ambiguous matches, and preserves combining marks. Generic input remains a custom account with general guidance. Regional complete acronym/provider spellings improve local lookup without claiming official integration. Search normalization is computed once for the fixed public directory rather than repeatedly removing marks on each keystroke. The relevant regressions and all 82 release tests passed; this is a deterministic routing correction, not a measured usability claim.
