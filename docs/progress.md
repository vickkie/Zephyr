# Zephyr (Frontend) — Progress Log

> Source of truth for session continuity. Read this FIRST when resuming.
> Branch: `fix/enhancement` (to be created). Do not push to `main`.

## Mission priority (per brief)

1. Paystack payment flow (checkout UI: loading/pending/success/failure/retry + receipt)
2. Google One Tap (alongside existing login)
3. Fixes for audit findings that block/endanger #1 and #2
4. UX/design enhancements only on touched areas (checkout, admin transactions, login)
5. Everything else — secondary

## Phase checklist

### Phase -1 — Session continuity

- [x] Create `docs/progress.md` (this file)
- [ ] Commit progress.md

### Phase 0 — Baseline

- [ ] Install dependencies
- [ ] Build / run successfully
- [ ] Run existing test suite (lint, build) — record results
- [ ] Record Node, framework, dependency versions
- [ ] Log baseline in progress.md

### Phase 1 — Audit

- [ ] Create `docs/audit-frontend.md` with file/line-cited findings
- [ ] Architecture, Correctness, Frontend (a11y, responsive, states), Security, API, DevOps, Code quality, Performance

### Phase 2 — Branching

- [ ] Create `fix/enhancement`
- [ ] Consume shared API contracts from backend `docs/`

### Phase 3 — Resolve audit findings (priority: blocking payments/auth)

- [ ] Fix blocking findings
- [ ] Secondary findings deferred with reason

### Phase 4 — Paystack checkout (frontend)

- [ ] Checkout flow: loading, pending, success, failure, retry states
- [ ] Receipt/confirmation view
- [ ] Match existing design language
- [ ] Frontend redirect never finalizes payment (server confirms)

### Phase 5 — Google One Tap (frontend)

- [ ] Add One Tap alongside existing login (do not replace)
- [ ] Send ID token to backend for verification

### Phase 6 — UX & design enhancements

- [ ] Apply to touched areas only (checkout, admin transactions, login)
- [ ] Maintain existing component hierarchy, spacing, typography, color

### Phase 7 — API standards

- [ ] Frontend consumes standardized response shapes

### Phase 8 — Testing

- [ ] lint, type check, build, unit/integration tests
- [ ] UX checklist: loading/success/error/empty/retry/validation/no layout shift

### Phase 9 — Code quality gates

- [ ] No TODO/console.log/dead code/debug statements

### Phase 10 — Independent review

- [ ] Reviewer sub-agent; address findings; document

### Phase 11 — Final self-review

- [ ] Challenge every implementation; update progress.md

### Phase 12 — PR

- [ ] Push `fix/enhancement`
- [ ] Open PR (unmerged), cross-link to backend PR
- [ ] PR includes screenshots, test cards, env vars, setup steps

## Decision log

- (to be filled)

## Blockers

- **Credentials precheck:** Google OAuth client ID (`VITE_GOOGLE_CLIENT_ID`) and Paystack public key (`VITE_PAYSTACK_PUBLIC_KEY`) are NOT available in this environment. Code reads them from env vars. User must supply real values for live testing.

## Baseline (Phase 0)

- Node: v22.23.1, npm: 10.9.8
- Framework: React 18.2, Vite 5.1, React Router 6.22, Bootstrap 5.3, Formik + Yup, GSAP, Swiper, axios, react-toastify, sweetalert2
- Package manager: npm (package-lock.json present)
- `npm install`: OK (684 packages, 39 vulnerabilities: 4 low, 14 moderate, 19 high, 2 critical — pre-existing)
- `npm run build`: SUCCESS (dist produced; main chunk 556 kB / 176 kB gzip — over 500 kB warning, pre-existing)
- `npm run lint`: FAILS — 110 problems (87 errors, 23 warnings). Pre-existing baseline. Mostly `no-unused-vars` (unused `React` imports), `react-hooks/exhaustive-deps`, `react/prop-types`. These are pre-existing and NOT introduced by this work; I will not fold them into enhancement commits.
- Test suite: NONE. No test runner configured (no vitest/jest). Baseline = 0 tests.
- Notable pre-existing issues (detailed in audit-frontend.md): Bag.jsx collects card numbers/CVV in plaintext and posts to backend; Login.jsx has `console.log` of response data; AuthContext reads `localStorage.getItem("authData")` then `JSON.parse(storedAuthData)` in both branches of ternary (crashes when null).
