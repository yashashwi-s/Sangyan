# Virasat: problem and solution audit

Reviewed 4 October 2026, after the navigation, saving and impact-page redesign. This audit concerns Babulal's practical account and family-continuity needs. Product code was not changed. Language fluency, voice quality and physical-device performance are outside this pass; their earlier verification limits still apply.

## Main conclusion

Virasat's strongest implemented journey is preparing nomination for a **known account belonging to a living holder**, recording submission separately from registration, and creating a family sheet. Babulal's broader need begins before that journey and continues after it: identify old holdings, establish who services them, overcome access problems, resolve deficiencies and ensure that someone can use the record later.

The highest-value next work is to close those transitions. Adding more directory entries or visual polish would not resolve the findings below.

The original Track B brief asks for usable protection processes and depth on a complete journey. Its nominee-tracker direction supports the current focus; it does not make comprehensive asset recovery a prerequisite. Original source: [problem statement, pp. 3–6](../references/problem-statement.pdf).

## Method and evidence

Read the brief, existing case research and current product sources. Rechecked SEBI's securities nomination circular, MF Central's public MITRA link, RBI's UDGAM FAQ and SCORES's published process. Five deterministic probes recorded current behaviour: two rendered the actual `home()` function with minimal display-helper stubs; others inspected save/restore, complaint-reminder behaviour and missing signing guidance. Three additional source/routing observations are retained alongside those results.

Reproduction: `node docs/audits/2026-10-04-problem-solution-review/reproduce.mjs`. [Recorded observations](audits/2026-10-04-problem-solution-review/findings.json). Fictional data only. These are source and exported-logic checks, not new full-browser, institution or real-user acceptance tests. No new release-suite total is claimed. The earlier 167-test result remains tied to its earlier review.

Priority 1 means the intended task can stop or its completion/reminder can be misrepresented. Priority 2 means a missing branch or operational capability reduces usefulness or continuity. Priorities are audit judgments, not measured incidence rates.

## Findings that need implementation work

### 1. An unfinished family handover disappears from the main journey — Priority 1

**Reproduced.** With a confirmed nomination and `familyReviewedOn` set, but all three handover checks false, home renders zero “Still to do” items, no family-details remaining prompt and no primary next task. The handover remains incomplete in the underlying record. The opt-out variant leaves a family-details prompt but still offers no primary next task.

This is a progression defect, not proof that the app explicitly labels a handover verified. For Babulal, reviewing his own entries is different from his daughter finding the papers without his help.

**Fix:** distinguish nomination progress, holder review and recipient handover. Keep a “Check the handover” next task until it is reported done or deliberately deferred. Provide a legitimate “No chosen person yet / I will do this later” state. Opt-out and linked holdings still need a family-record route without nudging users to reverse a lawful choice.

**Acceptance:** the reproduced fixture exposes a handover task. A deliberate deferral is visible and dated; it is not counted as a completed handover. Nomination registration remains unchanged.

