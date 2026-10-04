# Quantifiable impact without inflated claims

**Current-product update — 4 October 2026:** The calculations below concern the earlier acquisition-history/transmission research. They do not quantify Virasat's nominee tracker. Use the [Track B reassessment and potential-impact model](track-b-reassessment-2026-10-04.md) for the current product. There are no real-user or institutional Virasat outcomes. The full EAC-PM PDF is now checked: Table 1 labels 57,570 as **approved**, with 76,620 processed in Oct2025–Mar2026; the indexed-only caveat below is historical.

## Three categories that must remain separate

| Category | Evidence | Appropriate use |
|---|---|---|
| Relevant market scale | CDSL account statistics | Establish that securities infrastructure serves a large population of accounts |
| Observed operational difficulty | Historical IEPFA audit and subsequent reform data | Show real claim-processing friction and the need to check whether it persists |
| Individual financial consequence | Explicit worked examples | Demonstrate why a record error can matter; not estimate national losses |

## Verified numbers and their limits

**CDSL:** its August 2026 periodic statement reports **190,997,499 beneficiary-owner accounts** at month-end, about **19.10 crore**. This is CDSL alone, not unique investors, not all Indian households, and not the population suffering broken histories. [S029](../references/sources.md#s029)

**Historical IEPFA audit:** CAG's Report 7 of 2025, examining data up to 31 March 2023, records 37,060 approved claims, of which 1,433 were disposed within 60 days; 28,207 had delay exceeding 180 days. It also records ₹5,714.51 crore lying in the fund and 12,092.35 lakh shares held at that historical date. These are different measures; the rupee figure is not the market value of those shares. [S027](../references/sources.md#s027)

**Counterevidence: processing improved.** A May 2026 EAC-PM working paper's indexed Table 1 reports 57,570 approvals during October 2025–March 2026 versus 5,098 in the preceding six months; year-end pending applications were 26,510. The PDF's direct retrieval failed, so these are marked **official indexed extract, not independently checked against the full downloaded table**. Do not describe 2023 delay rates as current. [S028](../references/sources.md#s028)

**No national harm estimate:** neither demat counts nor IEPF balances can be multiplied by an assumed error rate to obtain a defensible “Sangyan can recover ₹X crore” claim. Acquisition-history failures are a subset of a broader and poorly measured problem.

## Reproducible numerical illustrations

All investor inputs below are **synthetic**. The [reproduction script](../examples/reproduce-impact.py) and [saved examples](../examples/impact-examples.json) reproduce the arithmetic. Tax illustrations are for a simplified FY 2025–26 listed-equity long-term-gain situation qualifying for the 12.5% rate, with the ₹1.25 lakh annual threshold, no other gains/losses or basic-exemption adjustment, and **before cess, surcharge, fees and rounding**. Statutory eligibility must be separately checked. [S020](../references/sources.md#s020)

### E1 — Missing purchase cost

2,000 shares cost ₹400 each and are sold for ₹600 each. Correct cost is ₹8,00,000; proceeds ₹12,00,000; gain ₹4,00,000. If a downstream calculation incorrectly substitutes zero for missing cost, it reports gain ₹12,00,000: an **₹8,00,000 gain overstatement**.

Under the stated tax assumptions, computed tax changes from ₹34,375 to ₹1,34,375: **₹1,00,000 difference before cess**. This is a conditional error scenario, not Zerodha's documented default behaviour and not a measured customer saving.

### E2 — RIL/Jio cost must be allocated, not duplicated

Synthetic pre-demerger cost ₹2,00,000. Apply the issuer ratio in [rules and effective dates](rules.md): RIL receives ₹1,90,640 of cost and the child ₹9,360. If the parent incorrectly retains the whole cost while the child also receives its allocation, aggregate basis is overstated by **₹9,360**. Correcting records can increase a future tax computation; it is not inherently a tax-saving product.

### E3 — Child shares are not “free” merely because there was no payment on receipt

Synthetic holding: 1,000 ITC shares with historical total cost ₹3,00,000. Under the issuer event described in [rules and effective dates](rules.md), 100 Hotels shares carry ₹40,530 aggregate allocated cost, or ₹405.30 each; parent cost becomes ₹2,59,470. At a synthetic sale price ₹200 per Hotels share, proceeds are ₹20,000 and the simple difference is **a ₹20,530 loss**, rather than a ₹20,000 gain produced by zero cost.

The cost error is **₹40,530**. The tax utility of any loss depends on eligibility, timing, other gains and filing rules. No instant refund is implied.

### E4 — Purchased rights entitlement disappears from the chain

100 entitlements cost ₹30 each; subscription costs ₹200 per resulting share; all are exercised. Total outlay is ₹23,000. Recording only the subscription omits **₹3,000**. This is an acquisition-component reconciliation example; classification and allowable charges require tax review.

### E5 — Identical holdings can hide different lots

Two synthetic lots: 100 shares at ₹100, then 100 at ₹500. Sell 100 at ₹600. FIFO on this simple same-account trade sequence gives cost ₹10,000 and gain ₹50,000. Applying the overall ₹300 average gives cost ₹30,000 and gain ₹30,000: a **₹20,000 difference**. Holding-period consequences are not included.

### E6 — Corporate-action arithmetic check

The issuer correction in Case C4 concerns ₹54,040 versus ₹50,040: **₹4,000 difference in an illustration**. The useful software metric is detecting an inconsistent total and a superseding document, not asserting ₹4,000 was recovered from a claimant.

### E7 — ₹24 lakh is a claim value, not money saved

A synthetic uncontested demat claim worth ₹24,00,000 lies above the earlier ₹15 lakh simplified-documentation threshold and below the revised ₹30 lakh threshold documented in [inheritance research](inheritance.md). This motivates rule-version checking. The product cannot claim it “saved ₹24 lakh”; the amount remains the investor's asset. Measure whether the correct documentary route is identified and accepted.

### E8 — Measuring a procedural clock

Synthetic acknowledgement that all documents are complete: 1 September 2026. Adding 21 calendar days gives 22 September. If the claim remains unsettled on 1 October, that is nine days beyond this simple calculated date. The legal trigger and applicable rule must be validated; an uploaded application alone does not establish completeness. No automatic rupee compensation is assumed.

## What to measure in a real study

| Metric | Definition | Avoid this misleading substitute |
|---|---|---|
| Documented cost restored | Supported historical cost associated with previously unsupported lots | “Tax saved” before computing the actual counterfactual |
| Reconciliation coverage | Supported quantities / total quantities, separately from supported cost / total cost | One overall confidence score |
| Financial misstatement corrected | Difference between independently reviewed correct and baseline computation | Total portfolio value |
| Claim readiness | Required, supplied, valid, conflicting and missing fields/documents | Number of generated forms |
| Accepted first submission | Cases accepted without documentary rework / submitted eligible cases | Cases merely downloaded |
| Time saved | Median hands-on time against the same task done manually | Statutory maximum minus software runtime |
| Assets credited | Actual credited shares with confirmation, plus cash received if any | Indicative value in an unsubmitted claim |
| Days to resolution | Submission, complete-file acknowledgement and final-credit dates separately | Time since opening the app |

Use both successful and failed cases. Separate delays controlled by the claimant, the tool, the institution, and legal proceedings. Report denominators and exclusions.
