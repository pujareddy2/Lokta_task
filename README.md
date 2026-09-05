# Borrower Copilot — Personal Loan Self-Assessment & Negotiation Assistant

> **A borrower-first decision-support web application for Indian retail borrowers.**  
> Know if you should borrow, your true safe limit vs. lender capacity, your fair interest rate & all-in APR, and generate a 1-page Negotiation Card to take into the branch.

---

## 🚀 Quick Start (Runs in < 2 minutes)

This project has **zero backend** and requires no external API keys, database setups, or remote configuration.

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

To verify the pure mathematical rules engine against test suites:
```bash
npm run test:rules
```

---

## 💡 The Problem

Every commercial lender in India uses automated underwriting models designed to maximize loan book size and institutional yield. Borrowers walk in blind, accept the first sanction letter offered, and discover years later that they paid 300–500 basis points over fair rates and stretched their debt burden to 65% of income.

**Borrower Copilot** bridges this information gap by providing a transparent, borrower-side self-assessment that answers 4 fundamental questions:

1. **O1: Should I borrow at all?** (`Borrowing Appears Manageable` / `Consider Borrowing Less` / `Don't Borrow / Stabilize First` / `Compare Secured LAP Route`)
2. **O2: How much can a lender likely sanction vs. how much can I safely carry?** (Separates commercial underwriting models from household cash flow limits).
3. **O3: What is a fair interest rate and true all-in APR?** (Accounts for upfront processing fees and 18% GST amortized via IRR).
4. **O4: What monthly EMI ceiling should I agree to?** (Dual FOIR and residual cash buffer constraints, multi-tenure tradeoff schedule, and dual stress tests for income drops and rate hikes).
5. **Negotiation Card:** A single-screen, print-ready, high-contrast summary to hold up to the loan officer in the branch.

---

## 📐 Architecture & Principles

```
User Input (Self-Reported)
        │
        ▼
Adaptive Question Flow (Filtered by condition(profile))
        │
        ▼
Normalized Borrower State (Local React State)
        │
        ▼
Pure Financial Rules Engine (`src/rules/` & `src/calculations/`)
  ├── Income Recognition (Individual vs. Co-applicant Accounting)
  ├── Affordability & FOIR Engine (FOIR Headroom vs. Essential Expense Cushion)
  ├── Fair Rate & All-in APR Matrix (Product Baseline + Credit Adjustment + Fee IRR Solver)
  ├── Loan Capacity Solver (Estimated Lender Capacity vs. Safe Carrying Capacity)
  ├── Stress Testing Simulator (Income Shock -20% & Rate Shock +200 bps)
  └── Model Confidence Evaluator (Informational Completeness & Explicit Disclosures)
        │
        ▼
Immutable Decision Object (`DecisionResult`)
        │
        ▼
Interactive Results Dashboard & 1-Page Printable Negotiation Card
```

### Non-Negotiable Core Principles
* **Borrower-First & Calming:** Designed for borrowers under financial pressure. Non-punitive, supportive, and clear.
* **Unknown is NOT Zero:** An unverified credit score or variable income is never treated as a 300 score. The engine widens the rate band, reduces confidence, and explains why.
* **Separation of Rules from UI:** Zero financial constants or formulas exist inside React components. All logic lives in pure, testable TypeScript modules.
* **100% Private by Design:** Runs entirely inside the client browser. No bureau pulls, no KYC, no remote logging.
* **Every Number Has a "Why":** Every output includes a one-sentence rationale linking to standard retail lending practices.

---

## 👥 Three Benchmark Personas Included

Click any pre-loaded profile on the landing page or top bar to inspect its exact evaluation:

1. **Priya (29, Bengaluru · Salaried MNC Software Engineer):**
   * *Profile:* Net ₹1.1L/mo, Car EMI ₹14k, CIBIL 780, Rent ₹28k, Non-rent living ₹18k. Wants ₹8L personal loan for wedding.
   * *Output:* `BORROW`. Lenders model capacity up to ₹15L–18.5L; Copilot advises capping to the requested ₹8L wedding need on a 36m term; Prime rate band 9.25%–14.50% APR.

2. **Ravi (42, Mysuru · Self-Employed Kirana Store Owner):**
   * *Profile:* Cash income ₹40k–80k/mo, ITR ₹4.2L/yr, unencumbered ₹45L shop premises, no credit score. Wife earns ₹18k teaching. Wants ₹15L for business expansion.
   * *Output:* `COMPARE SECURED LAP ROUTE`. Routes him away from predatory 22% unsecured business loans to a 9.0%–11.5% MSME Loan Against Property (LAP) over 7–10 years.

3. **Anita (35, Hubballi · Informal Gig Delivery Rider):**
   * *Profile:* Delivery rider + tailoring (₹26k–30k/mo), 2 kids, unemployed spouse, 3 instant app loans at 30%+ with 1 recent bounce. Wants ₹1.5L for EV scooter.
   * *Output:* `DON'T BORROW / STABILIZE DEBT FIRST`. Flags severe debt trap risk; safe EMI is ₹0 until toxic app loans are cleared; identifies her 32% app quote as predatory.

---

## 📚 Complete Documentation Links

* [`RULES.md`](./RULES.md) — Comprehensive table documenting every parameter, threshold, rate band, formula, and benchmark source.
* [`RUNTHROUGHS.md`](./RUNTHROUGHS.md) — Step-by-step walkthroughs detailing questions asked, answers, outputs, and negotiation cards for Priya, Ravi, and Anita.

---

## 🛠 Tech Stack

* **Core Framework:** React 18 + TypeScript
* **Build System:** Vite 6
* **Styling:** Tailwind CSS + Custom Design System Tokens (Dark modern fintech palette, mobile-first, print-media optimized)
* **Icons:** Lucide React
* **Testing:** Pure TSX Verification Runner (`npm run test:rules`)
