# UziPay Gateway API Contract

> Shared contract that all client applications (Meru Chess, Zephyr, AIKC) integrate
> against. Frontend and backend in each repo MUST agree on this document before
> either side codes against it. Keep this file in sync across repos.

## Overview

UziPay is a centralized payment gateway that lets many independent applications
accept payments through a **single Paystack account** and each receive their own
payment events — solving Paystack's "one webhook URL per account" limit.

Every payment is initialized **through the gateway**, which generates the
transaction `reference` and stores `applicationId` against it **before** calling
Paystack. When Paystack fires its single webhook, the gateway looks the reference
up in the DB to resolve the owning app, updates the transaction, and forwards
the event to that app's webhook URL, signed with the gateway's own signature.

**Base URL**: `https://payment.hypercritical.store` (production)
or `http://localhost:8800` (local dev).

**Authentication**: Client applications authenticate using the `x-api-key`
header. Admin endpoints use JWT bearer tokens (not used by client apps).

---

## 1. Client Payment Endpoints

### 1.1 Initialize Payment

`POST /api/payments/initialize`

**Headers**:
```
x-api-key: uzp_live_<48-char-hex>
Content-Type: application/json
```

**Request body**:
```json
{
  "email": "customer@example.com",
  "amount": 5000,
  "currency": "KES",
  "callback_url": "https://your-app.com/payment/callback",
  "customer_name": "John Doe",
  "metadata": { "orderId": "12345" }
}
```

