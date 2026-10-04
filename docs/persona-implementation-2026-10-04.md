# Virasat: persona changes, pain-point coverage and verification

Historical implementation record. The subsequent [Track B plain-language audit and rewrite](track-b-plain-language-audit-2026-10-04.md) supersedes its interface, copy, audio counts and current verification totals. The evidence below remains tied to its earlier snapshot.

Implemented and reviewed locally on 4 October 2026. This follows the [Track B story and gap assessment](track-b-story-gap-analysis-2026-10-04.md), the supplied [problem statement](../references/problem-statement.pdf), and the saved research in [cases](cases.md), [evidence register](evidence-register.md), [existing solutions](existing-solutions.md) and [data access](data-access.md). The user's supplied Praveen, Kavita and Babulal slide defines the intended users. Scenarios here are illustrative; the personas are not assumed to be related and no interviews or financial outcomes are claimed.

The application now covers each persona's stated problem with a relevant first step, and closes the local continuity gaps in the nomination journey. It cannot itself verify investments, prevent a trading loss, obtain institutional acceptance, discover every account or recover assets. Language, accessibility and scalability have specific technical evidence below; blanket compliance is not established.

## The story the product can now support

**Praveen, 22:** a Telegram group asks him to borrow and act quickly on an F&O tip. He can open “Understand a risky offer” before entering any account. The trading branch explains repayment after a loss and derivatives risk. A fictional pay-versus-pause question gives feedback without changing any account status. Guaranteed-return and new-share offers have separate warning guidance and an official IPO education link. If he already paid or shared access, a different branch points him toward his bank/payment provider and the official cybercrime route. Success here means recognizing a risky claim and taking a safer next step; reduced borrowing or trading losses need later behavioral evidence.

**Kavita, 39:** she wants to organize family savings but finds the broker interface intimidating and prefers a regional language. She can choose that language, read or listen to fixed instructions, practice the account-holder/nominee roles, start with one familiar passbook or statement, and choose assisted institutional service. The difficult guided teaching and claim orientation now have matching recordings in the same sixteen audio languages as the earlier interface. She can prepare a nominee request, distinguish a receipt from a registered nomination, keep correction notes privately and resume an encrypted saved copy. Separate scam guidance addresses Ponzi and fake-IPO exposure. Independent completion and understanding still require observation with people like Kavita.

**Babulal, 63:** he finds an old paper certificate or folio and does not know which process applies. “Find the route for old holdings” distinguishes bank deposits, shares/dividends including paper certificates, mutual-fund folios and uncertainty. It starts with the named institution/company; age or dormancy alone does not establish an IEPF transfer. The shares branch asks the company/registrar about transfer and current documents; the fund branch refers to AMFI's MITRA information. For nomination he uses the existing account-specific process. For an unresolved bank problem he gets current RBI instructions; for a securities complaint he gets the entity-first SCORES route. Dated follow-ups and written-response locations can be saved privately. A chosen family recipient's ability to find the records and understand the next action is recorded separately from nomination registration.

The common product story is: **understand the problem → choose the correct route → prepare one concrete action → keep evidence and follow up → resume and deliberately hand over a useful record.** Each persona's outcome remains distinct.

## Changes against the pain points

“Implemented” below means the mechanism is present and technically checked, not that target users or institutions have demonstrated success.

