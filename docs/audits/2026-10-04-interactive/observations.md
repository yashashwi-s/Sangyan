# Interactive observations, 4 October 2026

Parent CUA session gained browser access; the Sol child session still reported no browser surfaces. These are limited desktop browser observations, not phone, screen-reader or fluent-language certification.

## Returning-user defect (corrected and gate upgrade observed)

On `https://sangyan-xi.vercel.app/`, an existing browser profile displayed the older six-language gate. Selecting English and opening Language also showed only six choices, without search. A deliberate reload returned to the same six-language gate. The fresh deployment origin `https://sangyan-g8j6vt61e-yashashwi-singhanias-projects.vercel.app/` displayed the full searchable 21-language gate. This is consistent with a stale service-worker shell; the worker source lacked activation of waiting updates. Do not assume the public HTTP hash checks prove returning-client upgrades.

At initial inspection HEAD was `12329d9`. The subsequent correction at `aa417ed` safely activates completely installed updates and preserves unknown old pages without forced navigation. After production deployment `dpl_5b8c5B6LRn9AkHvZHSMB31KrB4KQ`, the preserved production tab still showed six languages on its first deliberate reload. After allowing installation to complete, its second deliberate reload showed all 21 choices and Search languages. No storage clearing or tab closing was performed. `returning-client-updated.png` records the updated gate. This trial contained only the gate: it did **not** demonstrate preservation of an in-progress private form during upgrade; that behavior has deterministic safety tests and still needs a real browser trial.

## Observed successful interactions on the fresh origin

- Searching English reduced the gate to the English choice; selecting it opened Home.
- Check an account → Continue without a type displayed the required-type error and focused the first radio control.
- Bank deposit → Continue opened institution search.
- Typing `bank` displayed eight matches plus `Use this name: bank`.
- First Up-arrow selected the custom final option; Enter accepted it, and Continue reached account-details step 3.
- Reading settings increased to 200%; Larger text became disabled at the upper bound.
- At a 360 × 800 viewport, the reading dialog wrapped its heading and labels. Screenshot `reading-200-360.png` records the visible upper portion; lower controls were not yet inspected.
- Closing the dialog restored focus to Reading & listening.
- Account-details step 3 at 200% had document clientWidth=360 and scrollWidth=360, with wrapped heading/description. This proves no document horizontal overflow for this observed screen only.

## Remaining interactive work

The existing cached-client gate upgrade is now reproduced. Inspect actual in-progress draft preservation during an update, then the remaining form flow, saved-list recovery, full dialog scrolling, keyboard traversal, RTL/native-script views and audio controls. No password/save/unlock, auditory intelligibility, physical-device, or screen-reader trial was performed in this session.

## Subsequent synthetic Urdu journey and published audio focus

Production institution step retained exact SBI text when changing to Urdu; translated heading/labels, draft disclosure and focus return to Language were observed. Mine/one holder/savings and default Unknown progressed to State Bank of India, Unknown/Never checked, official SBI link and institution-verification disclaimer. At 360 × 800/200%, the Urdu settings dialog wrapped, scrolled to lower controls and exposed Reset; `urdu-reading-lower-200-360.png` records it.

Listen initially showed loading/read-along 1 of 11 on the Urdu record. Stop hid controls but incorrectly left focus on the document. After the `0a23c49` correction deployed at `dpl_5zH5vghmSFe5WjTXx2B8awnToBGS`, fresh-origin English Home Listen showed loading/1 of 5; Stop then focused Listen (`id=listen`). No audible playback/progression was observed or certified.

Opening another production tab left the existing Urdu SBI record/view/focus unchanged; `urdu-record-retained.png` records this continuity. Hidden registration/controller inspection is outside the CUA evaluation policy; this observation is not proof of worker handover or actual in-progress draft preservation. Full save/unlock and other remaining interactive gates remain open as detailed in the [journey report](../../audio-focus-journey-2026-10-04.md).
