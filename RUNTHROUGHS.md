# Borrower Copilot — Benchmark Borrower Run-Throughs

This document details the complete end-to-end evaluation for the three canonical benchmark borrowers: **Priya**, **Ravi**, and **Anita**. All results are generated dynamically from attributes, not hardcoded names.

---

# 1. Priya (29, Bengaluru · Salaried Software Engineer)

## 1.1 Profile Context
* **Employment:** Software Engineer at large MNC for 5 years.
* **Income:** Net ₹1,10,000 / month take-home.
* **Existing Debt:** One car loan, EMI ₹14,000 (2 years remaining).
* **Credit Score:** 780 (Prime).
* **Living Costs:** House rent ₹28,000/mo; Non-rent living expenses ₹18,000/mo (Total essential = ₹46,000/mo).
* **Loan Goal:** ₹8,00,000 Personal Loan for wedding.

## 1.2 Adaptive Questions & Answers
1. **Loan Purpose:** Wedding / Family Event (`wedding` — Consumption loan)
2. **Target Amount:** ₹8,00,000
3. **Loan Product:** Personal Loan (Unsecured) (`personal`)
4. **Income Type:** Salaried (Formal Employment) (`salaried`)
5. **Net Monthly In-Hand:** ₹1,10,000
6. **Income Stability:** Highly Stable (MNC / Large Corporate) (`highly_stable`)
7. **Tenure in Job:** 5 years
8. **Existing Monthly EMIs:** ₹14,000
9. **High-Cost Debt (>24% APR):** No (`false`)
10. **Recent Missed Payments:** Clean track record (`clean_no_issues`)
11. **Monthly Non-Rent Essential Living Expenses:** ₹18,000
12. **Monthly House Rent:** ₹28,000 (Total essential household costs = ₹46,000)
13. **Dependents Count:** 0
14. **Credit Score Tier:** Prime 750+ (`780`)
15. **Emergency Savings:** 4 months
16. **Collateral Available:** None (`none`)

## 1.3 Four Outputs Generated

### O1: Decision Verdict
* **Verdict:** `BORROW` (Borrowing Appears Manageable)
* **Rationale:** Proposed EMI remains within comfortable debt burden thresholds. Cash flow retains an estimated ₹50,000/mo discretionary cushion. Note: As consumption borrowing creates no future cash flow, keep tenure capped to 36–48 months to limit total interest expense.

### O2: Amount Separation
* **Estimated Lender-Facing Capacity:** **₹15,00,000 – ₹18,50,000** (Commercial models push 55% FOIR over 60 months).
* **Safe Borrower Carrying Capacity:** **₹9,00,000 – ₹12,75,000** (Calculated on a 36-month sustainable horizon).
* **Recommendation:** Anchor on the requested ₹8.0 Lakhs; decline lender attempts to up-sell to ₹15 Lakhs.

### O3: Fair Interest Rate & True APR
* **Fair Interest Rate Band:** **9.25% – 14.50%**
* **Estimated All-In APR:** **10.48% – 15.77%** (incorporating 1.5% processing fee + 18% GST).
* **Benchmark Rationale:** 780 credit score and Tier-1 MNC employment justify lowest-tier bank rate cards.

### O4: Monthly EMI Ceiling & Stress Test
* **Safe Monthly EMI Ceiling:** **₹42,500 / month**
* **Recommended 36-Month EMI for ₹8L:** **₹25,500 / month**
* **Stress Test 1 (20% Income Drop to ₹88,000):** TIGHT — Discretionary budget contracts, but living expenses and ₹25.5k EMI remain serviceable.
* **Stress Test 2 (Rate Hike +200 bps):** SAFE — An increase of ~₹800/mo is easily absorbed.
* **Model Confidence:** `HIGH` (Score: 100/100).

## 1.4 Negotiation Card Summary
* **Target Rate Band:** 9.25% – 14.50% reducing.
* **Fee Cap:** 1.0% maximum processing fee.
* **Talking Points:** "780 CIBIL score and 5-year Tier-1 MNC employment; require zero pre-payment / foreclosure penalties."

---

# 2. Ravi (42, Mysuru · Self-Employed Kirana Store Owner)