| Pain point | Implemented response | Remaining dependency |
|---|---|---|
| Telegram tips, borrowed trading capital | Visible trading-risk branch, repayment/loss explanation, fictional pause/pay feedback | Behavioral validation; no trade assessment or borrowing intervention |
| Ponzi, guaranteed-return and fake-IPO offers | Separate offer branch, urgency/return warnings, official investor and IPO material; already-paid fraud branch | No sender, intermediary or offer authentication; reporting and recovery remain external |
| English and intimidating terminology | All new fixed support and existing teaching available in 21 text dictionaries; clearer Hindi account/investment wording; broken translation prefixes and known Odia/Dogri passages repaired | Complete dictionaries are draft translations; fluent editorial and comprehension review are still required |
| Listening stops at the hardest lesson | 234 additional public clips per audio language, covering learning, claim orientation and persona support; text, replay/skip and loading states | Synthetic pronunciation and comprehension unreviewed; five languages remain explicitly text-only |
| Unknown account/process; old paper shares | Task selection and separate deposit/share/fund/unknown routes; paper certificates explicitly selectable | Manual identification and institution response; no automated discovery or recovery |
| Every dormant account treated as IEPF | Institution-first check, transfer question, current checklist/nodal-contact request, IEPF referral and portal limitation | IEPF portal could not be fully inspected during this release; no invented screen-by-screen wizard |
| Bank grievance incorrectly routed to SCORES | Different RBI and securities/entity-first SCORES branches | Official eligibility, time limits and filing; no legal clock is calculated |
| Rejection/correction history lost | Up to 20 private dated contact, correction, resubmission, escalation, response and resolution events per account; written-response location; local draft download | User reports only; draft download does not file a complaint or authenticate documents |
| Complaint resolution confused with nomination | Separate support-event history; even “resolved” cannot change nomination status | User must check institution records for actual nominee registration |
| Receipt mistaken for registration | Existing separate submission, checked registration and particulars states retained | No authenticated institution integration |
| Holder, nominee, heir, minor or joint-holder confusion | Existing contextual learning/practice, legal-rights distinctions, assisted branch and source-conflict guidance retained and narrated | Fluent understanding and exact provider acceptance must be checked |
| Deposit/folio omitted from the family list | Visible inventory prompts for separate deposits, brokers, statements and folios; uncertainty retained | Inventory is not exhaustive; no universal holdings API |
| Tasks forgotten or records become stale | Optional annual review, leap-day handling, dated record context, last-saved cue and restored-copy review prompt | Reminders require importing the calendar file; the static app does not send alerts |
| Family receives an unusable sheet | Optional find-records, understand-next-step and separately-arranged-access checks; dated handoff only after all checks and family review; edits/rechecks invalidate readiness | Reported readiness does not prove delivery, recipient competence or entitlement |
| Sensitive notes leak through sharing/listening | Support notes excluded from family summary and narration; fixed public audio URLs; entries in memory until explicit encrypted save | Owner controls readable exports, files and password custody; no forgotten-password recovery |
| Interruption during a correction note | Saved unfinished support editor includes partial date fields and notes without committing an event | Physical-device termination, eviction and user save/resume behavior require testing |
| Small screen, large type and RTL | Flexible task controls, wrapping/preformatted drafts, 44-pixel control sizing, visible focus, input text direction, existing reading controls retained | Real assistive technology and physical low-end-device validation remain |
| Too much content or unbounded storage | Selected-language loading, on-demand audio, bounded caches/files/accounts/events; isolated public staging and explicit hosting budget check | CDN capacity, regional traffic, quota/cost and actual account plan are not certified |
| Deceased holder, physical-share history or contested inheritance | Existing deceased-holder orientation now narrated; old-holding referrals and private follow-up can organize the next step | Complete transmission, acquisition-history reconstruction and legal adjudication remain outside the app |

## Language and audio evidence

Text: English, Hindi, Bengali, Marathi, Tamil, Urdu, Assamese, Dogri, Gujarati, Kannada, Konkani, Maithili, Malayalam, Manipuri/Meitei, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi and Telugu. Bodo and Kashmiri are not released.

Audio: English, Hindi, Bengali, Marathi, Tamil, Urdu, Assamese, Dogri, Gujarati, Kannada, Maithili, Malayalam, Nepali, Odia, Punjabi and Telugu. Konkani, Manipuri/Meitei, Sanskrit, Santali and Sindhi show the text-only state. First-use clips require connectivity; cache availability depends on browser support, storage and eviction.

All new support routes and their choices render with defined fixed dictionary keys in every released text language. Key completeness, missing/empty values, malformed text and the 24,000-byte compressed-pack budget are checked. Script font coverage reports zero missing characters for the sampled Meitei and Ol Chiki public text. These checks cannot establish that a translation is natural or semantically correct. [Translation provenance](../app/translations/PERSONA-SOURCES.md) records machine-draft and editorial limits.

