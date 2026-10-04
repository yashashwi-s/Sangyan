# Virasat browser prototype

A private family nominee tracker for demat accounts, bank deposits and mutual fund folios. `dist/` holds authored static code plus generated, checked-in language packs and entry pages. No application dependency installation is needed.

```sh
npm run check:release
npm run dev
```

Preview: `http://127.0.0.1:4173/`. The first visit offers 21 text languages: English plus 20 scheduled languages, excluding Bodo and Kashmiri. Locale entry URLs immediately show translated introductory text, load only the chosen dictionary, and canonicalize to `/`. Modern ES modules, Web Crypto and native dialog support are required.

## Current journey

Four-stage account setup → local institution search → account-specific context → check/preparation → request submitted → user checks registration evidence → family record → deliberate readable handoff and encrypted resume.

The search directory has 36 banks, 14 brokers/DP labels and 25 mutual funds. It is not an exhaustive institutional registry. Reviewed routes cover HDFC Bank, SBI deposit-service channels, Axis savings, Zerodha first-addition versus correction, Groww demat and HDFC MF folios. Each route states its applicability; joint holders get assisted guidance. General fallbacks are labelled. Bank and securities rules are separate; mutual funds in demat follow their linked demat nomination, subject to the user's account/holding check.

Registration status, request receipt, and the user's review of nominee details are separate observations. No automatic verification or institutional submission occurs. Rechecking or changing account context invalidates stale confirmation. Personal follow-up dates can be exported to a calendar.

Family nicknames, optional last four digits, multiple nominee notes and record location have a dedicated form. Family review is recorded separately from nomination confirmation; omitted details can be intentional. Changes to nomination invalidate the previous family review. A readable HTML/print/PDF summary has sharing controls and excludes private evidence notes. It is not password-protected.

Encrypted `.virasat` saves include account records, incomplete new-account setup, an unfinished existing-account form, language and the originating fund for an unfinished demat-account addition. Returning from Save restores the correct form draft. Optional device storage contains only the encrypted envelope; it is off until requested. The application does not store the password or make automatic cloud requests. Changes require an explicit new save. Old schema-2 tracker files migrate to schema 3.

The 21 complete interface dictionaries remain unreviewed drafts; non-English pages show the translation disclosure. Switching language preserves the current form. Urdu and Sindhi use RTL text with the established left-aligned LTR page layout. Date and last-four input normalize released-script decimal numerals while preserving leading zeros. Sixteen languages offer bundled public guidance with Listen/Pause/Continue, speed control, replay/skip, matching text and recoverable loading/network states. Konkani, Manipuri/Meitei, Sanskrit, Santali and Sindhi remain text-only. Recordings are generated at build time; users need no installed speech voices. All voices remain synthetic drafts without fluent-listener approval. Private entered values cannot become audio requests. Public instructions load on demand and previously played complete clips can replay offline in supported browsers. Chosen text packs are cached for offline use; an uncached language needs a connection and offers a readable retry without changing the form. A service worker caches the public shell and limits audio storage to 12 MiB / 256 files. First-use audio needs a connection; storage restrictions and browser eviction can remove offline copies. See [audio generation, provenance and review limits](audio/README.md) and the [Nepali provider investigation](../docs/audio-remaining-languages-2026-10-04.md). Startup can attempt bounded public-file recovery before forms are available; manual native retry remains. [Actual outage evidence](../docs/startup-recovery-2026-10-04.md) separates lab recovery from physical-phone review. The reading dialog supports 90–200% text, contrast, spacing and reduced motion. These non-sensitive reading preferences are remembered locally; Reset restores defaults.

## Verification

`npm run check:release` rebuilds/verifies audio and public packs, checks language scope, and runs all 91 tests. Browser acceptance steps are in [tests/browser-audit.md](tests/browser-audit.md); the previous-flow automation is archived and not a current runner. The [current 4 October release review](../docs/nepali-startup-release-2026-10-04.md), [final-source performance report](../docs/bharat-performance-final-2026-10-04.md) and [acceptance checklist](../docs/bharat-release-checklist.md) distinguish published technical checks from unverified browser/fluent/real-device tasks. No new CUA browser surfaces were available during final publication. These are not WCAG/GIGW conformance, fluent-language approval or target-user completion claims.

## Security and hosting

Static files only. No analytics, third-party fonts, uploads, automatic account lookup or hidden plaintext account persistence. AES-256-GCM and PBKDF2-SHA256 (600,000 iterations), random salt/nonce, authenticated envelope version, bounded file sizes and schema validation protect saved copies. A forgotten password cannot be recovered. Downloaded files remain until the user deletes them; session clearing is not forensic erasure.

Production uses the existing Vercel `sangyan` project at **https://sangyan-xi.vercel.app**. Root directory: `app`. `vercel.json` serves `dist/`, preserves 21 locale entry routes and applies CSP/framing/MIME/referrer/permissions restrictions. Deploy an isolated public-output stage and hosting configuration; research, audio source manifests, translation sources, Python/model dependencies, scripts, archive and tests are not public assets. The older `.openai` manifest is historical and is not the current host. [The deployment record](../docs/audits/2026-10-04-ne-startup-production/deployment.json) identifies the final published source and verified coverage.

The product does not discover accounts, authenticate records, adjudicate succession, allocate inheritance or process deceased-customer claims. Bank lockers and safe custody are outside the tracked deposit types. First-use audio connectivity, fluent-language and accent review, real screen-reader/low-end-device use and provider-specific coverage remain explicit limits.

Run `npm run build:public` after editing public copy, HTML, CSS, JavaScript or the worker. It validates effective dictionaries, generates content-addressed JSON and localized entry pages, and derives an offline shell revision from the complete public shell. No model or frontend dependency is installed. `npm test` checks locale/audio consistency and recovery. Public non-versioned files revalidate with ETags; hashed language packs and audio are immutable. Do not add private records or generated user exports to these caches.
