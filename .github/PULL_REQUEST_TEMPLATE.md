## Description
<!-- Brief 1-2 sentence description of the change and its engineering purpose -->

## Technical Scope
- [ ] Core admission / GPA calculation engine
- [ ] Academic rule updates (TNEA, JEE, NEET)
- [ ] UI components, responsive layout & accessibility
- [ ] CI/CD automation & static analysis
- [ ] Documentation & test coverage

## Seven-Stage Project Status Lifecycle Alignment
- [ ] Stage 1: Planned (Concept or admission formula specification)
- [ ] Stage 2: Implemented in software (Logic implemented and compiles)
- [ ] Stage 3: Software tested (Unit tested with automated test assertions)

## Quality & Security Verification
- [ ] **Zero Data Exposure**: Confirmed no student credentials or private tokens are introduced.
- [ ] **Static Analysis**: ESLint exited 0 with 0 errors.
- [ ] **Typecheck**: TypeScript `tsc --noEmit` passed.
- [ ] **Unit Tests**: All unit tests in `src/__tests__/` passed.
- [ ] **Production Build**: Production bundle builds successfully with Vite.
