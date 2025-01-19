import axios from "axios";
import { useContext, useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BagContext from "../contexts/BagContext";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { toast } from "react-toastify";
import { Header } from "../components";
import { AuthContext } from "../contexts/AuthContext";
const { VITE_SERVER } = import.meta.env;

// eslint-disable-next-line react/prop-types
const BagItem = ({ id, image, productName, quantity, salePrice }) => {
  const { increaseQuantity, decreaseQuantity, removeFromBag } = useContext(BagContext);
  const navigate = useNavigate();
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
          <img className="object-fit-cover w-100 h-100" src={image} alt="bag item" />
        </div>
      </div>
      <div className="col">
        <h5 className="item-name card-heading font-color fs-5 mb-0">{productName}</h5>
        <p className="product-card-price font-color mb-0">
          KES {salePrice}.00 x {quantity}
        </p>

        <Link
          onClick={() => {
            removeFromBag(id);
          }}
          className="bag text-decoration-none text-center"
        >
          <svg width="26px" height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

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
            <svg width={26} height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M15 12H9" stroke="var(--font-color)" strokeWidth="1.5" strokeLinecap="round" />{" "}
                <path
                  d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                  stroke="var(--font-color)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />{" "}
              </g>
            </svg>
          </Link>
          <input
            className="login-input w-50 text-center font-color "
            style={{ minHeight: 2.2 + "rem", padding: 0.3 + "rem" }}
            type="number"
            name="quantity"
            id={useId()}
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
            <svg width={26} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                  stroke="var(--font-color)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />{" "}
                <path
                  d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                  stroke="var(--font-color)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />{" "}
              </g>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Bag = () => {
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(AuthContext);

  // check if customer is logged in
  const { isAuthenticated, user, login } = useContext(IsAuthenticatedContext);
  // console.log(user.id);

  // use bag context to get all items of the bag
  const { bagItems, removeFromBag, emptyBag } = useContext(BagContext);

  // creating states for order summery
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [autofill, setAutofill] = useState(false);

  const shippingFees = 0;

  const [formData, setFormData] = useState({});

  const [street, setStreet] = useState(authData?.address?.street);
  const [country, setCountry] = useState(authData?.address?.country);
  const [pincode, setPincode] = useState(authData?.address?.pincode);
  const [city, setCity] = useState(authData?.address?.city);
  const [state, setState] = useState(authData?.address?.state);

  //payment details

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    securityCode: "",
  });
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("");

  const paymentData = {
    paymentMethod,
    amount: total,
  };

  if (paymentMethod === "Card") {
    paymentData.cardDetails = cardDetails;
  } else if (paymentMethod === "Mpesa") {
    paymentData.mpesaPhoneNumber = mpesaPhoneNumber;
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleMpesaPhoneNumberChange = (e) => {
    setMpesaPhoneNumber(e.target.value);
  };

  /**
   * The onChangeHandler function updates the formData state with the new value based on the input
   * field name.
   */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * The `placeOrder` function is an asynchronous function that handles placing an order by sending a
   * POST request with order details to a server, handling success and error responses accordingly.
   */
  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const products = bagItems.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
      };
    });

    const addresses = {
      state: state,
      street: street,
      country: country,
      pincode: pincode,
      city: city,
    };

    const payload = {
      products,
      ...formData,
      ...addresses,
      paymentData,
      shippingFees,
      subTotal,
      total,
      orderBy: user?._id,
    };

    console.log(payload);
    // return;

    try {
      const response = await axios.post(VITE_SERVER + "/api/place-order", payload, {
        withCredentials: true,
        headers: {},
      });

      if (response.data.createdOrder) {
        console.log(response.data);
        toast.success("Order Placed Successfully!", { className: "toastify", autoClose: 6000 });

        // empty bag
        emptyBag();

        // login user if registered
        if (response.data.createdCustomer) {
          login({
            _id: response.data.createdCustomer._id,
            role: response.data.createdCustomer.role,
          });
          toast.success("logged in successfully!", { className: "toastify" });
        }
        if (response.data.updatedCustomer) {
          console.log(response.data.updatedCustomer);
          setAuthData(response.data.updatedCustomer);
        }

        navigate("/profile");
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      error.response.status === 400
        ? toast.error(error.response.data.message, { className: "toastify" })
        : toast.error("Couldn't place order due to an Error", { className: "toastify" });
    } finally {
      setLoading(false);
      // navigate("/profile");
    }
  };

  // when bagItems changes, it multiply price of each item with it's quantity using map method and then adds up all using reduce method, and set the value of subtotal
  useEffect(() => {
    setSubTotal(
      bagItems.length > 0 ? bagItems.map((item) => item.salePrice * item.quantity).reduce((a, b) => a + b) : 0
    );
  }, [bagItems]);

  // when subtotal changes we update the value of total by adding shipping fees to the latest subtotal amount
  useEffect(() => {
    setTotal(subTotal + shippingFees);
  }, [subTotal]);

  useEffect(() => {
    authData?.address ? setAutofill(true) : null;
  }, [authData]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16); // Limit to 16 digits
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  return (
    <>
      <Header />
      <form className="container py-3" onSubmit={placeOrder}>
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
                    <h2 className="card-heading text-uppercase fs-4 font-color">Items in Bag</h2>
                    {/* <!-- Products  --> */}
                    {bagItems.length > 0 ? (
                      bagItems.map((item) => <BagItem key={item.id} {...item} />)
                    ) : (
                      <div className="font-color">...No Items in bag</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info for sign up */}
            <div className={`card container-fluid p-3 mb-1 ${isAuthenticated ? "d-none" : ""}`}>
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Customer Info</h2>

                    <label htmlFor="fullName" className="font-color product-card-price mb-1">
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
                        <label htmlFor="email" className="font-color product-card-price mb-1">
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
                        <label htmlFor="phone" className="font-color product-card-price mb-1">
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

                    <div className={`row gap-3 px-2 `}>
                      <div className="col-md p-0">
                        <label htmlFor="password" className="font-color product-card-price mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          className="login-input font-color d-block w-100"
                          id="password"
                          name="password"
                          onChange={(e) => onChangeHandler(e)}
                          placeholder=""
                          required={!isAuthenticated}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label htmlFor="confirmPassword" className="font-color product-card-price mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          className="login-input font-color d-block w-100"
                          id="confirmPassword"
                          name="confirmPassword"
                          onChange={(e) => onChangeHandler(e)}
                          placeholder=""
                          required={!isAuthenticated}
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
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Shipping Address</h2>

                    <label htmlFor="street" className="font-color product-card-price mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      className="login-input font-color d-block w-100 mb-2"
                      id="street"
                      name="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder=""
                      required
                    />

                    <div className="row gap-3 px-2">
                      <div className="col-md p-0">
                        <label htmlFor="city" className="font-color product-card-price mb-1">
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
                          value={city}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label htmlFor="state" className="font-color product-card-price mb-1">
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
                          value={state}
                        />
                      </div>
                    </div>
                    <div className="row gap-3 px-2">
                      <div className="col-md p-0">
                        <label htmlFor="pincode" className="font-color product-card-price mb-1">
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
                          value={pincode}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label htmlFor="country" className="font-color product-card-price mb-1">
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
                          value={country}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Payment Info</h2>

                    {/* Payment Method Selection */}
                    <div className="mb-3">
                      <label className="font-color product-card-price mb-1">Payment Method *</label>
                      <select
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                        className="login-input font-color d-block w-100 mb-2"
                      >
                        <option
                          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                          className=""
                          value="Card"
                        >
                          Card
                        </option>
                        <option style={{ backgroundColor: "var(--primary-color)", color: "white" }} value="Mpesa">
                          Mpesa
                        </option>
                      </select>
                    </div>

                    {/* Conditional Input Fields for Card */}
                    {paymentMethod === "Card" && (
                      <div>
                        <label htmlFor="cardNumber" className="font-color product-card-price mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100 mb-2"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="Enter card number"
                          value={formatCardNumber(cardDetails.cardNumber)}
                          onChange={handleCardDetailChange}
                          required
                        />

                        <label htmlFor="cardHolderName" className="font-color product-card-price mb-1">
                          Card Holder Name *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100 mb-2"
                          id="cardHolderName"
                          name="cardHolderName"
                          placeholder="Enter card holder name"
                          value={cardDetails.cardHolderName}
                          onChange={handleCardDetailChange}
                          required
                        />

                        <div className="row gap-3 px-2">
                          <div className="col-md p-0">
                            <label htmlFor="expiryDate" className="font-color product-card-price mb-1">
                              Expiry Date *
                            </label>
                            <input
                              type="date"
                              className="login-input font-color d-block w-100"
                              id="expiryDate"
                              name="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={handleCardDetailChange}
                              required
                            />
                          </div>
                          <div className="col-md p-0">
                            <label htmlFor="securityCode" className="font-color product-card-price mb-1">
                              Security Code *
                            </label>
                            <input
                              type="number"
                              className="login-input font-color d-block w-100"
                              id="securityCode"
                              name="securityCode"
                              placeholder="Enter security code"
                              value={cardDetails.securityCode}
                              onChange={handleCardDetailChange}
                              required
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conditional Input Fields for Mpesa */}
                    {paymentMethod === "Mpesa" && (
                      <div>
                        <label htmlFor="mpesaPhoneNumber" className="font-color product-card-price mb-1">
                          Mpesa Phone Number *
                        </label>
                        <input
                          type="text"
                          className="login-input font-color d-block w-100 mb-2"
                          id="mpesaPhoneNumber"
                          name="mpesaPhoneNumber"
                          placeholder="Enter Mpesa phone number"
                          value={mpesaPhoneNumber}
                          onChange={handleMpesaPhoneNumberChange}
                          required
                        />
                      </div>
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
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Order Summary</h2>
                    <div className="d-flex justify-content-between">
                      <span className="product-card-price font-color mb-0">Subtotal:</span>
                      <span className="product-card-price font-color mb-0">KES {subTotal}.00 </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="product-card-price font-color mb-0">Shipping fee:</span>
                      <span className="product-card-price font-color mb-0">KES {shippingFees}.00 </span>
                    </div>
                    <hr className="font-color" />
                    <div className="d-flex justify-content-between">
                      <span className="product-card-price font-color mb-0">Total:</span>
                      <span className="product-card-price font-color mb-0">KES {total}.00 </span>
                    </div>
                    <button
                      type="submit"
                      className="btn text-uppercase d-block my-2 py-3 w-100 fw-bold"
                      style={{ fontSize: 0.88 + "rem" }}
                      disabled={loading || bagItems.length == 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm text-dark me-2" aria-hidden="true"></span>
                          <span role="status">Placing...</span>
                        </>
                      ) : (
                        "Place Oder"
                      )}
                    </button>
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
