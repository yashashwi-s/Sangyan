# Website guardrails — nomination journey

4 October 2026. Authority: SANGYAN problem statement, pages 2–6, particularly mandatory guardrails (page 3), Track B (pages 3–4), target users and constraints (page 5). The user's instruction prohibits personal-data storage and is stricter than the brief's privacy minimum.

## Product rules

- Public good: no recommendations, signals, price predictions, trading algorithms, instrument/broker promotion, commissions, margin nudges or paid upsells. Provider names identify an existing account/service route only.
- Teach a complete nomination journey. Learning and practice are illustrative; no practice answer, completed checklist or submitted receipt can confirm an institutional registration.
- Retain distinct unknown, missing/change, request-submitted, blocked, user-checked and family-reviewed states. Never describe these as automated verification.
- No authority or endorsement claim from SEBI, NSDL, banks or AMCs. No legal entitlement, inheritance allocation, guaranteed processing, financial savings or recovery claim.
- Explain uncertainty and unsupported routes. Banks and securities use separate rules. MF folio versus demat holding must be distinguished. Joint/minor/unknown cases must not inherit an assumed sole-adult workflow.
- Deceased-holder questions direct users to the institution's claim/transmission process, not a new nomination on someone else's behalf. Opt-out remains the account holder's deliberate choice.
- The detailed field explainer cites the SEBI 29 May 2026 circular, §§6,7,9.3,10.1 and Annexure A (pages 6–7). It is a framework explanation, not a replica or current provider form. Link to current official instructions, keep scope/date visible, and recheck sources before adding fields or procedural claims.

## Data boundary

Allowed in temporary tab memory: existing minimal tracker entries, drafts, contextual choices and practice state. No PAN, full account number, passwords, OTPs, signatures, identity-document scans or real form uploads. Fictional practice uses fixed answers and collects no free text.

Forbidden persistence: record databases, cookies with personal values, local/session storage of account entries (including encrypted entries), IndexedDB records, analytics, session replay, error telemetry containing form values, logs of entries, personal-data downloads or generated summaries. The on-screen family summary remains in session memory only. No application print/export controls; print CSS omits private page content. Browser/OS copying and screenshots cannot be controlled by the app.

Allowed persistence: validated reading preferences (bounded text size and speed; boolean appearance settings) and public code/language/audio files. No cookie is needed or set. Permission to use cookies is not a reason to create identifiers or tracking.

Clear all records, drafts, selections, coach progress and private dialog DOM on Clear session, pagehide and restored pageshow. Remove the known legacy encrypted browser key without reading it. Deletion is limited to that application's key; do not clear unrelated origin storage. Denied storage must not break the guide. Older downloaded copies, other origins/devices and forensic memory remnants remain outside this control. Older service-worker tabs require a deployment migration check.

## Network and content safety

No personal-data network requests, uploads, remote synthesis, document parsing or arbitrary model prompts. Private input must never become an audio URL, query string, cache key, source link or diagnostic log. All user-derived HTML is escaped. Official links open deliberately with `noopener noreferrer`; do not embed third-party portals. Provider pages have their own policies.

Keep CSP restricted to same-origin assets; `form-action 'none'`, no frames/objects, anti-framing response header, no-referrer and MIME protections. No camera/microphone/geolocation access. Static hosting can retain IP/request logs: review retention and access before launch; do not promise anonymous or zero-log infrastructure.

## Release evidence

1. Public build and all automated tests pass.
2. Browser exercises show practice cannot confirm accounts, receipts cannot complete nomination, contextual choices work, drafts survive internal navigation only, and reload/clear remove them.
3. Personal persistence/import/export controls are absent; known legacy removal and preference-only writes have regression tests.
4. Public worker cache scope and audio privacy regressions pass; no new private endpoint is introduced.
5. Check keyboard focus, 320px reflow and enlarged text; inspect browser errors and run Lighthouse on the same built assets.
6. Independent agent reviews the diff; fix actionable findings and retest affected behavior.
7. Before broad release, complete source/legal-language review, actual regional narration, physical-device/assistive-technology and intended-user testing. No automated score substitutes for these.

## In-context preview
Required decision guidance belongs in the preparation flow. Extra examples and sources may be disclosed in place. Do not move essential information into a separate lesson library, infer comprehension from navigation, or infer external-form correctness from self-reported choices. Short English preview labels remain until language and audio review is complete.
