import { useContext, useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BagContext from "../contexts/BagContext";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { toast } from "react-toastify";
import { Header } from "../components";
import { AuthContext } from "../contexts/AuthContext";
import { api, unwrap } from "../utils/api";

const { VITE_PAYSTACK_PUBLIC_KEY } = import.meta.env;

// eslint-disable-next-line react/prop-types
const BagItem = ({ id, image, productName, quantity, salePrice }) => {
  const { increaseQuantity, decreaseQuantity, removeFromBag } =
    useContext(BagContext);
  const navigate = useNavigate();
  const inputId = useId();
  return (
    <div className="row mt-4 g-3">
      <div className="col-sm-2">
        <div
          className="bag-image position-relative overflow-hidden h-100"
          onClick={() => {
            navigate(`/product/${id}`);
          }}
        >
          <div className="image-backdrop position-absolute top-0 bottom-0 start-0 end-0 opacity-0"></div>
          <img
            className="object-fit-cover w-100 h-100"
            src={image}
            alt="bag item"
          />
        </div>
      </div>
      <div className="col">
        <h5 className="item-name card-heading font-color fs-5 mb-0">
          {productName}
        </h5>
        <p className="product-card-price font-color mb-0">
          KES {salePrice}.00 x {quantity}
        </p>

        <Link
          onClick={() => {
            removeFromBag(id);
          }}
          className="bag text-decoration-none text-center"
        >
          <svg
            width="26px"
            height="26px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M10 12V17"
                stroke="var(--font-color)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M14 12V17"
                stroke="var(--font-color)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M4 7H20"
                stroke="var(--font-color)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                stroke="var(--font-color)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="var(--font-color)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
            </g>
          </svg>
        </Link>
      </div>
      <div className="col-sm-3 col-md-4 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <Link
            onClick={() => {
              decreaseQuantity(id);
            }}
            className="bag text-decoration-none mx-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-minus"
            >
              <path d="M5 12h14"></path>
            </svg>
          </Link>
          <input
            className="login-input w-50 text-center font-color "
            style={{ minHeight: 2.2 + "rem", padding: 0.3 + "rem" }}
            type="number"
            name="quantity"
            id={inputId}
            value={quantity}
            min={1}
            readOnly
          />
          <Link
            onClick={() => {
              increaseQuantity(id);
            }}
            className="bag text-decoration-none mx-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Bag = () => {
  const [loading, setLoading] = useState(false);
  const { authData, setAuthData } = useContext(AuthContext);

  // check if customer is logged in
  const { isAuthenticated, login } = useContext(IsAuthenticatedContext);

  // use bag context to get all items of the bag
  const { bagItems } = useContext(BagContext);

  // creating states for order summery
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const shippingFees = 0;

  const [formData, setFormData] = useState({});

  const [street, setStreet] = useState(authData?.address?.street);
  const [country, setCountry] = useState(authData?.address?.country);
  const [pincode, setPincode] = useState(authData?.address?.pincode);
  const [city, setCity] = useState(authData?.address?.city);
  const [state, setState] = useState(authData?.address?.state);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Initialize a Paystack checkout.
   *
   * The server creates an unpaid Order + a pending Transaction and returns
   * Paystack's hosted `authorization_url`. We redirect there; Paystack handles
   * card entry (PCI scope stays with them). On return, /paystack/callback
   * verifies with the server. The webhook is the source of truth — this
   * redirect never finalizes a payment (fixes audit F-C1/F-S1).
   */
  const placeOrder = async (e) => {
    e.preventDefault();
    if (bagItems.length === 0) {
      toast.error("Your bag is empty", { className: "toastify" });
      return;
    }

    setLoading(true);

    const products = bagItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const shippingAddress = {
      state,
      street,
      country,
      pincode,
      city,
    };

    // Use the logged-in user's email if available; otherwise the guest field.
    const email = isAuthenticated ? authData?.email : formData.email;

    const payload = {
      products,
      shippingAddress,
      email,
      fullName: formData.fullName,
      phone: formData.phone,
      // Guest can optionally create an account at checkout:
      password: formData.password || undefined,
      confirmPassword: formData.confirmPassword || undefined,
      subTotal,
      shippingFees,
      total,
      currency: "KES",
      callback_url: `${window.location.origin}/paystack/callback`,
    };

    try {
      const response = await api.post("/api/payments/initialize", payload);
      const data = unwrap(response);

      // If the server created a customer (guest checkout), log them in locally.
      if (data.customer && !isAuthenticated) {
        login({ _id: data.customer._id, role: data.customer.role });
        setAuthData(data.customer);
      }

      // Redirect to Paystack's hosted checkout.
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error("No payment URL returned. Please try again.", {
          className: "toastify",
        });
        setLoading(false);
      }
    } catch (error) {
      const msg =
        error?.payload?.message ||
        error?.message ||
        "Couldn't start checkout due to an error";
      toast.error(msg, { className: "toastify" });
      setLoading(false);
    }
  };

  // when bagItems changes, compute subtotal
  useEffect(() => {
    setSubTotal(
      bagItems.length > 0
        ? bagItems
            .map((item) => item.salePrice * item.quantity)
            .reduce((a, b) => a + b)
        : 0,
    );
  }, [bagItems]);

  // when subtotal changes we update total
  useEffect(() => {
    setTotal(subTotal + shippingFees);
  }, [subTotal]);

  return (
    <>
      <Header />
      <form className=" py-3" onSubmit={placeOrder}>
        {/* <!-- Title  --> */}
        <h1 className="title text-uppercase text-center mt-5">Your Bag</h1>
        <h5 className="text-uppercase text-center mb-5">{/* Checkout */}</h5>
        <div className="row g-3">
          <div className="col-sm-7">
            {/* <!-- Bag Items section  --> */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color">
                      Items in Bag
                    </h2>
                    {/* <!-- Products  --> */}
                    {bagItems.length > 0 ? (
                      bagItems.map((item) => (
                        <BagItem key={item.id} {...item} />
                      ))
                    ) : (
                      <div className="font-color">...No Items in bag</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info for sign up (guests only) */}
            <div
              className={`card container-fluid p-3 mb-1 ${isAuthenticated ? "d-none" : ""}`}
            >
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">
                      Customer Info
                    </h2>

                    <label
                      htmlFor="fullName"
                      className="font-color product-card-price mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="login-input font-color d-block w-100 mb-2"
                      id="fullName"
                      name="fullName"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder=""
                      required={!isAuthenticated}
                    />

                    <div className="row gap-3 px-2">
                      <div className="col-md p-0">
                        <label
                          htmlFor="email"
                          className="font-color product-card-price mb-1"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          className="login-input font-color d-block w-100 mb-2"
                          id="email"
                          name="email"
                          onChange={(e) => onChangeHandler(e)}
                          placeholder=""
                          required={!isAuthenticated}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label
                          htmlFor="phone"
                          className="font-color product-card-price mb-1"
                        >
                          Phone *
                        </label>
                        <input
                          type="tel"
                          className="login-input font-color d-block w-100 mb-2"
                          id="phone"
                          name="phone"
                          onChange={(e) => onChangeHandler(e)}
                          placeholder=""
                          required={!isAuthenticated}
                        />
                      </div>
                    </div>

                    <p className="product-card-price font-color mt-3 mb-1">
                      Optional: create an account to track your order.
                    </p>
                    <div className={`row gap-3 px-2 `}>
                      <div className="col-md p-0">
                        <label
                          htmlFor="password"
                          className="font-color product-card-price mb-1"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className="login-input font-color d-block w-100"
                          id="password"
                          name="password"
                          onChange={(e) => onChangeHandler(e)}
                          placeholder=""
                          autoComplete="new-password"
                        />
                      </div>
                      <div className="col-md p-0">
                        <label
                          htmlFor="confirmPassword"
                          className="font-color product-card-price mb-1"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="login-input font-color d-block w-100"
                          id="confirmPassword"
                          name="confirmPassword"
                          onChange={(e) => onChangeHandler(e)}
                          placeholder=""
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">
                      Shipping Address
                    </h2>

                    <label
                      htmlFor="street"
                      className="font-color product-card-price mb-1"
                    >
                      Street Address *
                    </label>
                    <input
                      type="text"
                      className="login-input font-color d-block w-100 mb-2"
                      id="street"
                      name="street"
                      value={street || ""}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder=""
                      required
                    />

                    <div className="row gap-3 px-2">
                      <div className="col-md p-0">
                        <label
                          htmlFor="city"
                          className="font-color product-card-price mb-1"
                        >
                          City *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100"
                          id="city"
                          name="city"
                          onChange={(e) => setCity(e.target.value)}
                          placeholder=""
                          required
                          value={city || ""}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label
                          htmlFor="state"
                          className="font-color product-card-price mb-1"
                        >
                          State *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100"
                          id="state"
                          name="state"
                          onChange={(e) => setState(e.target.value)}
                          placeholder=""
                          required
                          value={state || ""}
                        />
                      </div>
                    </div>
                    <div className="row gap-3 px-2">
                      <div className="col-md p-0">
                        <label
                          htmlFor="pincode"
                          className="font-color product-card-price mb-1"
                        >
                          Pincode *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100"
                          id="pincode"
                          name="pincode"
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder=""
                          required
                          value={pincode || ""}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label
                          htmlFor="country"
                          className="font-color product-card-price mb-1"
                        >
                          Country *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100"
                          id="country"
                          name="country"
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder=""
                          required
                          value={country || ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment — Paystack hosted checkout. No card data is collected here. */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-3">
                      Payment
                    </h2>
                    <p className="product-card-price font-color mb-2">
                      You&apos;ll be redirected to Paystack&apos;s secure
                      checkout to complete your payment. We never see or store
                      your card details.
                    </p>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        Card
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        M-Pesa
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        Bank
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        USSD
                      </span>
                    </div>
                    {!VITE_PAYSTACK_PUBLIC_KEY && (
                      <p
                        className="product-card-price font-color mt-2"
                        style={{ color: "#b00" }}
                      >
                        Paystack is not configured on this environment. Set
                        VITE_PAYSTACK_PUBLIC_KEY to enable checkout.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Order Summery Section  --> */}

          <div className="col-sm-5">
            <div className="card container-fluid p-3 position-sticky top-0">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col contact-form">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">
                      Order Summary
                    </h2>
                    <div className="d-flex justify-content-between">
                      <span className="product-card-price font-color mb-0">
                        Subtotal:
                      </span>
                      <span className="product-card-price font-color mb-0">
                        KES {subTotal}.00{" "}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="product-card-price font-color mb-0">
                        Shipping fee:
                      </span>
                      <span className="product-card-price font-color mb-0">
                        KES {shippingFees}.00{" "}
                      </span>
                    </div>
                    <hr className="font-color" />
                    <div className="d-flex justify-content-between">
                      <span className="product-card-price font-color mb-0">
                        Total:
                      </span>
                      <span className="product-card-price font-color mb-0">
                        KES {total}.00{" "}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="btn text-uppercase d-block my-2 py-3 w-100 fw-bold"
                      style={{ fontSize: 0.88 + "rem" }}
                      disabled={loading || bagItems.length === 0}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-grow spinner-grow-sm text-dark me-2"
                            aria-hidden="true"
                          ></span>
                          <span role="status">Redirecting to Paystack…</span>
                        </>
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                    <p
                      className="product-card-price font-color mt-2"
                      style={{ fontSize: "0.75rem" }}
                    >
                      By placing your order you agree to our terms. Payment is
                      handled securely by Paystack.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Bag;
export { BagItem };