**Field rules**:
- `email` (required, max 254)
- `amount` (required, positive integer, **in major currency units** — UziPay converts to kobo)
- `currency` (optional, 3-letter ISO, default `"KES"`)
- `callback_url` (optional, valid URL — Paystack redirects the donor's browser here)
- `customer_name` (optional, max 120)
- `metadata` (optional, arbitrary JSON object)

**Success response** (200):
```json
{
  "success": true,
  "data": {
    "transaction": { "reference": "yourapp_3k8XmN4pQ9R2sT5v", "status": "pending" },
    "authorization_url": "https://checkout.paystack.com/abc123",
    "access_code": "abc123def456"
  }
}
```

**Reference format**: `{appSlug}_{16-char-nanoid}` — the slug is for human debugging
only. Routing is done by DB lookup on the full reference, never by parsing the slug.

**Errors**: `401 UNAUTHORIZED`, `400 VALIDATION_ERROR`, `502 PROVIDER_ERROR`.

---

### 1.2 Verify Payment

`GET /api/payments/verify/:reference`

**Headers**: `x-api-key: uzp_live_<...>`

**Success response** (200):
```json
{
  "success": true,
  "data": {
    "reference": "yourapp_3k8XmN4pQ9R2sT5v",
    "status": "success",
    "amount": 500000,
    "currency": "KES",
    "email": "customer@example.com",
    "paystackReference": "1234567890",
    "gatewayResponse": { "...": "raw paystack verify response" }
  }
}
```

**Status values**: `pending`, `success`, `failed`, `abandoned`, `refunded`.

**Behavior**: If the transaction is already in a terminal state, the DB value
is returned (the webhook is the source of truth). Otherwise UziPay calls
Paystack's verify endpoint directly.

**Errors**: `401 UNAUTHORIZED`, `404 NOT_FOUND`, `502 PROVIDER_ERROR`.

---

## 2. Webhook Forwarding Contract

When UziPay forwards a Paystack event to your app's `webhookUrl`, it sends:

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `X-Gateway-Signature` | HMAC-SHA256 of the **raw body** using `GATEWAY_SIGNATURE_SECRET` (hex digest) |
| `X-Gateway-App` | Your app's slug (e.g. `meru-chess`, `zephyr`) |
| `X-Gateway-Event` | The Paystack event type (e.g. `charge.success`) |

### 2.1 Signature verification (Node.js / Express)

```js
import crypto from "node:crypto";

app.post(
  "/api/internal/payments",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.header("X-Gateway-Signature");
    const expected = crypto
      .createHmac("sha256", process.env.UZIPAY_GATEWAY_SECRET)
      .update(req.body) // raw Buffer
      .digest("hex");

    if (!sig || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return res.sendStatus(401);
    }
    const event = JSON.parse(req.body.toString());
    // ...handle event...
    res.sendStatus(200);
  }
);
```

> `UZIPAY_GATEWAY_SECRET` on the client side MUST equal UziPay's
> `GATEWAY_SIGNATURE_SECRET`. Distribute out-of-band. Never commit.

### 2.2 Payload shape

The payload is the **raw Paystack event** forwarded as-is:

```json
{
  "event": "charge.success",
  "data": {
    "reference": "yourapp_3k8XmN4pQ9R2sT5v",
    "id": 1234567890,
    "status": "success",
    "amount": 500000,
    "currency": "KES",
    "channel": "card",
    "gateway_response": "Approved",
    "paid_at": "2024-01-15T10:30:00.000Z",
    "customer": { "email": "customer@example.com" },
    "authorization": { "mobile_number": null },
    "metadata": { "orderId": "12345" }
  }
}
```

### 2.3 Expected response

Return HTTP 200–299 to acknowledge. Any 4xx/5xx or 10s timeout triggers UziPay's
retry sweep with exponential backoff (30s, 60s, 120s, …, capped at 30 min, max
`WEBHOOK_RETRY_MAX_ATTEMPTS` = 5 by default). After max attempts the webhook is
marked `dead` and requires manual retry from the UziPay admin UI.

---

## 3. Event Types & Status Mapping

| Paystack event | Transaction status |
|----------------|-------------------|
| `charge.success` | `success` |
| `charge.failed` | `failed` |
| `transfer.success` | `success` |
| `transfer.failed` | `failed` |
| `refund.processed` | `refunded` |
| `transfer.reversed` | `refunded` |

Unhandled event types fall back to `data.status`. Events without a
`data.reference` are acked by UziPay and not forwarded.

---

## 4. Idempotency

### UziPay side
UziPay dedupes inbound Paystack deliveries via a unique
`processedKey = "${reference}::${event}"` on `WebhookLog`. Redeliveries are
acked without re-processing.

### Client side (REQUIRED)
Your webhook handler MUST also be idempotent. The simplest pattern: before
applying an event, look up the local record by `reference`. If it is already
in a terminal state (`success` / `failed` / `refunded`), ack the webhook with
HTTP 200 without re-applying the update. This protects against any duplicate
forwarding edge cases and against your own retry sweeps.

---

## 5. Application Registration

Applications are registered by a UziPay admin via the dashboard
(`https://uzipay.vickkie.store`) or `POST /api/applications` (admin JWT).
Client apps cannot self-register.

Required fields:
- `name` (2–80 chars)
- `slug` (optional, auto-generated from name; lowercase alphanumeric + hyphens)
- `webhookUrl` (required, the public URL UziPay forwards events to)
- `description` (optional, max 500)
- `active` (optional, default `true`)

The response includes `apiKey: uzp_live_<...>` **once**. Store it immediately;
it cannot be retrieved again. Regenerate via
`POST /api/applications/:id/regenerate-key` (admin JWT).

---

## 6. Environment Variables (Client App)

```env
# UziPay gateway
UZIPAY_BASE_URL=https://payment.hypercritical.store
UZIPAY_API_KEY=uzp_live_<48-char-hex>
UZIPAY_GATEWAY_SECRET=<shared with UziPay's GATEWAY_SIGNATURE_SECRET>
UZIPAY_WEBHOOK_URL=https://<your-public-backend-domain>/api/internal/payments
```

`UZIPAY_WEBHOOK_URL` is documentation/verification only — the value that
matters at runtime is the `webhookUrl` saved in UziPay's DB for your app.

---

## 7. Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid `x-api-key` |
| `VALIDATION_ERROR` | 400 | Zod validation failed |
| `NOT_FOUND` | 404 | Transaction not found for this app |
| `PROVIDER_ERROR` | 502 | Paystack API error |
| `INVALID_SIGNATURE` | 401 | Webhook signature mismatch |
| `RATE_LIMITED` | 429 | > 60 req/min on `/api/payments/*` |

---

## 8. End-to-End Flow

```
[Donor browser]
   │ click Pay
   ▼
[Client frontend] ──REST──▶ [Client backend] ──x-api-key──▶ [UziPay]
                              UZIPAY_API_KEY                │ initializes Paystack
                                                            │ stores reference → app
                              ◀──authorization_url──────────┘
   │ redirect
   ▼
[Paystack checkout]
   │ payment completes
   ▼
[Paystack] ──webhook──▶ [UziPay] ──X-Gateway-Signature──▶ [Client /api/internal/payments]
                        verifies                          verifies with UZIPAY_GATEWAY_SECRET
                                                          + idempotency check
                                                          → updates local record
```

The Paystack browser redirect (callback) and the server-to-server webhook are
independent. The callback is for UX only; the webhook is the source of truth.

---

## 9. Production Domains

| Service | Domain |
|---------|--------|
| UziPay backend | `https://payment.hypercritical.store` |
| UziPay dashboard | `https://uzipay.vickkie.store` |
| Paystack webhook target | `https://payment.hypercritical.store/api/paystack/webhook` |

Each client app registers its own public `webhookUrl` in the UziPay dashboard.

---

**Document version**: 1.0
**Source of truth**: `/home/vickkie/projects/UziPay/backend` (V1, Paystack-only)
