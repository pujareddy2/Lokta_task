# Borrower Copilot — Financial Rules, Thresholds & Assumptions

This document specifies every financial rule, threshold, calculation formula, and risk adjustment employed by **Borrower Copilot**. Every parameter is traceable, defensible, and isolated in code (`src/data/assumptions.ts` and `src/rules/`).

---

## 1. Summary of Financial Rules & Thresholds

| Rule / Parameter | Model Value | Why It Exists & How It Works | Source / Classification |
| :--- | :--- | :--- | :--- |
| **Salaried FOIR Cap** | **50%** | Total monthly debt servicing (existing + proposed EMI) is capped at 50% of take-home pay. | My modelling judgement (Conservative banking benchmark) |
| **High-Income Salaried FOIR Cap** | **55%** | Higher income earners (>₹1,00,000/mo net) have higher discretionary cash buffer to absorb obligations. | My modelling judgement |
| **Self-Employed Stable FOIR Cap** | **45%** | Accounts for business overheads and working capital cycles. | My modelling judgement (MSME credit policy standard) |
| **Self-Employed Variable FOIR Cap** | **40%** | Protects cash-heavy and seasonal businesses from over-leveraging during lean trading months. | My modelling judgement |
| **Informal / Gig FOIR Cap** | **35%** | Strictest debt ceiling to protect volatile platform and daily earners from default during lean order periods. | My modelling judgement |
| **Essential Non-Rent Living Buffer** | **₹12,000/mo base** | Minimum baseline living cash cushion that EMIs must never consume. | My modelling judgement |
| **Dependent Cash Reserve** | **₹4,000/mo per dependent** | Incremental living allowance reserved per dependent (children, non-working spouse, elderly parents). | My modelling judgement |
| **Separated Rent vs Non-Rent Living** | **Explicit Q12/Q13 split** | Essential household living expenses (food, schooling, utilities, medical, transport) are entered separately from house rent to prevent double counting. Total essential costs = Non-rent living + Rent. | My modelling judgement (Design correction) |
| **Spouse / Co-Applicant Income** | **Distinct Accounting** | Spouse/family income is accounted for as joint household capacity, not the borrower's personal income. Notes that lenders require formal co-applicant documentation. | My modelling judgement |
| **Stable Salaried Income Recognition** | **100% (0% haircut)** | Stable MNC/Govt salary credits are recognized at full value. | My modelling judgement |
| **Moderate Stability Recognition** | **90% (10% haircut)** | Accounts for minor private-sector bonus or commission volatility. | My modelling judgement |
| **Variable Business Recognition** | **75% (25% haircut)** | Blends ITR declared income with stated cash income to absorb seasonal business cycles. | My modelling judgement |
| **Informal / Gig Income Recognition** | **65% (35% haircut)** | Anchored 70% to stated low-month income floor to ensure debt is serviceable during seasonal slumps. | My modelling judgement |
| **Personal Loan Rate Benchmark** | **10.50% – 16.00%** | Baseline prime to retail band for unsecured personal loans. | Illustrative retail market benchmark |
| **Unsecured Business Loan Benchmark** | **14.00% – 24.00%** | Working capital loans without collateral carry high risk spreads. | Illustrative NBFC retail benchmark |
| **Secured LAP / MSME Benchmark** | **9.00% – 11.50%** | Secured lending against unencumbered residential or commercial property. | Illustrative bank benchmark |
| **Two-Wheeler / EV Loan Benchmark** | **11.50% – 17.50%** | Vehicle hypothecation financing. | Illustrative 2W NBFC benchmark |
| **Gold Loan Benchmark** | **8.50% – 13.00%** | Instant liquid collateral with statutory LTV caps. | Illustrative bank benchmark |
| **Home Loan Benchmark** | **8.40% – 9.75%** | Sovereign/Repo-linked mortgage benchmark. | Illustrative retail mortgage benchmark |
| **Prime Credit Tier (750+)** | **-75 bps to -50 bps** | Prime credit standing is typically associated with lower pricing eligibility. | TransUnion CIBIL Prime Tier / My judgement |
| **Good Credit Tier (700–749)** | **0 bps to +50 bps** | Standard retail card rate. | My modelling judgement |
| **Average Credit Tier (650–699)** | **+150 bps to +250 bps** | Average credit history carries an additional risk spread. | My modelling judgement |
| **Poor Credit Tier (<650)** | **+350 bps to +600 bps** | Sub-prime or distressed credit history faces high risk pricing. | My modelling judgement |
| **Unverified / Unknown Credit Score** | **0 bps to +300 bps widening** | **Unknown is NOT zero / NOT a 300 score.** Widens the rate band and reduces confidence without penalizing the borrower. | My modelling judgement (Core challenge rule) |
| **Standard Processing Fee** | **1.0% – 2.0%** | Typical upfront administrative deduction from principal disbursal. | Illustrative bank fee benchmark |
| **GST on Processing Fees** | **18%** | Statutory Goods & Services Tax on financial administrative charges. | Indian GST Act (Sec 12) |
| **All-In APR Solver** | **Internal Rate of Return (IRR)** | Computes true annualized cost where Net Disbursed = Principal - (Processing Fee + GST). Amortized over loan cash flows. | Standard Financial Mathematics / RBI Digital Lending Guidance |
| **Income Stress Shock** | **-20% take-home drop** | Simulates downtime, medical emergency, or business slump. | My modelling judgement |
| **Interest Rate Stress Shock** | **+200 bps (+2.0%)** | Simulates benchmark tightening on floating interest rate contracts. | My modelling judgement |
| **"Don't Borrow" Risk Trigger** | **Multi-factor distress** | Triggers when carrying active high-cost debt (>24% APR) combined with recent payment bounce, zero emergency cushion, or negative residual cash. | My modelling judgement |
| **"Borrow Less" Risk Trigger** | **Requested > 1.20x Safe Capacity** | Triggers when requested loan would breach comfortable living cushions. | My modelling judgement |
| **Secured LAP Routing Trigger** | **Self-employed + Property $\ge$ 1.5x loan** | Routes self-employed borrowers with unencumbered property to 10% LAP instead of 22% unsecured business loans. Property value is treated as collateral capacity, NOT monthly income. | My modelling judgement |

