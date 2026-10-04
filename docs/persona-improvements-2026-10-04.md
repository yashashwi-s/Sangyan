# Three-persona review and implementation

This is a simulated expert walkthrough, not interviews or evidence about every village resident, child or older person. The core nomination journey has enough breadth for a focused hackathon demonstration; more features alone will not establish usefulness. The gaps below concern knowing where to start, getting assistance and recovering when uncertain.

| Situation | Gap found | Implemented response |
| --- | --- | --- |
| First-time village user, uncertain account type, limited digital access | Setup assumes bank/demat/folio knowledge; assisted route is hidden; wrong guesses can send the person to the wrong process. | Account-free start with plain descriptions and an unknown route; a question to ask the institution; visible online/branch preference and a branch conversation script. No location, account identifier or document upload. |
| Child seeking help after a death, including an adult child | Existing deceased-holder stop provides no practical next step; a relative/nominee may confuse status with entitlement; a minor may lack a safe helper. | Separate claim orientation available from Home and deceased-holder stop, with bank/demat/folio/unknown routing and adult/minor/unsure assistance. Ask for the current written checklist and acknowledgement. Independent NALSA legal-aid route if help is unsafe/unavailable or rights are disputed. No entitlement decision, filing, prescribed universal document list or claim-status tracking. |
| Older holder, possibly helped by another person | Dense wording, no progress cue, assisted path hidden, uncertainty traps and response options assume submission. | Simpler headings, step progress and primary action; branch instructions with consent/OTP boundaries; update-context recovery, immediate uncertain-minor guidance, not-submitted return path and correction-specific follow-up questions. |

## Reviewed plan

An independent agent approved the plan before implementation, requiring separate claim isolation, all four account categories, no eligibility/entitlement inference, safe independent assistance, current-source attribution, uncertain-context recovery and unchanged privacy. A second code review found sample pending edits could survive switching to personal setup through the new entry. The integration now clears sample-related pending edits, selection and coach state when replacing sample accounts, while preserving real-workspace pending edits.

## Boundaries and sources

[NALSA FAQ](https://nalsa.gov.in/faqs/) was checked on 4 October 2026 through official search results for its 15100 legal-aid helpline. The page fetch timed out; no detailed eligibility guarantees were imported. Legal assistance is distinct from claim processing and emergency response. Financial route guidance asks the institution for current case-specific requirements; it does not determine inheritance, prescribe court documents, promise processing times or approve claims.

No new free-text personal fields or persistence/network sinks. Fixed choices are in memory, cleared with the session. New entry module is included in the public offline shell. Existing language/audio integration is unchanged: these additions are explicitly English text-only previews. Regional language and audio integration remains necessary before this is suitable for the proposed users.

## Remaining product priorities

Before expanding to more processes, test with intended users: can they identify the next institution, explain nominee versus holder, distinguish receipt from completion, and find safe assistance without coaching? Include users with no safe family helper and limited reading confidence. Test on a low-end phone with intermittent connectivity, keyboard and screen reader. Measure misunderstanding and abandoned steps without collecting personal account data. Complete reviewed translation/audio with the parallel branch. No assertion of complete accessibility or validated comprehension is made.
