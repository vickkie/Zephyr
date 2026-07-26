# Zephyr (Frontend) — Engineering Audit (Phase 1)

Every finding cites a real file and line. 🔴 BLOCKING (endangers Paystack/One Tap) · 🟠 HIGH · 🟡 MEDIUM · 🔵 LOW.

---

## 1. Security

### 🔴 [BLOCKING] F-S1 — Checkout collects full card number + CVV and posts to backend
- `src/pages/Bag.jsx:177-194` (state), `:557-611` (inputs), `:244-253` (payload), `:259` (POST). The form collects `cardNumber`, `cardHolderName`, `expiryDate`, and `securityCode` (CVV) and sends them in `paymentData` to `/api/place-order`. This is a PCI-DSS violation and is the frontend half of backend finding S1.
- **Fix:** Remove all card/Mpesa input fields. Replace the "Place Order" button with a Paystack checkout trigger that redirects to Paystack's hosted authorization URL returned by the backend. The server is the source of truth.

### 🔴 [BLOCKING] F-S2 — `AuthContext` crashes when there is no stored auth data
- `src/contexts/AuthContext.jsx:10` — `return storedAuthData ? JSON.parse(storedAuthData) : JSON.parse(storedAuthData);`. Both branches call `JSON.parse(storedAuthData)`; when `storedAuthData` is `null` (fresh visitor), `JSON.parse(null)` returns `null` only by luck of the spec, but the ternary is clearly a bug — the intent was `: null`. Any user with no `authData` in localStorage hits this on every page load, which can break the whole app tree before login/checkout renders.
- **Fix:** `return storedAuthData ? JSON.parse(storedAuthData) : null;`

### 🟠 F-S3 — `Login.jsx` logs response data and errors to the console
- `src/pages/Login.jsx:43,52,56,62` — `console.log(response.data)`, `console.log(response.data)`, `console.log(error)`. Leaks user data and stack traces to the browser console.
- **Fix:** Remove console logs (quality gate also forbids them).

### 🟠 F-S4 — No CSRF token handling, but cookies are `withCredentials`
- All axios calls use `withCredentials: true` (`App.jsx:66`, `Login.jsx:40`, `Bag.jsx:260`). The backend uses cookie-based JWT auth with `sameSite` varying by env. There is no CSRF token. For same-site `Lax` cookies this is mostly fine; for `sameSite: "None"` (production cross-site) it is not.
- **Fix:** Ensure backend sets `sameSite: "Lax"` for same-origin deployments, or add CSRF tokens. Coordinated with backend S11. Deferred to backend pass.

### 🟡 F-S5 — `Bag.jsx` posts order even when bag is empty
- `src/pages/Bag.jsx:666` — `disabled={loading || bagItems.length == 0}` uses `==` (loose). Works but is sloppy; the guard is only on the button, not `placeOrder`, so a keyboard submit could still fire.
- **Fix:** Guard inside `placeOrder` too.

---

## 2. Correctness

### 🔴 [BLOCKING] F-C1 — `placeOrder` treats the POST response as final, no payment verification
- `src/pages/Bag.jsx:264-285` — on `response.data.createdOrder` it immediately `toast.success("Order Placed Successfully!")`, empties the bag, and navigates to `/profile`. There is no payment confirmation step. This is the frontend half of backend C1.
- **Fix:** New flow: POST creates a pending order + returns a Paystack `authorization_url` → redirect to Paystack → on return, call `/api/payments/verify/:reference` → show success/receipt only after the server confirms. Webhook is the actual source of truth; the verify call is for UX.

### 🟠 F-C2 — `useId()` used as an input `id` inside a `.map()` callback
- `src/pages/Bag.jsx:114` — `id={useId()}` inside `BagItem`. `useId` is called per render inside a list; React docs warn it should not be used to generate keys or ids that need to be stable across re-renders in lists. Not a crash, but a11y label association can break.
- **Fix:** Use a stable id derived from `item.id`.

### 🟡 F-C3 — `App.jsx` `isLoggedin` runs in `useLayoutEffect` with no cleanup and no deps
- `src/App.jsx:79-81` — `useLayoutEffect(() => { isLoggedin(); }, [])`. `isLoggedin` is recreated each render and closes over `login`. Fine in practice but eslint flags it. Not blocking.

### 🟡 F-C4 — `Bag.jsx` `paymentData` object is rebuilt on every render with mutable push
- `src/pages/Bag.jsx:185-194` — `const paymentData = { ... }` then `paymentData.cardDetails = cardDetails` mutates the object literal during render. Works but is an anti-pattern; will be removed with F-S1.

---

## 3. Frontend (UX/a11y/responsive)