The new 3,744 MP3 files were fully decoded without failure; the entire public inventory now has 9,456 clips. The support builder verifies exact fixed text, pronunciation recipe, model/provenance, size, duration and audio hashes. It rejects mismatches rather than silently using recordings for different text. Private names, account values, dates, support notes and credentials cannot become synthesis text or audio URLs. [Decode evidence](audits/2026-10-04-persona-support/audio-decode.json), [audio review/licensing notes](../app/audio/README.md).

The MMS voices retain their non-commercial licensing conditions; Nepali has separate Piper/model/dataset attribution. Synthetic recordings are not fluent-listener-approved. These assets should not be represented as certified or unrestricted commercial audio.

## Usability and continuity evidence

Desktop browser walkthroughs used fictional data. They checked visible task entry, correction notes and private follow-up, a future personal review, separate family/handoff states, and Hindi/Urdu layout. The final isolated preview additionally showed Praveen's borrowing warning, wrong-answer feedback, and the new English narration read-along (15 fixed parts for that selected safety branch). A Hindi paper-share selection visibly showed the institution-first IEPF boundary.

At a 360 × 800 viewport, Hindi old-holding guidance had no horizontal document overflow at 100% or 200% text. At 200%, the visible main buttons measured approximately 86–182 pixels high; at default size they measured at least 44 pixels. Urdu was also checked at 200% with high contrast in the earlier local walkthrough. Overrides and test reading preferences were restored. [Home](audits/2026-10-04-persona-support/home.jpg), [Hindi old holdings](audits/2026-10-04-persona-support/hindi-old-holdings.jpg), [Hindi at 200%](audits/2026-10-04-persona-support/hindi-200-percent.jpg).

The final release check passes **145 tests**, including all-language support rendering, correct grievance routes, private-summary exclusion, legacy-save defaults, interrupted follow-up, invalid/future/oversized event rejection, handoff invalidation, supplemental audio integrity and bounded cache/range behavior. Existing encrypted-save authentication/tamper, account-state, privacy and maximum-workspace tests also pass.

No target-user interview, screen-reader audit, formal WCAG/GIGW certification or real institutional submission was performed. Automated Lighthouse accessibility 100 applies to the measured landing view, not all controls or all journeys.

## Scalability evidence and delivery limits

The design remains a static app with no application server, runtime translation/speech vendor or financial-account connection. A chosen locale is fetched; the entire audio corpus is not downloaded at startup. Public shell/text cache bodies are bounded at 8 MiB and audio at 12 MiB/256 entries. A workspace is limited to 50 accounts with 20 nomination events and 20 support events each, a 1 MiB plaintext save and a 2 MiB encrypted import limit.

The maximum synthetic workspace had 437,472 plaintext bytes and a 583,483-byte encrypted envelope. Three desktop Node WebCrypto runs encrypted in 87–93 ms, decrypted in 93–100 ms and validated in 2.4–2.8 ms, with exact restored-data comparison. This is not browser or physical-phone memory/timing evidence. [Workspace measurements](audits/2026-10-04-persona-support/workspace-scale.json).

| Hindi landing lab profile | Performance | LCP | Blocking time | Controls ready |
|---|---:|---:|---:|---:|
| Steady constrained connection | 88 | 2.95 s | 38 ms | 7.48 s |
| Changing connection with deliberate outage | 95 | 2.26 s | 65 ms | 5.31 s |
| Fresh navigation after availability returned | 98 | 1.96 s | 0 ms | 5.20 s |

These are one run per profile, with 8× CPU slowdown, a 360 × 800 viewport and a 64 MiB V8 old-space cap. Cold navigation transferred about 99 kB in the steady/recovered runs; retries raised the changing run to about 125 kB. The changing run's best-practices score was 96 because deliberate connection cuts produced resource errors; the other two scored 100. There was no reported Lighthouse runtime error. Fresh recovered navigation is not proof of same-page recovery or completion of a financial task. Controls-ready time remains a practical usability constraint on very slow connections. [Full profiles, traces and metrics](audits/2026-10-04-persona-support/performance/summary.json).

