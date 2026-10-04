# Track B: the family story, solution coverage and remaining gaps

Reviewed 4 October 2026 against local source `7fee921`, the original six-page brief, the research dossier, implementation at that time and a bounded live-site walkthrough. This initial assessment is not an interview study or a legal opinion. Application changes made after the assessment are recorded separately below.

Implementation update: the assessment below describes the pre-change snapshot. The persona support, private follow-up, handoff, review and narration changes have since been implemented; see [current changes and validation](persona-implementation-2026-10-04.md). Institutional outcomes and fluent comprehension remain separate evidence requirements.

## Assessment

Virasat fits the brief's Nominee & Family Wealth Tracker direction. Its strongest contribution is helping a family turn uncertainty about a known account into a specific nomination task, separate submission from registration, and prepare a private family record.

It does not yet establish that the family can use that record when the original holder is unavailable, that the information stays current, or that an unresolved institutional request reaches a useful outcome. Those are the most consequential remaining gaps in the chosen journey.

**Persona correction:** the user subsequently supplied the target-persona slide: Praveen, 22; Kavita, 39; and Babulal, 63. These replace the earlier invented Ram/Asha/Meera household as the design reference. The slide describes intended users, not observed interviews. Do not assume these three people are related or that their stated problems are all solved by nominee tracking.

## The supplied personas and actual product fit

| Persona as supplied | Stated pain | Current Virasat fit | What designing for this person requires |
|---|---|---|---|
| Praveen, 22 — Tier-3 graduate/gig worker, new to trading | Drawn to Telegram F&O tips; trades on borrowed capital | Limited. He can organize nominations for accounts he has, but the app does not assess tips, borrowing risk or impulsive trading | If serving his stated problem is in scope, it needs a separately defined scam/claim-literacy or behavioral journey. Within Track B, help him understand account rights and prepare a complaint when an institution-related problem occurs; do not claim this fixes risky trading |
| Kavita, 39 — Tier-2 homemaker managing family savings, not fluent in English | Intimidated by broking apps; susceptible to Ponzi/fake-IPO schemes | Partial. Language choice, plain tasks and official routes help her manage known accounts; the app does not identify Ponzi or fake-IPO schemes | A complete regional-language, listenable account task, fictional examples and safe official-channel handoff. Test independence and scam-related comprehension; do not assume she needs a more technical relative to operate the product |
| Babulal, 63 — retired pensioner holding old/dormant folios | Unaware of the nominee process; cannot navigate IEPF/SCORES portals | Strongest fit for nomination, incomplete for recovery/redressal. The app teaches nomination and provides branch assistance; it does not guide a complete IEPF claim or SCORES complaint | Start from a known statement/folio, identify the right process, explain nomination, offer assisted completion, and preserve follow-up evidence. Distinguish a living-holder nomination task from an unclaimed-asset or complaint task |

**Product implication:** prioritize Babulal's complete nomination journey and Kavita's independent regional-language use of that journey. Give Praveen an honest, narrow Track B route where relevant. If the objective is to solve every risk named on the slide, Virasat's present scope is insufficient: scam exposure and trading behavior require additional validated work. This is a scope choice, not a reason to pretend a shared dashboard resolves all three.

The original brief values depth on a complete journey. SCORES, nomination and IEPF are examples of difficult processes; building all three is not required. Safety impact and Tier-2/3 usability together account for 55% of the rubric. More features will help only if they close an observed failure in this family journey. See [the supplied brief](../references/problem-statement.pdf), pages 3–6.

## The story to tell

**Illustrative scenarios using the supplied personas.** The account details and events below are fictional, informed by the research; the personas' names, ages and stated needs come from the user's slide. No interview, financial loss, recovery or real customer outcome is claimed. Babulal and Kavita are independent users; no family relationship is assumed.

### 1. Babulal has an old folio, but does not know which process he needs

