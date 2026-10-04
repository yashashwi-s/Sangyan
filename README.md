# Virasat — Family accounts and nominees

**Published draft: 4 October 2026.** Virasat follows the supplied Track B brief's **Nominee & Family Wealth Tracker** direction. One focused journey helps a family list demat accounts, bank deposits and mutual fund folios, notice missing or uncertain nominations, and follow one request through to a record check. The live site is [sangyan-xi.vercel.app](https://sangyan-xi.vercel.app). See the [current release review](docs/completion-gap-assessment-2026-10-04.md) for exact coverage, verification and unresolved human/device evidence.

The authoritative brief is the supplied [SANGYAN problem statement](references/problem-statement.pdf). Earlier securities-history and transmission research is preserved as background; it does not define the current product journey.

## Working journey

1. Choose one of 21 text languages: English plus 20 scheduled languages, excluding Bodo and Kashmiri. Search native or English names. Sixteen languages have optional bundled draft audio; five explain that written guidance is available without recordings.
2. Answer four short stages: account type, institution, holding/product context and nominee status. Home exits the current step and offers the unfinished account when you return. The last question explains what a nominee means and offers known/unknown/missing/change/opt-out choices. Optional family/account nicknames, nominee notes and last four digits have a dedicated family record. Full account numbers, PAN, institutional passwords and identity documents are not requested. A locally chosen password protects saved copies.
3. Open a missing or uncertain account and follow its institution-specific next task. A visible checklist explains what to check, what to ask and what confirms registration. Official sources stay alongside the task; HDFC Bank deposit accounts have a narrowly verified NetBanking hint.
4. Record that a request was submitted. This leaves registration unconfirmed.
5. Check a statement or institution confirmation that actually records nomination. A receipt alone does not satisfy this step. This remains the user's reported record check; Virasat does not authenticate it.
6. Review family details separately, deliberately choose what to include in a readable family sheet, or save a password-encrypted `.virasat` file to resume the list and unfinished forms later.

This build has no death intake, inheritance decision, portfolio calculator, prices, grievance filing, IEPF claims, account discovery or live institutional submission. A nominee flag does not determine inheritance rights.

## Run and check

```sh
npm --prefix app run dev
npm --prefix app run check:release
```

The preview runs at `http://127.0.0.1:4173/`. Language switching stays on `/`, uses native-script labels, and preserves the current list and unfinished form edits. Locale entry links are canonicalized to `/` by the preview. Urdu and Sindhi text reads right to left while retaining the established page geometry. Native decimal date/last-four input preserves numeric value and leading zeros.

See [app instructions](app/README.md), [current build plan](docs/build-plan.md), and [recorded implementation checks](docs/implementation-checks.md).

## Boundaries that matter

- **Local preparation:** no account login, case server, database, analytics, automatic uploads or plaintext account persistence. Optional device storage contains only an encrypted saved envelope. Reload clears the unlocked session; reopening requires the password. Downloaded files remain on the user's device.
- **Encrypted resume:** explicit local download using AES-256-GCM, PBKDF2-SHA256 with 600,000 iterations, random salt/nonce and authenticated version data. Passwords are not recoverable. Browser memory release is not forensic erasure.
- **Deliberate sharing:** the plaintext summary preview discloses institution labels, family/nominee nicknames and optional last four digits. Private free-text record notes are omitted. Share only deliberately.
- **Evidence states:** reported by the user, request submitted, and registration checked in a record are separate. None is automated institutional verification.
- **Current guidance:** demat/MF nomination guidance uses SEBI's 29 May 2026 circular, effective 1 September 2026. Bank deposits use the Banking Companies (Nomination) Rules, 2025. Actual forms and eligibility are confirmed with the institution. These are different regimes; the app does not impose one universal document checklist.
- **Languages/audio:** 21 complete draft dictionaries and 16 complete synthetic draft guidance packs, downloaded only on request. Konkani, Manipuri/Meitei, Sanskrit, Santali and Sindhi are text-only. Fluent-reader, legal-language and voice review remain pending. Official forms are not translated; no device speech voice or cloud account-data service is required. Fifteen MMS packs use CC BY-NC 4.0; Nepali uses the public Piper Chitwan voice (MIT repository, CC0 dataset). The project remains non-commercial.
- **Accessibility:** keyboard controls, visible focus, 90–200% text, contrast, spacing, reduced motion and optional bundled public guidance. Automated/source checks do not certify WCAG/GIGW conformance. Final interactive/screen-reader and physical-device review remain unverified.

No financial saving, legal compliance certification, institutional acceptance or performance guarantee is claimed. The [historical performance report](docs/bharat-performance-final-2026-10-04.md) and [subsequent automatic recovery evidence](docs/startup-recovery-2026-10-04.md) retain exact measured source hashes; the later keyboard/credit-label correction has not been timed. The [acceptance checklist](docs/bharat-release-checklist.md) separates passing technical/live checks from fluent, interactive and physical-device gaps. Earlier implementation reports remain dated historical evidence.

## Repository guide

| Path | Purpose |
|---|---|
| [app/](app/README.md) | Current Virasat interface, tracker logic and checks |
| [Track B](docs/track-b.md) | Current selected direction and original brief analysis |
| [Nomination guidance](docs/nomination-guidance.md) | Source locators, current scope and limitations |
| [Implementation checks](docs/implementation-checks.md) | Observed verification and untested limits |
| [Background problem research](docs/problem.md) | Earlier acquisition-history thesis |
| [Background technical research](docs/technical-research.md) | Earlier reconstruction research model |
| [Background validation](docs/validation.md) | Earlier candidate directions and validation gaps |
| [Background inheritance research](docs/inheritance.md) | Earlier transmission research |
| [Evidence register](docs/evidence-register.md) | Prior research claim register |
| [Sources](references/sources.md) | Prior annotated source catalogue |

Original research documents retain their dated context and evidence labels. Their earlier scope recommendations are superseded by the current focused product choice above.

The integrated nomination journey includes contextual practice, minor-nominee requirements, institution/branch steps, receipt-versus-registration and correction handling, plus account-free assisted entry and deceased-holder claim orientation. Practice never changes account status. Personal entries stay in page memory unless the owner deliberately saves authenticated encrypted recovery; family exports require explicit sharing choices. Existing browser saves are preserved until the owner chooses removal. New guidance is translated into the same 21 language packs; its audio scope is disclosed separately.
