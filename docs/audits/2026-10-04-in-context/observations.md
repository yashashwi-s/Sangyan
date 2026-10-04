# In-context preview verification — 4 October 2026

Local branch: `codex/nomination-in-context-preview`. No push or PR update. Final preview runs at http://127.0.0.1:4177/.

- Public build succeeded; 77/77 Node tests pass. Independent guardrail reviewer reran tests and found no remaining blocking issues after fixes.
- Browser used fictional built-in accounts only. Walked preparation, incorrect and correct inline nominee example, minor choice, provider instructions, receipt recording, awaiting response, rejected empty confirmation, explicit correction recording and deceased-holder stop. Wrong-answer feedback stays expanded; attempted incorrect example blocks continuation until corrected.
- Receipt led to submitted-date form; submitted account remained awaiting. Registration selection led to existing evidence/type/date/check gates. Empty evidence was rejected. No practice choice confirmed an account.
- Reload cleared accounts and returned to language selection; English then showed empty home. Final tab was repopulated with fictional example for user review.
- Narrow viewport request 320px reported actual 266 CSS-pixel content width in the app. At normal and 200% text, document scroll width equalled viewport width (no horizontal overflow). Enlarged text naturally required vertical scrolling. Reading settings and viewport restored afterward.
- No browser console errors observed. Screenshot is synthetic data only.
- Final Lighthouse mobile navigation via headless installed Brave against /en: performance 99, accessibility 100, best practices 100, SEO 100. This is navigation-level evidence, not whole-app compliance or comprehension proof.

Not rerun manually in this iteration: all six full language flows, Urdu direction, audio playback, keyboard-only whole flow, back-forward-cache restoration and physical Android/assistive-technology coverage. Existing regression tests remain; these manual checks and target-user comprehension work are still release gates. New companion remains explicitly English text-only.

Review fixes: preserved institution-specific steps and assisted routes; context includes product, nomination and review status; correction requires explicit record action; inline example remains open after responses; stage-specific help replaces generic redirection.