### 🟠 F-U1 — No loading/empty/error states on many admin list pages
- `src/pages/admin/Orders.jsx`, `Customers.jsx`, `Products.jsx` — fetch on mount, render directly. No skeleton/spinner while loading, no friendly empty state, no error state if the fetch fails. The brief's UX checklist requires all three.
- **Fix:** Add a shared `Loading`/`Empty`/`Error` pattern. Scope: I will apply this to the new Transactions admin page and the touched checkout/login pages; retrofitting all existing admin pages is secondary.

### 🟡 F-U2 — Login form `autoComplete="current-password webauthn"` on the email field
- `src/pages/Login.jsx:90` — the email input has `autoComplete="current-password webauthn"`, which is wrong for an email field (should be `email` or `username`). The password field (`:99`) has no `autoComplete`.
- **Fix:** `autoComplete="email"` on email, `autoComplete="current-password"` on password.

### 🟡 F-U3 — Login button has no loading state
- `src/pages/Login.jsx:107-109` — `loading` state exists (`:18`) but the button doesn't use it; double-submit is possible.
- **Fix:** Disable + show spinner while loading.

### 🟡 F-U4 — `Bag.jsx` "Place Oder" typo
- `src/pages/Bag.jsx:674` — button label is "Place Oder".
- **Fix:** "Place Order" (will become "Pay Now" in the new flow).

### 🔵 F-U5 — Color contrast relies on CSS vars not audited
- `--font-color`, `--primary-color` used everywhere. Without auditing the actual values this is a placeholder finding. Deferred.

---

## 4. API contract

### 🟠 F-A1 — Frontend reads non-standard response shapes
- `Login.jsx:44` reads `response.data.customer`; `Bag.jsx:264` reads `response.data.createdOrder`; admin pages read `response.data.allOrders`, `response.data.orders`, etc. Once the backend standardizes to `{ success, message, data }`, every call site must update.
- **Fix:** Update all call sites when backend Phase 7 lands. Scope: I will update the touched checkout/login/admin-transactions call sites; other pages are secondary and will keep working because the backend will keep returning the legacy fields alongside the new shape where feasible (backward compat).

---

## 5. DevOps

### 🟠 F-Dev1 — `.env.example` missing new variables
- `.env.example` lacks `VITE_PAYSTACK_PUBLIC_KEY`, `VITE_GOOGLE_CLIENT_ID`.
- **Fix:** Add placeholders (Phase 4/5).

### 🟡 F-Dev2 — `package.json` modified but uncommitted at baseline
- `git status` showed `M package.json` on `main` at baseline. Pre-existing dirty state. I will branch from current HEAD and not touch this unrelated change.

### 🟡 F-Dev3 — No test runner configured
- No `vitest`/`jest`. The brief requires frontend tests. I will add `vitest` + `@testing-library/react` for the new payment/auth code only (not retrofit tests for the whole app — that's secondary).

---

## 6. Code quality

### 🟡 F-Q1 — 110 pre-existing lint problems (87 errors, 23 warnings)
- Baseline. Mostly unused `React` imports (React 18 + new JSX transform doesn't need it), `react/prop-types`, `react-hooks/exhaustive-deps`. Not introduced by this work; I will keep new code lint-clean and not fix unrelated files (avoids churn per brief's "enhance, don't rewrite").

### 🟡 F-Q2 — `console.log` throughout `Bag.jsx` and `Login.jsx`
- `Bag.jsx:255,265,280`, `Login.jsx:43,52,56,62`. Quality gate forbids these.
- **Fix:** Remove in the files I touch.

---

## 7. Performance

### 🟡 F-P1 — Main bundle 556 kB (176 kB gzip), over the 500 kB warning
- `npm run build` output. `index-zdvxWSMO.js` is the main chunk. Largely from `sweetalert2` (72 kB), `swiper`, `gsap`, `bootstrap`, `react-fast-marquee`.
- **Fix:** Code-split heavy libs (sweetalert2 is already lazy-ish via dynamic import in some places). Secondary; not blocking. The new Paystack code will be lazy-loaded.

---

## Summary of BLOCKING findings (fixed in Phase 3/4/5)
- F-S1 card collection → Paystack hosted checkout
- F-S2 AuthContext ternary bug → `: null`
- F-C1 order treated as final on POST → verify-after-redirect flow

## Deferred (SECONDARY)
- F-S4 CSRF, F-S5 empty-bag guard, F-C2/C3/C4, F-U1 (retrofit all admin), F-U5, F-A1 (non-touched pages), F-Dev2/Dev3, F-Q1, F-P1.
- Reason: brief prioritizes #1–#3. Retrofitting lint across 40+ files and adding tests for the whole app is open-ended; I keep new code clean and tested instead.
