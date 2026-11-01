<div align="center">

# Classy CS — Academic Planning, GPA/CGPA & Admission Engine

**An auditable, client-first academic evaluation and admission planning platform for Indian engineering & higher education.**

[![CI](https://github.com/RONALD-REX-7/CLASSY_CS/actions/workflows/ci.yml/badge.svg)](https://github.com/RONALD-REX-7/CLASSY_CS/actions/workflows/ci.yml)
[![Tests: Vitest (31 Passing)](https://img.shields.io/badge/Vitest-31%20Passed-22c55e.svg)](https://vitest.dev/)
[![React 19](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📌 Executive Overview

**Classy CS** is an academic planning, performance tracking, and admission pathway evaluation suite designed for high school and undergraduate engineering students. It consolidates semester GPA/CGPA computation, 10th/12th board marks tracking, and government admission cutoff engines into a unified, privacy-safe web application.

Unlike generative AI tools that hallucinate admission numbers, Classy CS implements a **deterministic, rule-based verification engine** with full audit trails. Every eligibility outcome and calculated cutoff score traces directly back to published admission authority formulas (TNEA, JoSAA/JEE Main, JEE Advanced, and NEET UG).

> [!IMPORTANT]
> **Advisory & Provenance Notice**: Admission cutoffs, reservation criteria, and eligibility rules implemented in this repository are based on published government formulas (such as TNEA 200-point reduced scoring and JoSAA 75% eligibility criteria). Historical cutoffs and sample student profiles provided in demo modes are illustrative benchmarks and do **not** constitute official counselling advice or live government seat allotment. Always verify against official counselling portals during active admission cycles.

---

## ✨ Core Engines & Capabilities

### 1. 🎓 University GPA / CGPA Calculation Engine
- **Formula Standards**: Full support for Anna University and Indian autonomous engineering 10-point scale:
  $$\text{Semester GPA} = \frac{\sum (\text{Credits}_i \times \text{Grade Point}_i)}{\sum \text{Credits}_i}$$
  $$\text{CGPA} = \frac{\sum_{\text{all}} (\text{Credits}_i \times \text{Grade Point}_i)}{\sum_{\text{all}} \text{Credits}_i}$$
- **Grade Scale Mapping**: `O (10)`, `A+ (9)`, `A (8)`, `B+ (7)`, `B (6)`, `C (5)`, `U (0)`, `AB (0)`.
- **Performance Rating Bands**: Automated classification into *Excellent* ($\ge 9.0$), *Very Good* ($\ge 8.0$), *Good* ($\ge 7.0$), *Average* ($\ge 6.0$), and *Needs Improvement* ($< 6.0$).
- **Export Capabilities**: Client-side high-resolution PDF report and CSV data export via `jspdf` and `jspdf-autotable`.

### 2. 🏛️ Tamil Nadu Engineering Admissions (TNEA) Engine
- **Reduced Scoring Algorithm**: Deterministic transformation mapping Class 12 board marks to the official 200-point scale:
  $$\text{TNEA Cutoff} = \text{Mathematics} + \frac{\text{Physics}}{2} + \frac{\text{Chemistry}}{2}$$
- **Category Quota Auditing**: Encodes Tamil Nadu reservation allocations across categories:
  - **OC** (Open Competition): 31%
  - **BC** (Backward Class): 26.5%
  - **MBC / DNC** (Most Backward / Denotified): 20%
  - **SC** (Scheduled Caste): 15%
  - **SCA** (SC Arunthathiyars): 3%
  - **ST** (Scheduled Tribe): 1%
- **Audit Trails**: Every score calculation includes full intermediate step recording (`inputs`, `intermediateValues`, `formulaVersion`, `timestamp`).

### 3. 🎯 National Competitive Exam Planners
- **JEE Main**: Class 12 PCM eligibility evaluation, 75% aggregate aggregate check (or top 20 percentile), and NIT/IIIT/GFTI qualifying bands.
- **JEE Advanced**: Category-specific qualifying percentile gating and IIT admission criteria.
- **NEET UG**: PCB subject requirement verification and medical seat competitiveness categorization.

### 4. ⚖️ Rule Versioning & Conflict Detection Engine
- **Rule Freshness**: Automated tagging of rules as `Current` vs `HISTORICAL` based on active academic cycle.
- **Multi-Source Conflict Detection**: Detects and flags discrepancy if multiple sources report divergent cutoffs for the same quota.

---

## 🗺️ Application Route Topology

| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/` | `Landing.tsx` | Overview, feature discovery, and entry point |
| `/calculator` | `Calculator.tsx` | Interactive credit-weighted Semester GPA & CGPA calculator |
| `/dashboard` | `Dashboard.tsx` | Unified student academic dashboard and performance metrics |
| `/school` | `School.tsx` | 10th and 12th board marks entry, subject analytics, and normalization |
| `/admission` | `Admission.tsx` | Admission pathway hub and eligibility analyzer |
| `/admission/tnea` | `TNEAPlanner.tsx` | Dedicated TNEA cutoff calculation, category rules, and choice list helper |
| `/admission/jee` | `JEEPlanner.tsx` | JEE Main & Advanced eligibility and NIT/IIT pathway planner |
| `/admission/neet` | `NEETPlanner.tsx` | NEET UG medical cutoff and percentile competitiveness planner |
| `/college` | `College.tsx` | Institutional directory, tier categorization, and branch matching |
| `/my-classy` | `MyClassy.tsx` | Saved academic pathways and target institution tracker |
| `/auth` | `Auth.tsx` | Authentication portal (Email OTP & Demo anonymous access) |

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/) with [Vite 7](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF) & `jspdf-autotable`
- **Testing**: [Vitest 4](https://vitest.dev/) (31 automated unit tests)
- **Backend & Database**: [Convex](https://www.convex.dev/) (Serverless document store & reactive queries)
- **Package Management**: Standard `npm` with Node.js `>=20.19.0`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>=20.19.0` (LTS recommended)
- **npm**: `>=10.0.0`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/RONALD-REX-7/CLASSY_CS.git
cd CLASSY_CS

# Deterministic install using project .npmrc configuration:
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```bash
# Convex Deployment Endpoint (optional for offline calculator & admission engines)
VITE_CONVEX_URL="https://your-deployment.convex.cloud"

# Application Branding
VLY_APP_NAME="Classy CS"
```

### 3. Run Locally
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Verification & Automated Testing

Classy CS includes a comprehensive Vitest test suite (`src/lib/admissions/__tests__/engines.test.ts`) validating 31 pure-function assertions:

```bash
# Run unit test suite
npm test

# Run ESLint validation
npm run lint

# Run TypeScript typecheck & production build
npm run build
```

### Test Verification Coverage:
- **TNEA Calculation**: Standard PCM, zero marks, maximum marks (200.0), mark clamping, missing subject handling, and full audit payload generation.
- **TNEA Eligibility**: Class 12 PCM prerequisites, Tamil Nadu domicile checks, and category-specific quota rules (OC, BC, MBC, DNC, SC, SCA, ST).
- **JEE Main & Advanced**: 75% aggregate board criteria, top-20 percentile verification, and IIT qualification gating.
- **NEET UG**: PCB subject requirement verification and score competitiveness bands.
- **Rule Engine**: Rule freshness detection, multi-source conflict resolution, and deterministic audit trail generation.

---

## 🔒 Security & Privacy Standards

- **Zero Data Exposure**: No personal student credentials, university register numbers, or identifying marks are retained or transmitted to external servers.
- **Privacy-Safe Auth**: Production OTP credentials use environment-variable-injected API keys (`AUTH_EMAIL_API_KEY`); fallback mock auth is provided for local exploration.
- **Client-Side Execution**: All GPA/CGPA mathematics and admission cutoff evaluations execute entirely inside the client's browser without external API dependence.

---

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**.
