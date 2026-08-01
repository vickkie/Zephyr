# UziPay Integration Progress — Zephyr

> **Read this file first** if resuming after an interruption. Resume from the
> first unchecked item. Commit progress updates on their own
> (`docs: update progress log`) so state is recoverable mid-phase.

Branch: `fix/uzipay-integration` (both Zephyr repos)
Logical group: **Zephyr** (do this AFTER Meru Chess is done)

## Repos in this group
- `Zephyr` — React + Vite frontend, has full Paystack checkout + callback
- `Zephyr-Backend` — Express + Mongoose, has full Paystack integration

## Current state (pre-integration)
- Backend has `controllers/paymentController.js` (599 lines) with
  initialize/verify/webhook, `services/paystackService.js`,
  `utils/paystackWebhook.js`, `models/Transaction.js`.
- Frontend `Bag.jsx` calls `POST /api/payments/initialize` and redirects to
  `authorization_url`. `PaystackCallback.jsx` polls
  `GET /api/payments/verify/:reference`.
- Admin transaction pages exist (`Transactions.jsx`, `TransactionDetails.jsx`).
- No donations, memberships, or subscriptions.
- **Security note**: `models/Payment.js` and `models/CreditCard.js` store
  plaintext card data — DEPRECATED, out of scope for this integration but
  flagged in audit.

## Integration approach
**Replace direct Paystack calls with UziPay gateway calls.** Same surface area,
different upstream. The existing Paystack controller becomes a UziPay client.
Frontend changes are minimal — it already redirects to `authorization_url`.

## Phase checklist

### Phase 0 — Setup & contracts
- [x] Create `docs/uzipay-api-contract.md` in both repos
- [x] Create `docs/progress.md` in both repos
- [x] Branch `fix/uzipay-integration` created in both repos
- [ ] Register Zephyr app in UziPay dashboard (slug: `zephyr`)
      — record `apiKey` and `webhookUrl`
- [ ] Confirm `GATEWAY_SIGNATURE_SECRET` is shared with this app's
      `UZIPAY_GATEWAY_SECRET`

### Phase 1 — Backend: UziPay service + env
- [ ] Add UziPay env vars to `.env.example` (`UZIPAY_BASE_URL`,
      `UZIPAY_API_KEY`, `UZIPAY_GATEWAY_SECRET`, `UZIPAY_WEBHOOK_URL`)
- [ ] Create `services/uzipayService.js` (initialize + verify, mirrors
      `paystackService.js` shape)
- [ ] Add env validation for UziPay vars

### Phase 2 — Backend: webhook receiver with idempotency
- [ ] Create `utils/uzipayWebhook.js` — signature verification helper
      (HMAC-SHA256, raw body, timing-safe compare)
- [ ] Add `uzipayWebhook` handler in `paymentController.js` exposing
      `POST /api/internal/payments`
- [ ] Idempotency: look up Transaction by `reference`; if terminal status,
      ack 200 without re-applying
- [ ] On `charge.success`: update Transaction, update Order paymentStatus,
      send confirmation (reuse existing flow)
- [ ] Mount route BEFORE `express.json()` with `express.raw`
- [ ] Add `X-Gateway-*` headers to CORS allowed headers
- [ ] Add UziPay webhook route to `routes/paymentRoute.js`

### Phase 3 — Backend: swap Paystack calls for UziPay
- [ ] In `paymentController.js` `initializePayment`: replace direct Paystack
      call with `uzipayService.initializePayment`
- [ ] In `verifyPayment`: replace direct Paystack verify with
      `uzipayService.verifyPayment`
- [ ] Disable/remove old `/api/payments/webhook` route (Paystack no longer
      sends to it directly)
- [ ] Keep Transaction model fields — they still apply, populated from
      forwarded events

### Phase 4 — Backend: tests
- [ ] Add `tests/uzipayWebhook.test.js` covering: invalid signature 401,
      duplicate delivery idempotency, charge.success happy path, unknown
      reference ack
- [ ] Run `npm test` — all green

### Phase 5 — Frontend: minimal changes
- [x] `PaystackCallback.jsx`: kept original name for backward compat. It
      already polls `GET /api/payments/verify/:reference` which the backend
      now proxies to UziPay. NO change needed.
- [x] `Bag.jsx`: already redirects to `authorization_url` — NO change needed.
- [x] Verified `callback_url` in `Bag.jsx` points to
      `${window.location.origin}/paystack/callback` (kept path for compat)
- [x] `.env.example` already exists with `VITE_SERVER`,
      `VITE_PAYSTACK_PUBLIC_KEY`, `VITE_GOOGLE_CLIENT_ID` — NO change needed
- [x] No frontend code changes required — the existing flow works with UziPay
      because it uses the backend's `authorization_url` and `verify` endpoints

### Phase 6 — Review & PRs
- [ ] Independent review (subagent) — security, idempotency, regressions,
      deprecated Payment/CreditCard models, code style
- [ ] Fix review findings
- [ ] Open PR in `Zephyr-Backend` with full PR description template
- [ ] Open PR in `Zephyr` with full PR description template
- [ ] Cross-link both PRs to each other
- [ ] Do NOT merge

## Decisions log
- 2026-07-27: Chose **replace Paystack with UziPay** (not multi-gateway).
  Zephyr has no other payment gateway to preserve except the deprecated
  plaintext-card models which are out of scope.
- 2026-07-27: Webhook endpoint path is `/api/internal/payments` to match
  AIKC and Meru Chess integrations.
- 2026-07-27: Keep Transaction model unchanged — `reference`,
  `gatewayReference`, `authorizationUrl`, `method` fields still apply.
- 2026-07-27: Frontend likely needs NO code changes — it already uses
  `authorization_url` redirect + verify polling. Only add `.env.example`.

## Blockers
- (none yet)