Babulal brings an old statement. He knows it represents savings, but does not know whether to check nomination, ask about a dormant account, seek unclaimed assets or make a complaint. He needs a first action he can understand before facing a portal.

Virasat lets him start with a known account, identify its type and institution, and keep uncertainty visible. Its account-free guided entry helps him ask the institution when he does not know. It still relies on finding the account; a manual list does not discover dormant or unclaimed holdings. Add a clearly explained triage question for nomination, unclaimed assets or an unresolved service problem, with reviewed official referrals for processes outside the implemented journey. Do not route every old folio to IEPF.

### 2. Babulal does not know whether nomination was ever completed

In the fictional nomination scenario, he remembers filling in something years ago, but cannot tell whether it was a nominee form or whether the change was recorded. He also needs to understand the difference between the account holder, nominee and eventual heir.

Virasat separates missing, uncertain, reported and checked states. It explains that nomination and inheritance rights are different. The family sees a useful task for each account instead of one reassuring tick for the entire household.

The unresolved risk is comprehension: a correct sentence does not establish that Babulal understood it. A short fictional check should ask whose details belong in the nominee field and whether nomination determines inheritance. The current coach already offers the first of these; extend it with the second only if user testing shows misunderstanding.

### 3. Kavita must be able to do the same task in her own language

In a separate scenario, Kavita is reviewing family savings. She is comfortable making household decisions but is not fluent in English and finds the broking interface intimidating. She needs to identify the holder and intended nominee, understand the official form and choose a safe service channel. Her successful journey must not require a more technically confident relative.

Virasat already provides six-step learning, fictional practice, institution instructions and a branch/service-desk option. It directs personal particulars to the institution's own form. It distinguishes bank, securities, joint-holder and demat-held-fund contexts. This is a substantive improvement over a list of links.

However, the new teaching is text-only. The existing recorded guidance does not narrate it. A user relying on listening may therefore reach the most difficult step and lose that assistance. Twenty-one draft text languages and sixteen recorded-language packs do not establish whole-journey comprehension. Kavita's limited English fluency is not evidence of low literacy in her own language; test the actual reading/listening preference. Official links reduce the need to search for the nomination route, but they do not detect a Ponzi or fake-IPO scheme.

### 4. A receipt looks like success

In either illustrative scenario, the user submits through the institution. A receipt arrives and looks like completion. Virasat keeps the task awaiting registration until the user checks an appropriate institution record. It also distinguishes a status-only indication from checking actual nominee particulars.

This is one of the clearest safety mechanisms in the product. The statement check remains the user's report; Virasat does not authenticate the document or query the institution. A demo can show the distinction using fictional records, but cannot call it a real completed institutional nomination.

If a request is rejected or remains unexplained, the coach helps them ask for a written reason and correct missing or wrong information. The journey becomes weaker when repeated follow-ups fail: there is no structured complaint preparation, separate complaint timeline or applicable external escalation path.

### 5. Can the user resume the task and leave a usable record?

The user adds recognizable account labels and record locations, reviews the family sheet and saves an encrypted copy. This is useful. But if Babulal cannot find his saved file again, Kavita cannot resume her own task, or an intended recipient cannot distinguish two deposits on the shared sheet, the practical problem remains.

The existing family-review checkbox means the person reviewed what to disclose; it does not mean a recipient received the sheet, can locate the records, or can explain the next action. Test independent save/resume with each target persona, then test a deliberate handoff with a separately chosen recipient. Preserve the holder's right to keep details private and offer independent assistance when a family helper is unavailable or unsafe.

### 6. Circumstances change, or a holder dies

A deposit is renewed, a nominee needs changing, an account is moved, or an old saved copy is reopened. Virasat provides change/recheck actions and optional personal follow-up dates, but there is no default review cycle or systematic prompt about relevant changes. A formerly accurate record can still look reassuring.

If a user is helping after an account holder's death, a claim process is needed rather than a new nomination. Virasat already provides this orientation, including an unknown-account path and independent legal-aid direction. It does not prepare, track or obtain acceptance of a transmission claim. If Babulal's old holdings require physical-share or historical-evidence work, the earlier research describes problems outside the nominee tracker's current capabilities.