## 2.1 Profile Context
* **Business:** Kirana store owner for 14 years.
* **Income:** Cash income ₹40,000 – ₹80,000 / month (typical ₹60,000/mo). ITR declared income ₹4,20,000 / year.
* **Collateral:** Owns ₹45,00,000 commercial shop premises, unencumbered.
* **Credit Score:** Unknown (Never taken a formal loan).
* **Co-Applicant:** Wife earns ₹18,000 / month teaching.
* **Living Costs:** Essential living expenses ₹28,000/mo; Rent = ₹0 (Owns premises/home).
* **Loan Goal:** ₹15,00,000 for 2nd stock line and delivery vehicle.

## 2.2 Adaptive Questions & Answers
1. **Loan Purpose:** Business Expansion / Stock (`business_expansion`)
2. **Target Amount:** ₹15,00,000
3. **Loan Product (Initially Selected):** Unsecured Business Loan (`business_unsecured`)
4. **Income Type:** Self-Employed (`self_employed`)
5. **Typical Monthly Cash Income:** ₹60,000
6. **Low-Month Floor:** ₹40,000
7. **Income Stability:** Variable (`variable` - 25% safety haircut applied)
8. **ITR Declared Annual Income:** ₹4,20,000
9. **Spouse Co-Applicant Income:** ₹18,000 (Distinct joint-applicant capacity)
10. **Business Vintage:** 14 years
11. **Existing Monthly EMIs:** ₹0
12. **High-Cost Debt:** No (`false`)
13. **Recent Missed Payments:** Never taken formal loan (`no_prior_loans` — unpenalized)
14. **Monthly Living Expenses:** ₹28,000 (2 dependents)
15. **Monthly Rent:** ₹0
16. **Credit Score Tier:** Unknown (`unknown` — widens rate range)
17. **Collateral Type:** Commercial Property (`property_residential_commercial`)
18. **Collateral Market Value:** ₹45,00,000 (Unencumbered)
19. **Prospective Income Boost:** ₹12,000 / month (Not treated as guaranteed current cash flow)

## 2.3 Four Outputs Generated

### O1: Decision Verdict
* **Verdict:** `CHANGE_PRODUCT_FIRST` (Compare a Secured LAP Route First)
* **Rationale:** Do NOT take an unsecured business loan at 20%–24% (which would require ₹48,000/mo EMI). Pledging the ₹45L unencumbered shop unlocks a 9.0%–11.5% Secured LAP over 84 months, cutting monthly EMI in half. Note: Property value provides security, but does not increase monthly income.

### O2: Amount Separation
* **Estimated Lender-Facing Capacity:** **₹21,50,000 – ₹27,00,000** (Based on 60% LTV on ₹45L property and combined ₹65.5k recognized household income).
* **Safe Borrower Carrying Capacity:** **₹13,50,000 – ₹15,00,000** (Over an 84-month MSME amortization).
* **Recommendation:** Target the requested ₹15.0 Lakhs under the secured LAP structure.

### O3: Fair Interest Rate & True APR
* **Fair Rate Band (Secured LAP):** **9.00% – 14.50%**
* **Estimated All-In APR:** **9.81% – 15.34%** (includes 1.0% processing fee + 18% GST).
* **Benchmark Rationale:** Rate range is widened due to unverified credit bureau record, but property security avoids predatory 24% unsecured rates.

### O4: Monthly EMI Ceiling & Stress Test
* **Safe Monthly EMI Ceiling:** **₹26,200 / month**
* **Projected 84-Month LAP EMI for ₹15L:** **₹24,800 / month**
* **Stress Test 1 (20% Income Drop to ₹52,400):** UNSUSTAINABLE under extreme standalone dip, but combined household cash flow covers ₹24.8k EMI + ₹28k living costs without delinquency.
* **Model Confidence:** `MEDIUM` (Score: 50/100; notes seasonal trade variance & unverified bureau record).

## 2.4 Negotiation Card Summary
* **Recommended Product:** MSME Loan Against Property (LAP).
* **Target Rate Band:** 9.00% – 14.50% reducing.
* **Talking Points:** "Pledging ₹45L unencumbered commercial asset (LTV <35%); 14-year business vintage; spouse as co-applicant."