Code: [home selection](../app/dist/main.js#L62), [task selection](../app/dist/main.js#L42), [handover validation](../app/dist/tracker.js#L31). Probe F01/F02.

### 2. Old-holding discovery has no durable case or continuation — Priority 1

**Reproduced.** The unclaimed-holding guide offers “found,” “not found” and “could not complete” choices. These are in support-screen memory/history but absent from `saveWorkspace()` and restored payloads. A found holding does not become a saved discovery case or prefilled account. Not-found and unable lead to the same generic input advice, without recording what was searched or why it failed.

This matters especially for Babulal: an old paper may be his only starting point, and a portal visit may take several sessions. RBI describes UDGAM as a search service; the respective bank handles the claim. Finding a result is therefore the start of another task, not the end. [RBI UDGAM FAQ, questions 4–6](https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQonUDGAMPortal.pdf).

**Fix:** save a small discovery record containing account class, service used, date, outcome, optional non-sensitive institution label, response location and next step. Keep identification details in the official service. Give distinct branches for no match, login/authentication failure, service unavailable and institution unknown. A possible match must be confirmed before becoming an account record.

**Acceptance:** save/reopen retains each discovery outcome and its next action. No match never becomes “no assets.” A possible result never becomes verified ownership or recovered money.

Code: [support guide](../app/dist/resilience.js#L35), [saved workspace](../app/dist/tracker.js#L104), [support click handling](../app/dist/main.js#L298). Probe F03.

### 3. Complaint review reminders have no complaint identity — Priority 1

**Reproduced.** `reviewReminder()` uses the latest review-related event from a single account-level list. With an ATR for complaint A, a newer ATR for B and then A's closure, it returns `closed`. It cannot preserve B's review window because events have no case association. Free-text notes do not resolve this structurally.

This is a conditional failure when multiple complaints are mixed, not a statement that every one-complaint case is wrong. SCORES provides review stages associated with a complaint and its ATR. [SCORES process](https://scores.sebi.gov.in/scores-home).

**Fix:** either enforce one clearly labelled active complaint per account with an explicit archive/new-case action, or associate events with a private case ID and channel. Do not derive a legal review stage from a different case's event. Ask the person to confirm the portal's displayed deadline; retain the distinction between a recorded request and an accepted review.

**Acceptance:** A's closure cannot hide B's outstanding task. Nomination receipts, institution complaints and SCORES reviews stay distinct. Any uncertain date produces a prompt to check the portal rather than a definitive deadline.

Code: [review reminder](../app/dist/complaint-review.js#L3), [support record](../app/dist/main.js#L57), [event schema](../app/dist/tracker.js#L45). Probe F04.

### 4. Offline nomination omits a signing barrier relevant to seniors — Priority 1

**Source-confirmed omission.** The coach covers consent and generic signatures but contains no thumb-impression or witness branch. SEBI's current securities circular distinguishes an ordinary wet signature from a thumb impression: the latter requires two witnesses and their details for physical nomination. This is not the same as being unable to sign because of another incapacity, and bank procedures must be reviewed separately. [SEBI circular, section 6.2 and Annexure A](https://www.sebi.gov.in/sebi_data/attachdocs/jun-2026/1780397706130.pdf).

**Fix:** before showing the offline preparation checklist, ask whether the holder will sign, use a thumb impression or needs the institution to explain an assistance route. Show the reviewed securities witness instruction when it applies. Keep uncertain incapacity/authority questions with the institution; never suggest a helper can sign automatically.

**Acceptance:** a thumb-impression securities fixture reveals the witness preparation before a visit. A normal-signature fixture does not demand witnesses. Bank fixtures do not reuse the securities rule.

Code: [offline coach](../app/dist/nomination-coach.js#L58). Probe F05.

### 5. The MITRA referral starts at the wrong level — Priority 2

**Source-confirmed routing friction.** `SUPPORT_SOURCES.mitra` points to general MF Central investor sign-in. MF Central's public Quick Links section separately exposes MITRA at `https://app.mfcentral.com/links/mitra`. Sending a first-time user to a generic login adds an avoidable task before they reach tracing. This finding does not establish that sign-in makes MITRA impossible to reach, or that the direct link completes a search. [MF Central public site](https://www.mfcentral.com/).

**Fix:** use the official MITRA landing link or an explicit fallback through its named public Quick Link. Explain what to expect and retain a branch for inability to access it. Recheck public redirects before changing the product; do not bypass authentication.

**Acceptance:** the referral lands on the named service or gives an exact public navigation fallback. No credentials, identifiers or search submissions are handled by Virasat.

Code: [support sources](../app/dist/resilience.js#L3). Probe F06.

### 6. The family's future route still points to nomination instructions — Priority 2

**Source-confirmed limitation.** The readable family sheet always uses `guideFor(a).url`. For a confirmed HDFC Mutual Fund folio this is the nomination-registration page. The sheet's next step says to keep/review the sheet; it does not contain a recipient-facing claim starting point. The separate after-death orientation is not included in the exported file.

The sheet can therefore preserve the account's existence but still leave the recipient asking how to begin after Babulal's death. MF Central itself distinguishes a Transmission Request from nomination and other services. [MF Central Quick Links](https://www.mfcentral.com/).

**Fix:** include a short recipient section: which institution services this account, where the source record is if intentionally shared, what was pending at export, and where to request the current deceased-holder checklist. Mark the holder's status as unknown rather than assuming death. Link a reviewed official claim starting point when available; avoid generating entitlement decisions or a universal document list.

**Acceptance:** a recipient can identify the account and relevant service team from the exported sheet without reopening the app. Registration, claimant authority and claim approval remain separate.

Code: [family sheet](../app/dist/main.js#L97), [guide routing](../app/dist/guides.js#L16). Probe F07.

## Further gaps requiring a bounded design decision

### 7. Finding an old folio is not the same as making it serviceable — Priority 2

The main tracker models nomination status, but not whether the person can access the institution, has the current contact details, needs KYC/contact correction, has only old physical papers or knows the current service provider. Babulal can be told to update nomination while the prerequisite access task is unresolved.

Add a small readiness question before selecting online versus assisted action: “Can you use this account's official service?” If not, track the institution's requested access/correction step before continuing. Do not turn an inactive holding into an assertion that it must be sold or has lost value. Keep any identity particulars outside the app.

Acceptance: an inability-to-access fixture leads to a service-access task, not an unusable nomination link. Unknown issuer/RTA cases retain the identifying question and a place for the institution's written response.

### 8. There is no scoped claim-preparation workspace after a death — Priority 2

The separate claim entry is useful orientation, but its ending is a conversation script and legal-aid referral. It does not save the institution's written checklist, claimant role, received acknowledgement, deficiency, or next action as a claim. Physical-share selection also appears only in the living-holder entry, even though legal heirs may hold those papers.

The appropriate extension is a **user-entered claim checklist for one institution**, with evidence-location notes and correction tracking. It is not automated succession determination. Ask about a surviving joint holder before suggesting a route; do not collapse every death into an identical claim. Reuse the preparation/response controls already built instead of constructing a parallel large portal.

Acceptance: one fictional after-death case can be saved, reopened and taken from the institution's checklist to a recorded acknowledgement and a specific outstanding item. Claim receipt never becomes approval. A physical-paper claimant has a recognised starting path.

Code: [claim entry](../app/dist/journey-entry.js#L25), [coach death branch](../app/dist/nomination-coach.js#L61).

### 9. Saved-copy selection can silently restore an older version — Priority 2

The file name includes a date, and `savedOn` records a day. Multiple saves on that day are not distinguished by a revision or timestamp. Import replaces the current list after decrypting; there is a replacement warning for unsaved work, but no before/after preview or older-copy comparison. This is a version-selection risk, not a demonstrated corruption of encryption.

Add a private workspace identity, revision and save time. Preview institution labels/account count, save time and whether the file is older than the current copy before replacing it. Allow a safe cancel; do not automatically merge contradictory statuses. Put a generated-at time and review cue on the readable export so different copies can be recognised.

Acceptance: reopening an older same-day fixture gives a comparison and a deliberate replace choice. Cancelling preserves the current list. This requires no hosted account or recovery of the encryption password.

Code: [save/import handler](../app/dist/main.js#L230), [workspace metadata](../app/dist/tracker.js#L104).

### 10. Impact has one preventive funnel but the persona has two different tasks

The impact scenario concerns eligible nomination cases. It is useful for a known account's preventive work. Discovery, service-access repair and after-death claims are different journeys, with different endpoints. They should not inherit the nomination scenario's conversion assumptions merely because they use the same product.

Retain the nomination scenario, and add a workflow-outcome register for each implemented path: route identified, institution checklist obtained, next action prepared, submission reported, registration record checked, and handover reported. For tracing/claims, add possible match confirmed, deficiency clarified and claim outcome reported only when those states are supported. These are definitions for future measurement, not additional achieved benefits.

A strong demonstrable impact today is an error prevented in a reproducible fictional case: receipt not accepted as registration, wrong case not used for a review reminder, or unresolved handover kept actionable. Report the exact case and behaviour rather than treating technical pass counts as people helped.

## Recommended sequence

1. Correct family next-task selection and keep handover/deferral explicit. This directly completes the selected family-continuity story.
2. Repair the public tracing link and persist discovery outcomes. Connect a confirmed possible holding to an intentional account-setup action.
3. Add the signing/access readiness branch and a concise institution-specific visit preparation sheet.
4. Scope complaint tracking to one active case, or implement case association before presenting multiple review windows.
5. Extend the exported family sheet for its recipient, then add copy-version comparison.
6. Build one narrowly scoped claim-preparation continuation if after-death recovery remains part of the intended outcome.

All six can be validated with deterministic fictional fixtures and source review. Their implementation would still not establish real-user completion, institutional acceptance, legal entitlement or money recovered.

## Existing strengths to preserve

Keep receipt versus registration distinct, preserve status-only versus nominee-details evidence, retain explicit encrypted saving, keep credentials out of helper flows, preserve drafted work when opening official services, and keep scoped provider guidance separate from directory entries. These already support the chosen journey. The audit recommends closing gaps around them, rather than replacing the system.