**The endings to aim for:** Babulal understands nomination and can take the correct assisted next step for his known account. Kavita completes the same process independently in her preferred language and can resume and deliberately share the record. Guaranteed inheritance, exhaustive discovery and recovered assets require evidence and authority beyond this app.

### 7. Praveen's main problem still needs a different intervention

Praveen can use nomination and rights guidance for an existing account. But completing a nominee record does not address his attraction to Telegram F&O tips or trading with borrowed capital. A Track B complaint-preparation route could help with an applicable institutional grievance; it should not be presented as prevention of trading losses or as a remedy for every Telegram scam. If serving his stated pain is a product requirement, research a distinct risk-literacy/scam or behavioral journey and evaluate it separately before expanding the app.

The common thread across the three personas is needing understandable, trustworthy steps. Their immediate problems and successful outcomes remain different.

## How the research supports this story

| Research anchor | What it supports | What it does not establish |
|---|---|---|
| Original Track B brief | Seniors, homemakers and legal heirs in smaller towns struggle with investor-protection processes; nominee tracking is a suggested direction | Prevalence, loss amounts or proof that this implementation resolves the problem |
| Cases C1/C2: grandmother/mother's transferred holdings with missing acquisition information | Financial knowledge and historical records can fail to travel with an account; family helpers encounter gaps | That nomination would restore acquisition history or that either family overpaid tax |
| Case C6: successive deaths in a joint physical folio | A current account document can conceal unresolved earlier transitions | That software can settle entitlement or that the institution's requirements were wrong |
| Case C7: deceased holder's live-KYC prompt | The ordinary account-use route can be inappropriate after a death | Current institutional conduct or eligibility under later reforms |
| Cases C4/C9 and the research corrections | Official material can be revised or combine provisions from different periods | That an official source is uniformly current or legally applicable to every account |
| Existing-solutions and data-access research | Institutions and public systems already cover substantial portions; holdings and schema availability do not imply universal discovery/history access | No competitors, a universal account API, or an established integration partnership |

The public family cases are anecdotes in the saved research, not independently audited files. Their frequency and financial impact are unknown. Much of that research concerned share history and transmission, while the current product focuses on nomination. Treat family continuity as a connecting hypothesis; conduct direct nomination interviews before claiming the old cases validate the current product. See [cases](cases.md), [research method](research-log.md), [evidence register](evidence-register.md), [existing solutions](existing-solutions.md) and [data access](data-access.md).

## Pain-point coverage

“Addressed” means a relevant mechanism exists. It does not mean target users have demonstrated success. “Partial” identifies a remaining user burden. “Outside current scope” means the product does not perform that outcome.