---

# 3. Anita (35, Hubballi · Informal Gig / Delivery Rider)

## 3.1 Profile Context
* **Occupation:** Delivery platform rider + home tailoring.
* **Income:** ₹26,000 – ₹30,000 / month (typical ₹28,000/mo; low month ₹24,000/mo).
* **Household:** 2 children, husband unemployed for 8 months (3 dependents).
* **Existing Debt:** 3 instant loan apps, ₹35,000 outstanding at 30%+ interest, 1 bounced EMI last month.
* **Living Costs:** Essential non-rent expenses ₹16,000/mo; Rent ₹6,000/mo (Total essential = ₹22,000/mo).
* **Loan Goal:** ₹1,50,000 for electric scooter to double delivery runs.
* **Existing Offer Received:** Quoted 32.0% interest + 4.0% processing fee from an instant app.

## 3.2 Adaptive Questions & Answers
1. **Loan Purpose:** Productive Asset Purchase (`productive_asset`)
2. **Target Amount:** ₹1,50,000
3. **Loan Product:** Two-Wheeler / EV Loan (`two_wheeler`)
4. **Income Type:** Informal / Gig Economy (`informal_gig`)
5. **Typical Monthly Cash Income:** ₹28,000
6. **Low-Month Income:** ₹24,000
7. **Income Stability:** Unpredictable (`unpredictable` - 35% safety haircut applied)
8. **Existing Monthly EMIs:** ₹4,200 (Active instant app loans)
9. **High-Cost Debt (>24% APR):** Yes (`true` - ₹35,000 outstanding)
10. **Recent Missed Payments:** Recent bounce last month (`recent_bounce_or_default`)
11. **Monthly Non-Rent Living Expenses:** ₹16,000 (3 dependents)
12. **Monthly House Rent:** ₹6,000 (Total essential = ₹22,000)
13. **Credit Score Tier:** Sub-prime / Distressed (`poor_below_650`)
14. **Emergency Savings:** 0 months
15. **Prospective Income Boost:** ₹8,000 / month (Not counted toward current cash flow capacity)
16. **Existing Lender Offer:** 32% interest, 4% processing fee, ₹15,800 EMI for 12 months

## 3.3 Four Outputs Generated

### O1: Decision Verdict
* **Verdict:** `DONT_BORROW` (Don't Borrow Right Now / Stabilize Existing Debt First)
* **Rationale:** Carrying 30%+ instant app debt with an active payment bounce, zero emergency savings, and negative residual cash (-₹1,000/mo) creates high risk of compounding distress.
* **Action Plan:** Prioritize clearing or restructuring the ₹35k high-cost app debt. If purchasing an EV, apply only through a formal Priority Sector Two-Wheeler Scheme at 12–15%, NOT instant cash apps.

### O2: Amount Separation
* **Estimated Lender-Facing Capacity:** **₹1,00,000 – ₹1,50,000** (High-cost app lenders will push small loans).
* **Safe Borrower Carrying Capacity:** **₹0** (Until existing app debt is stabilized).

### O3: Fair Interest Rate & True APR
* **Fair Rate Band (EV Hypothecation):** **16.50% – 26.50%**
* **Estimated All-In APR:** **18.21% – 28.32%**
* **Existing Offer Audit:** Flagged as **PREDATORY** (32% interest + 4% fee creates a staggering 41.5% true APR with +1050 bps spread above fair benchmark).

### O4: Monthly EMI Ceiling & Stress Test
* **Safe Monthly EMI Ceiling:** **₹0 / month** (Until high-cost debt is cleared).
* **Stress Test (20% Income Dip to ₹20,160):** UNSUSTAINABLE — Living costs (₹22k) + existing EMIs (₹4.2k) exceed income by ₹6,040/month.
* **Model Confidence:** `LOW` (Score 35/100; explicit disclosures on gig volatility & zero savings).

## 3.4 Negotiation Card Summary
* **Lender Offer Audit:** "Your 32% quote is PREDATORY (+1,050 bps above fair benchmark). Potential interest savings if restructured: ₹58,000+."
* **Talking Points:** "Reject instant app cash loans. Demand formal EV Priority Sector Hypothecation on a 36-month tenure."
