import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header, Footer } from "../components";
import { api, unwrap } from "../utils/api";

/**
 * Paystack redirect target.
 *
 * After the user pays on Paystack's hosted checkout, they're redirected here
 * with `?reference=...` (and `?trxref=...`). We call the backend verify
 * endpoint to get the server's verdict. The webhook is the actual source of
 * truth; this verify call is for UX so the customer sees the right state.
 *
 * States: loading -> (pending -> polling) -> success | failed | abandoned
 */
const PaystackCallback = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [state, setState] = useState("loading"); // loading|pending|success|failed|abandoned
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const pollCount = useRef(0);

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setError("No payment reference was returned. If you were charged, contact support with your order details.");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/api/payments/verify/${encodeURIComponent(reference)}`);
        const d = unwrap(res);
        setData(d);
        setState(d.status || "pending");
      } catch (err) {
        const msg = err?.payload?.message || err?.message || "Could not verify your payment.";
        setError(msg);
        setState("failed");
      }
    };

    verify();
  }, [reference]);

  // Poll up to 3 times if the gateway says pending (webhook may not have landed).
  useEffect(() => {
    if (state !== "pending") return;
    if (pollCount.current >= 3) return;
    const t = setTimeout(async () => {
      pollCount.current += 1;
      try {
        const res = await api.get(`/api/payments/verify/${encodeURIComponent(reference)}`);
        const d = unwrap(res);
        setData(d);
        if (d.status && d.status !== "pending") {
          setState(d.status);
        }
      } catch {
        // keep pending; the webhook may still finalize
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [state, reference]);

  const retry = () => {
    setState("loading");
    setError("");
    pollCount.current = 0;
    // re-trigger the verify effect by toggling state then re-running
    setTimeout(() => {
      api
        .get(`/api/payments/verify/${encodeURIComponent(reference)}`)
        .then((res) => {
          const d = unwrap(res);
          setData(d);
          setState(d.status || "pending");
        })
        .catch((err) => {
          setError(err?.payload?.message || "Could not verify your payment.");
          setState("failed");
        });
    }, 300);
  };

  return (
    <>
      <Header />
      <main
        className="container-fluid position-relative p-0"
        style={{ minHeight: "60vh" }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-7 col-lg-5">
              <div className="card container-fluid p-4">
                <div className="card-body p-3 text-center">
                  {state === "loading" && (
                    <>
                      <span
                        className="spinner-border spinner-border-sm text-dark me-2"
                        aria-hidden="true"
                      ></span>
                      <h2 className="card-heading text-uppercase fs-4 font-color mb-2">
                        Confirming Payment
                      </h2>
                      <p className="product-card-price font-color">
                        Please wait while we confirm your payment with the
                        gateway…
                      </p>
                    </>
                  )}

                  {state === "pending" && (
                    <>
                      <h2 className="card-heading text-uppercase fs-4 font-color mb-2">
                        Payment Pending
                      </h2>
                      <p className="product-card-price font-color">
                        We haven&apos;t received final confirmation yet. This
                        usually resolves within a few seconds.
                      </p>
                      <p className="product-card-price font-color">
                        Reference: {reference}
                      </p>
                      <span
                        className="spinner-grow spinner-grow-sm text-dark me-2"
                        aria-hidden="true"
                      ></span>
                    </>
                  )}

                  {state === "success" && (
                    <>
                      <div className="mb-3" aria-hidden="true">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--primary-color)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h2 className="card-heading text-uppercase fs-4 font-color mb-2">
                        Payment Successful
                      </h2>
                      <p className="product-card-price font-color">
                        Thank you! Your order has been placed.
                      </p>
                      {data && (
                        <ul className="list-unstyled product-card-price font-color text-start my-3">
                          <li>Reference: {data.reference}</li>
                          <li>
                            Amount: {data.currency} {data.amount}
                          </li>
                          {data.gatewayReference && (
                            <li>Gateway Ref: {data.gatewayReference}</li>
                          )}
                          <li>Status: {data.paymentStatus}</li>
                        </ul>
                      )}
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <Link
                          to="/orders"
                          className="btn text-uppercase py-3 px-4"
                          style={{ fontSize: "0.88rem" }}
                        >
                          View Orders
                        </Link>
                        <Link
                          to="/"
                          className="btn text-uppercase py-3 px-4"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </>
                  )}

                  {(state === "failed" || state === "abandoned") && (
                    <>
                      <div className="mb-3" aria-hidden="true">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--font-color)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <h2 className="card-heading text-uppercase fs-4 font-color mb-2">
                        {state === "abandoned"
                          ? "Payment Abandoned"
                          : "Payment Failed"}
                      </h2>
                      <p className="product-card-price font-color">
                        {error || "Your payment could not be completed."}
                      </p>
                      {reference && (
                        <p className="product-card-price font-color">
                          Reference: {reference}
                        </p>
                      )}
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <button
                          type="button"
                          className="btn text-uppercase py-3 px-4"
                          style={{ fontSize: "0.88rem" }}
                          onClick={retry}
                        >
                          Retry Verification
                        </button>
                        <Link
                          to="/bag"
                          className="btn text-uppercase py-3 px-4"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Back to Bag
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaystackCallback;