---

## 2. Core Mathematical Formulas

### 2.1 Reducing Balance Monthly EMI
$$\text{EMI} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$
Where:
* $P$ = Loan Principal
* $r$ = Monthly Interest Rate ($\frac{\text{Annual Rate}}{12 \times 100}$)
* $n$ = Loan Tenure in Months

### 2.2 Inverse Principal Supported by Safe EMI Ceiling
$$P_{\text{safe}} = \frac{\text{EMI}_{\text{safe}} \cdot ((1 + r)^n - 1)}{r \cdot (1 + r)^n}$$

### 2.3 Safe EMI Ceiling Determination (Dual Constraints)
$$\text{Total Essential Expenses} = \text{Non-Rent Essential Living Costs} + \text{House Rent}$$
$$\text{Debt Headroom} = (\text{Recognized Income} \times \text{FOIR Cap}) - \text{Existing EMIs}$$
$$\text{Residual Cash Buffer} = \text{Recognized Income} - \text{Existing EMIs} - \text{Total Essential Expenses}$$
$$\text{Safe EMI Ceiling} = \max\left(0, \min(\text{Debt Headroom}, \text{Residual Cash Buffer} \times 0.85)\right)$$

### 2.4 All-In APR Calculation (Newton-Raphson IRR Solver)
$$\text{Net Disbursed} = P - (\text{Processing Fee} \times (1 + \text{GST}))$$
$$\text{Net Disbursed} = \sum_{t=1}^{n} \frac{\text{EMI}}{(1 + r_{\text{apr}})^t}$$
$$\text{APR} = r_{\text{apr}} \times 12 \times 100$$

---

## 3. Known Limitations & Explicit Boundaries

1. **Self-Reported Data:** Calculations run locally from self-reported numbers without automated bureau verification or account aggregation.
2. **Indicative Guidance:** Estimates are modelled on standard commercial policies and do not guarantee sanction by any specific financial institution.
3. **Property Valuation:** Collateral-backed estimates assume clear, marketable, and unencumbered legal title.
4. **Decision Support:** This application provides self-assessment guidance to support informed borrower negotiation; it is not a credit broker or lender.