Nine bounded local HTTP runs completed 120,995 asset requests without request errors. The workload used 1, 3 or 6 synthetic concurrent asset journeys and a maximum of 24 active requests, fetching the shell plus three public clips and a range. Request p95 ranged 2.09–14.47 ms. The server and client shared a desktop over loopback: these figures cannot establish internet, CDN, regional, playback or real-user capacity. [Local capacity](audits/2026-10-04-persona-support/local-capacity.json).

The [delivery inventory](audits/2026-10-04-persona-support/delivery-scale.json) separates selected-language startup bodies from optional audio. Traffic scenarios are arithmetic assumptions, not observed user behavior. Audio dominates eventual egress and deployment size.

An isolated public allowlist was successfully staged locally, excluding research, model weights, manifests, authoring translations, user saves, authentication configuration and repository metadata. The stage contains 9,527 files and 219,167,655 bytes including hosting configuration. This exceeds the documented Vercel Hobby CLI upload limit of 100 MB. It fits the selected Pro check of 1 GB and 15,000 files. The checker fails before staging when the selected budget is exceeded; this does not verify or change the actual hosting plan. [Hobby check](audits/2026-10-04-persona-support/deployment-budget-hobby.json), [Pro check](audits/2026-10-04-persona-support/deployment-budget-pro.json), [official hosting limits](https://vercel.com/docs/limits), checked 4 October 2026.

These changes are local and **not published** to the existing production site. Deployment must use an actually suitable upload/delivery arrangement, preserve attribution and check current quotas; no paid upgrade or external publication was performed.

## Sources and applicability

The fixed routes carry a public review date and an institution-applicability boundary. Their authorities are [SEBI investor safety](https://investor.sebi.gov.in/securities-dos_and_donts.html), [SEBI IPO education](https://investor.sebi.gov.in/ipo_through_asba.html), [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/), [SCORES](https://scores.sebi.gov.in/), [current RBI FAQ](https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=3407), [AMFI updates/MITRA information](https://www.amfiindia.com/important-updates) and [IEPF](https://www.iepf.gov.in/). They are referrals, not integrations. The RBI source describes the 2026 scheme; no 2021 deadlines were copied into a calculator. IEPF's website was not fully accessible during verification, and that limitation is shown to users.

Nomination/provider-specific requirements continue to use their scoped sources and conflict guidance. A source review date is not a guarantee that a rule or portal never changes. The research's succession and historical-record cases support a continuity hypothesis; they do not prove prevalence or validate a nominee-only remedy for every case.

## Work that requires external validation

The implemented prototype is ready for a bounded review. Before claiming all pain points are resolved, collect the following evidence:

1. Fluent reviewers check all translated decisions and every narrated instruction in the pilot languages, including role, rights, risk and escalation meaning. Correct source text and regenerate matching recordings before approval.
2. Praveen-like participants explain why borrowing and a guaranteed-profit claim remain risky; observe a safer independent check. Do not use trading loss reduction as an outcome without a study.
3. Kavita-like participants independently choose a language, practice, find the institutional next step, save and reopen their fictional work. Test listening preference and understanding rather than infer literacy from English fluency.
4. Babulal-like participants distinguish nomination, dormant holdings and complaints; a separate chosen recipient identifies a source record and next action from the deliberately shared sheet.
5. Physical low-end Android and assistive-technology sessions cover 200% text, RTL, uncertain/offline audio, interruption and restore. Test actual institutional acceptance with consent before asserting successful registration or claim recovery.
6. The deployer verifies the hosting plan, upload method, permitted audio use and delivery budget. No production capacity or commercial readiness is inferred from local fanout.

This list is an evidence plan, not a request for permission to make the local changes. The product changes, generated assets and technical verification described above are complete; external outcomes remain explicitly unverified.