| Pain point | What exists today | Assessment and remaining action |
|---|---|---|
| 1. Unsure what an account is or where to start | Plain account descriptions, account-free entry, unknown route and question to ask | Addressed in design; observe whether users identify the right service provider without guessing |
| 2. Records scattered across bank/demat/MF | Manual local family list, recognizable labels, optional last four digits and record location | Partial: does not discover missing accounts; add a guided inventory review with completeness explicitly unknown |
| 3. Uncertain, missing or outdated nomination | Distinct nomination states, record check, correction/recheck action | Addressed for known accounts; add a routine review prompt and life-event questions |
| 4. Nominee confused with holder or heir | Explanation and fictional holder/nominee practice | Addressed in content; test inheritance comprehension as well as field comprehension |
| 5. Wrong process for bank versus securities | Separate regimes and scoped routes | Addressed in code; maintain applicability and review dates as rules change |
| 6. Savings nomination assumed to cover all deposits | Savings/deposit context; HDFC guidance distinguishes the deposit | Partial: introduce a prompt to check each distinct deposit, with optional label/masked reference |
| 7. MF folio confused with demat-held units | Holding-mode question and explicit demat linkage | Addressed; linkage relies on the user's check, not authenticated holdings |
| 8. Joint holder/minor requirements misunderstood | Context questions, consent guidance and minor teaching | Partial: compare the exact institution form with the current rule; expose conflicts rather than silently choose |
| 9. English jargon or limited reading confidence | Twenty-one draft languages, earlier audio packs, reading controls | Partial: new learning and claim orientation lack narration; fluent comprehension remains unmeasured |
| 10. No online authentication or confident phone use | Branch/service-desk route and conversation script | Partial: verify the service centre and what to bring; no logged-in provider workflow was tested |
| 11. Helper takes control or asks for credentials | No institutional credentials requested; explicit OTP/PIN boundaries; legal-aid orientation | Addressed in content; observe consent and include users without a safe family helper |
| 12. Received request mistaken for registered nomination | Separate reported/submitted/record-checked states and fictional evidence examples | Strong implementation; authentication and real registration outcome remain external |
| 13. Registered status mistaken for correct nominee details | Status-only versus particulars checked | Addressed; preserve this distinction in summaries and usability tests |
| 14. Rejection, correction or unexplained response | Response coach, blocked status and follow-up questions | Partial: correction reason is transient coach state; no durable structured request/complaint timeline or escalation pack |
| 15. Task forgotten after submission | Optional follow-up date, due prioritization and calendar export | Partial: no alert unless user imports the calendar; prompt deliberately before exit and explain this limitation |
| 16. Family cannot identify or access the eventual record | Family sheet, disclosure choices, record location and encrypted resume | Partial: no recipient handoff/comprehension check; file/password availability is not established |
| 17. Private data exposed while preserving records | Memory by default, explicit encrypted saving, private export choices | Strong safeguards in inspected paths; shared plaintext sheet still requires deliberate custody |
| 18. Saved record becomes stale or a newer edit is lost | Dirty-state notices, explicit resaving, dates and manual recheck | Partial: add visible last-saved/last-reviewed cues and a chosen review cycle; never label elapsed time as invalid registration |
| 19. Holder already deceased | Separate bank/demat/folio/unknown claim orientation, adult/minor assistance | Partial: safe first step, not a complete claim-readiness or resolution workflow |
| 20. Old physical shares, IEPF or acquisition history | Background research and boundary statements | Outside current scope; offer reviewed official referrals now and consider a separate bounded evidence project later |
| 21. Slow network, small screen, interruption | Lazy language/audio assets, public offline cache, recovery, reading controls | Technical and limited desktop evidence; whole task on a physical low-end phone remains unverified |
| 22. Unknown institutional acceptance and impact | Self-report boundaries and technical tests | Unproven outcome; collect consenting before/after tasks and external confirmation before claiming registration/recovery |

Implementation anchors: [tracker states](../app/dist/tracker.js), [institution routes](../app/dist/guides.js), [nomination coach](../app/dist/nomination-coach.js), [entry/claim orientation](../app/dist/journey-entry.js), [forms, handoff and recovery](../app/dist/main.js), [integrated release](integrated-release-2026-10-04.md).

## The changes with the highest value

### Priority 1: complete the family handoff

Extend the existing summary rather than build a document vault. Offer an optional, dated preparation check: the chosen person knows where the sheet is; can identify the relevant account; knows where its source records are; understands pending actions. Record these as user reports, never verified delivery or authority to transact.

Make the distinction visible: nomination registration checked, family details reviewed, and handoff planned/reported are different things. Include a chosen review date on the sheet. Allow intentional omissions and no-recipient situations. Keep credential storage out of the sheet; support a separately arranged access plan for encrypted files without collecting the password centrally.

**Acceptance:** with fictional accounts, a second person can locate one account's source record and explain its next task without the holder present. A checked nomination never implies a completed handoff.

### Priority 2: make review a normal part of the journey

