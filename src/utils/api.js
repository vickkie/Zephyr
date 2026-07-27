import axios from "axios";

const { VITE_SERVER } = import.meta.env;

/**
 * Pre-configured axios instance for the Zephyr backend.
 * Uses `withCredentials` so the auth cookie is sent/received.
 */
export const api = axios.create({
  baseURL: VITE_SERVER,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * Unwrap the standardized backend envelope `{ success, message, data }`.
 * Returns `data` on success and throws a normalized Error on failure so
 * call sites can `try/catch` uniformly.
 */
export const unwrap = (response) => {
  const body = response.data || {};
  if (body.success === false) {
    const err = new Error(body.message || "Request failed");
    err.payload = body;
    throw err;
  }
  return body.data ?? body;
};

/**
 * Convert a Paystack smallest-unit amount (kobo/cents) to a whole-currency
 * display string. All Paystack-supported currencies (KES, NGN, USD, ZAR, GHS)
 * use 2-decimal smallest units, so divide by 100. If a zero-decimal currency
 * is added in the future, add it to NO_DECIMALS.
 */
const NO_DECIMALS = [];
export const fromSmallestUnit = (amountSmall, currency = "KES") => {
  const divisor = NO_DECIMALS.includes(currency) ? 1 : 100;
  return (Number(amountSmall) / divisor).toFixed(2);
};
