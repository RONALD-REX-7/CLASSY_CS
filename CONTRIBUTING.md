# Contributing to CLASSY_CS

Thank you for your interest in contributing to **CLASSY_CS**! We welcome improvements to academic grading calculations, admission cutoff models, UI components, accessibility, and test coverage.

---

## 🛠️ Development & Environment Setup

1. **Prerequisites**:
   - Node.js `24.x` or `26.x` LTS
   - npm `>= 10.0.0`
2. **Installation**:
   ```bash
   npm install --legacy-peer-deps --no-audit --include=dev
   ```
3. **Local Development Server**:
   ```bash
   npm run dev
   ```

---

## 📐 Engineering Guidelines

- **TypeScript Strictness**: Preserve strict typing across all calculations. Avoid `any` types; define explicit interfaces for academic score vectors and quota cutoffs.
- **Client-Side Determinism**: All calculations must execute client-side with 100% mathematical reproducibility.
- **Privacy & Security**: Never log, transmit, or store personally identifiable student information (register numbers, names, contact numbers). Production authentication uses environment variables (`AUTH_EMAIL_API_KEY`).
- **Test-Driven Verification**: When introducing or adjusting cutoff logic (e.g., TNEA, JEE, NEET formulas), add corresponding unit tests in `src/__tests__/` verifying boundary conditions (zero marks, maximum marks, rounding, and clamping).

---

## 🧪 Verification Commands

Before opening a pull request, ensure all quality checks pass locally:

```bash
# 1. Run ESLint
node ./node_modules/eslint/bin/eslint.js .

# 2. TypeScript typecheck
node ./node_modules/typescript/bin/tsc --noEmit

# 3. Automated unit tests
npm test

# 4. Production build
node ./node_modules/vite/bin/vite.js build
```

---

## 📄 License & Attribution

Contributions are licensed under the [MIT License](LICENSE). By submitting a pull request, you confirm that your contribution complies with this license.