Offer an optional annual review, clearly a product habit rather than a statutory deadline, and prompts after an account move, deposit renewal or relevant family change. Show when a record was last checked and which version was last saved. Ask whether circumstances changed before treating a restored list as ready to use.

Keep overdue review separate from registration: time passing alone is not evidence that a nomination ceased to exist. Reminders need an explicit calendar import or another separately authorized delivery mechanism. Do not imply a static page schedules alerts on its own.

**Acceptance:** an old imported fixture shows its review context and offers rechecking; it does not silently lose registration history or become “verified.” Unsaved changes remain clear.

### Priority 3: resolve the stalled-request branch

Add structured, optional notes for submission, acknowledgement, correction, resubmission and a separately lodged complaint. Preserve the written response location and what the user is asking the institution to correct. Preparing a complaint must not mark it filed.

Produce a concise local draft: account class, institution, dated events, exact unresolved issue, previous response and requested remedy. Leave sensitive identifiers and supporting documents for the official submission channel. Start with the institution's grievance route, then explain the applicable external route and its conditions.

SCORES covers securities-market complaints and instructs investors to approach the entity first. Bank complaints require a different route. A fresh check found the RBI's FAQ describes a **2026** Integrated Ombudsman Scheme effective 1 July 2026, replacing the 2021 scheme; do not copy the older scheme's timing rules into new code. Detailed eligibility and clocks require a reviewed implementation. Sources checked 4 October 2026: [SCORES](https://scores.sebi.gov.in/) and [RBI current FAQ](https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=3407).

**Acceptance:** a bank complaint is never sent toward SCORES merely because the account is listed in Virasat. Nomination submission and complaint dates are distinct. No statutory countdown is inferred from an ordinary receipt or a personal reminder date.

### Priority 4: narrate the difficult part of the journey

Complete public-guidance audio for the new teaching in the language(s) used for the demo and first pilot, after fluent review. Offer small, on-demand step recordings with matching text and honest unavailable/offline states. Private entries must remain excluded from audio requests.

Add a small fictional comprehension check where it matters; do not turn setup into a compulsory quiz. Test whether the person can distinguish holder, nominee, receipt and registration. The existing practice is a good starting point.

**Acceptance:** a user needing listening assistance can reach the institution route, understand form roles and interpret the outcome without encountering an unexplained text-only barrier. Completion of every possible voice is not a prerequisite to testing one clearly scoped pilot.

### Priority 5: strengthen inventory and source maintenance

An optional “anything else to check?” inventory can remind the family about separate deposits, brokers and fund folios. Mark records found versus still to check without declaring completeness. Refer forgotten mutual-fund cases to existing services; AMFI already lists MITRA for inactive/unclaimed folios. [AMFI official updates](https://www.amfiindia.com/important-updates), checked 4 October 2026. Do not imply that referral is an integration or universal account discovery.

Keep a route owner, review date, current authority and applicability conditions. Recheck the most-used provider pages; offer assisted guidance when details are stale or conflict. A fresh check shows a real example worth testing: SEBI's current securities nomination circular makes guardian information optional, while Zerodha's public modification help says minor nominees require guardian details and ID proof. Show both sources and advise asking the institution to clarify the current requirement. Do not turn a page discrepancy into an automatic allegation of misconduct. [SEBI circular, section 7](https://www.sebi.gov.in/sebi_data/attachdocs/jun-2026/1780397706130.pdf), [Zerodha modification help](https://support.zerodha.com/category/your-zerodha-account/nomination-process/articles/add-modify-or-remove-nominee), checked 4 October 2026.

**Acceptance:** a listed institution is not presented as having a reviewed detailed guide unless it does. An uncertain form requirement has an explicit resolution path.

## What requires people or institutions

Virasat can organize tasks, teach, preserve deliberate records and prepare follow-up. The institution must register nomination, authenticate records and process claims. A qualified reviewer must handle ambiguous legal requirements. A consenting family decides what to disclose and how another person can access it. Unknown holdings or absent historical evidence cannot be reconstructed uniquely by adding a chatbot.

For deceased-holder assistance, the next bounded extension could track a written institution checklist, evidence location, acknowledgement and deficiencies. This requires current-source and professional review before implementing personalized document rules. Disputed succession, sequential deaths and physical-share histories remain separate specialist work.

## How to prove useful impact

Run a small formative study with 6–8 consenting target users representing Babulal's and Kavita's stated situations, including someone without a safe family helper. Ask about actual reading/listening preferences instead of treating limited English as low literacy. Include Praveen-like participants for any defined rights/complaint extension, with separate success criteria; nomination-task success would not validate a solution to borrowed-capital trading. This is a proposed sample, not a completed study or population estimate. Use fictional accounts initially.

Ask each person to identify the account route, interpret unknown nomination, prepare one next step, distinguish receipt from registration, respond to a rejection, and use a family sheet handed to them. Include a save/restore exercise on a real low-end phone with interruption. Observe the complete task, not just home-page loading.

Record unaided task success, wrong-route choices, receipt/completion mistakes, help requests, time, abandonment, and whether a second person can use the handoff. Compare equivalent tasks using the existing official instructions with counterbalanced order. Report participant counts and denominators; a small study identifies failures rather than establishing national efficacy.

Suggested release criteria, to agree before testing: no critical misunderstanding about receipt versus registration or credential sharing; successful route identification and handoff for the demonstrated persona; no data loss in the tested recovery exercise. Iterate on observed failures instead of collecting more feature counts.

For later real cases, distinguish an observed improved task, a user-reported institutional outcome and an independently confirmed registration or credit. Do not convert draft usability results into money recovered or inheritance prevented.

## The demonstration and the claim it can support

For a 3–5 minute video, use Babulal's fictional known-folio nomination story and show one account end to end. Identify his account; select an uncertain/missing nomination; follow the correct institution/branch guidance; use fictional submission and registration records to show why a receipt is insufficient; then demonstrate the family sheet and private recovery. Show Kavita using the preferred-language version independently as an accessibility check. Mark all simulated institutional outcomes. Briefly show the stalled-request or deceased-holder branch as a boundary, without claiming a complete recovery journey. Mention Praveen only with an actually demonstrated relevant capability; do not imply the tracker resolves his stated trading risk.

Current defensible positioning: **Virasat helps families organize known accounts, act on missing or uncertain nominations, distinguish submission from registration, and leave a deliberate family record.**

After the proposed handoff and usability checks, a stronger claim could be: **In this observed task, the family identified the correct institution, avoided treating a receipt as completion, and a second person used the handoff without the holder's help.** Use that claim only with the actual results and denominators.

Avoid saying the product guarantees inheritance, finds all assets, verifies nominations automatically, recovers unclaimed money, or has been validated across all supported languages/devices.

## Verification during this review

- Extracted all six brief pages; visually inspected Track B and its continuation and the rubric on pages 3, 4 and 6.
- Read the current and historical scope documents, case/evidence research, nomination sources, persona/learning additions, integration and relevant performance/privacy evidence. Inspected the actual state, guidance, family review and save paths.
- On the live website, observed the 21-language selector, English Home, fictional three-account list, missing demat nomination task and six-step preparation entry. The new guide visibly discloses its text-only scope. No real account data, login, institutional submission, file save or claim was used.
- Ran the current application tests: **132 passed, zero failures/skips**. These do not prove legal correctness, target-user comprehension, fluent audio, physical-phone behavior or institutional acceptance.
- Rechecked selected official sources for nomination, provider instructions, grievance routing and existing fund-tracing infrastructure. This was a bounded check, not an exhaustive legal-update audit.
- Historical README/checklist figures and branch-only session-storage notes were not treated as the integrated current product. The integrated product retains explicit encrypted recovery and deliberate export. Earlier tests and performance measurements retain their own source versions.

The next investment should be evidence that the chosen family journey works, together with the three practical closures: handoff, review and unresolved-request follow-up.
