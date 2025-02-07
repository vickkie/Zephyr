import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import usePatch from "../../hooks/usePatch";

const { VITE_SERVER } = import.meta.env;

const OrderDetails = () => {
  const navigate = useNavigate();
  let { id } = useParams();

  const [loading, setLoading] = useState();
  const [order, setOrder] = useState({});

  const [selectedStatus, setSelectedStatus] = useState();

  const { responseData, isLoading, errorMessage, patchData } = usePatch(`admin/order/${order.orderId}`);
  // console.log(responseData);
  // console.log(order.orderId);

  const [isEditMode, setIsEditMode] = useState(false); // State to control edit mode
  const [formData, setFormData] = useState({
    subTotal: order?.subTotal || 0,
    shippingFees: order?.shippingFees || 0,
    additionalFees: order?.additionalFees || 0,
    paymentStatus: order?.paymentStatus || "Unpaid",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    patchData(formData);
    setIsEditMode(false); // Switch back to view mode after saving
    // console.log("Updated Order:", formData);
  };

  const handleCancel = () => {
    // Reset to original order values if cancelled
    setFormData({
      subTotal: order?.subTotal || 0,
      shippingFees: order?.shippingFees || 0,
      additionalFees: order?.additionalFees || 0,
      paymentStatus: order?.paymentStatus || "Unpaid",
    });
    setIsEditMode(false);
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${VITE_SERVER}/api/admin/order/${id}`, {
        withCredentials: true,
      });
      console.log(response.data.order);
      if (response.data.success) {
        setOrder(response.data.order);
        setFormData({
          subTotal: response.data.order?.subTotal || 0,
          shippingFees: response.data.order?.shippingFees || 0,
          additionalFees: response.data.order?.additionalFees || 0,
          paymentStatus: response.data.order?.paymentStatus || "Unpaid",
        });
        setSelectedStatus(response.data.order.orderStatus);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want delete product ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await axios.delete(`${VITE_SERVER}/api/admin/order/${id}`, {
          withCredentials: true,
        });
        // console.log("deleteHandler", response.data);

        response.data.success ? toast.success("Order has been deleted", { className: "toastify" }) : null;

        setLoading(false);

        // navigate back to order list
        navigate("/admin/orders");
      } catch (error) {
        console.error(error);
        error.message ? toast.error(error.message, { className: "toastify" }) : null;
      } finally {
        setLoading(false);
      }
    }
  };

  const updateOrder = async () => {
    // console.log(order.orderId);
    let patch = {
      status: selectedStatus,
      orderId: order.orderId,
    };
    try {
      setLoading(true);
      const response = await axios.patch(`${VITE_SERVER}/api/admin/order/${order.orderId}`, patch, {
        withCredentials: true,
      });

      // console.log(response.data);
      if (response.data.success) {
        setSelectedStatus(response.data.updatedOrder.orderStatus);
        toast.success("Order has been Updated", { className: "toastify" });
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (responseData && responseData.updatedOrder && !isLoading) {
      // console.log(responseData);
      setOrder(responseData.updatedOrder);
      toast.dismiss();
      toast.success("Order has been Updated", { className: "toastify" });
    } else if (errorMessage) {
      toast.error(errorMessage, { className: "toastify" });
    }
  }, [responseData, isLoading, errorMessage]);

  return (
    <main className="container py-3">
      {/* <!-- Title  --> */}
      <h1 className="title text-uppercase text-center mt-5">Order #{order?.orderId}</h1>
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
                  {Array.isArray(order.products) &&
                    order.products
                      .filter((item) => item.product !== null) // Remove items where product is null
                      .map((item) => <BagItem key={item?.product?._id} {...item?.product} quantity={item?.quantity} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info for sign up */}
          <div className="card container-fluid p-3 mb-3">
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
                    value={order?.orderBy?.fullName || ""}
                    readOnly
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
                        value={order?.orderBy?.email || ""}
                        readOnly
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
                        value={order?.orderBy?.phone || ""}
                        readOnly
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
                    value={order?.shippingAddress?.street || ""}
                    readOnly
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
                        value={order?.shippingAddress?.city || ""}
                        readOnly
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
                        value={order?.shippingAddress?.state || ""}
                        readOnly
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
                        value={order?.shippingAddress?.pincode || ""}
                        readOnly
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
                        value={order?.shippingAddress?.country || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Payment */}
          {order.paymentInfo && (
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Payment Info</h2>

                    {/* Payment Method Selection */}
                    <div className="mb-3">
                      <label className="font-color product-card-price mb-1">Payment Method *</label>
                      <span>
                        <span className="product-card-price font-color mb-0"> {order.paymentInfo?.paymentMethod}</span>
                      </span>
                    </div>

                    {/* Conditional Input Fields for Card */}
                    {order.paymentInfo.paymentMethod === "Card" && (
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
                          value={order.paymentInfo.cardDetails?.cardNumber}
                          readOnly
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
                          value={order.paymentInfo.cardDetails?.cardHolderName}
                          readOnly
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
                              value={order.paymentInfo.cardDetails?.expiryDate}
                              readOnly
                            />
                          </div>
                          {/* <div className="col-md p-0">
                          <label htmlFor="securityCode" className="font-color product-card-price mb-1">
                            Security Code *
                          </label>
                          <input
                            type="number"
                            className="login-input font-color d-block w-100"
                            id="securityCode"
                            name="securityCode"
                            placeholder="Enter security code"
                            value={order.paymentInfo.cardDetails.securityCode}
                          />
                        </div> */}
                        </div>
                      </div>
                    )}

                    {/* Conditional Input Fields for Mpesa */}
                    {order.paymentInfo.paymentMethod === "Mpesa" && (
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
                          value={order.paymentInfo?.mpesaPhoneNumber}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <!-- Order Summery Section  --> */}

        <div className="col-sm-5">
          <div className="card container-fluid p-3 position-sticky top-0">
            <div className="card-body p-3">
              <div className="row">
                <div className="col">
                  <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Order Summary</h2>
                  <div className="d-flex justify-content-between">
                    <span className="product-card-price font-color mb-0">Subtotal:</span>
                    {isEditMode ? (
                      <input
                        type="number"
                        name="subTotal"
                        disabled
                        value={formData.subTotal}
                        onChange={handleChange}
                        className="product-card-price login-input font-color d-block w-70 mb-2"
                      />
                    ) : (
                      <span className="product-card-price font-color mb-0">$ {formData.subTotal}.00 USD</span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="product-card-price font-color mb-0">Shipping fee:</span>
                    {isEditMode ? (
                      <input
                        type="number"
                        name="shippingFees"
                        value={formData.shippingFees}
                        onChange={handleChange}
                        className="login-input font-color d-block w-70 mb-2"
                      />
                    ) : (
                      <span className="product-card-price font-color mb-0">$ {formData.shippingFees}.00 USD</span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="product-card-price font-color mb-0">Additional fee:</span>
                    {isEditMode ? (
                      <input
                        type="number"
                        name="additionalFees"
                        value={formData.additionalFees}
                        onChange={handleChange}
                        className="login-input font-color d-block w-70 mb-2"
                      />
                    ) : (
                      <span className="product-card-price font-color mb-0">$ {formData.additionalFees}.00 USD</span>
                    )}
                  </div>

                  <hr className="font-color" />

                  <div className="d-flex justify-content-between">
                    <span className="product-card-price font-color mb-0">Total:</span>
                    <span className="product-card-price font-color mb-0">
                      $ {Number(formData.subTotal) + Number(formData.shippingFees) + Number(formData.additionalFees)}.00
                      USD
                    </span>
                  </div>

                  <hr className="font-color" />

                  <div className="d-flex justify-content-between">
                    <span className="product-card-price font-color mb-0">Payment Status:</span>

                    {isEditMode ? (
                      <select
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleChange}
                        className="login-input font-color d-block w-70 mb-2"
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                      </select>
                    ) : (
                      <span className="product-card-price font-color mb-0">{order?.paymentStatus}</span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    {isEditMode ? (
                      <>
                        <button onClick={handleSave} className="btn btn-success">
                          Save
                        </button>
                        <button onClick={handleCancel} className="btn btn-secondary">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setIsEditMode(true)} className="btn btn-primary">
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="d-flex justify-content-center w-100 gap-3">
                    <div className="d-flex flex-column flex-wrap gap-3 my-5">
                      <input
                        type="radio"
                        className="btn-check"
                        name="fulfilment"
                        id="processing"
                        value="processing"
                        checked={selectedStatus === "processing"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="processing">
                        Processing
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="fulfilment"
                        id="dispatched"
                        value="dispatched"
                        checked={selectedStatus === "dispatched"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="dispatched">
                        Dispatched
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="fulfilment"
                        id="cancelled"
                        value="cancelled"
                        checked={selectedStatus === "cancelled"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="cancelled">
                        Cancelled
                      </label>
                    </div>
                    <div className="d-flex flex-column flex-wrap gap-3 my-5">
                      <input
                        type="radio"
                        className="btn-check"
                        name="fulfilment"
                        id="onTheWay"
                        value="onTheWay"
                        checked={selectedStatus === "onTheWay"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="onTheWay">
                        Shipping
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="fulfilment"
                        id="delivered"
                        value="delivered"
                        checked={selectedStatus === "delivered"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="delivered">
                        Delivered
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="fulfilment"
                        id="returned"
                        value="returned"
                        checked={selectedStatus === "returned"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="returned">
                        Returned
                      </label>
                    </div>
                  </div>

                  <div className="contact-form">
                    <button
                      className="btn text-uppercase d-block my-2 py-3 w-100 fw-bold"
                      style={{ fontSize: 0.88 + "rem" }}
                      onClick={() => updateOrder(id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm text-dark me-2" aria-hidden="true"></span>
                          <span role="status">Updating...</span>
                        </>
                      ) : (
                        "Update Order"
                      )}
                    </button>
                  </div>
                  <button
                    className="btn text-uppercase d-block my-2 py-3 w-100 fw-bold bg-color border bag hover-text-primary"
                    style={{ fontSize: 0.88 + "rem" }}
                    onClick={() => deleteHandler(id)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm text-dark me-2" aria-hidden="true"></span>
                        <span role="status">Deleting...</span>
                      </>
                    ) : (
                      "Delete Order"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// eslint-disable-next-line react/prop-types
const BagItem = ({ images, productCode, productName, quantity, salePrice }) => {
  // const { increaseQuantity, decreaseQuantity, removeFromBag } = useContext(BagContext);
  console.log(images);

  return (
    <div className="row mt-4 g-3">
      <div className="col-sm-2">
        <div className="bag-image position-relative overflow-hidden h-100">
          <div className="image-backdrop position-absolute top-0 bottom-0 start-0 end-0 opacity-50"></div>
          <img className="object-fit-cover w-100 h-100" src={images[0]} alt="bag item" />
        </div>
      </div>
      <div className="col">
        <h5 className="item-name card-heading font-color fs-5 mb-0">{productName}</h5>
        <p className="product-card-price font-color mb-0">
          $ {salePrice}.00 USD x {quantity}
        </p>
        <p className="product-card-price font-color mb-0">ID : {productCode}</p>

        {/* <Link onClick={() => { removeFromBag(id) }} className="bag text-decoration-none text-center">
                    <i className="ai ai-trash-fill fs-5"></i>
                </Link> */}
      </div>
      {/* <div className="col-sm-3 col-md-4 d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <Link onClick={() => { decreaseQuantity(id) }} className="bag text-decoration-none mx-2">
                        <i className="ai ai-minus-fill fs-4"></i>
                    </Link>
                    <input className="login-input w-50 text-center font-color "
                        style={{ minHeight: 2.2 + 'rem', padding: 0.3 + 'rem' }}
                        type="number"
                        name="quantity"
                        id={useId()}
                        value={quantity}
                        min={1}
                        readOnly />
                    <Link onClick={() => { increaseQuantity(id) }} className="bag text-decoration-none mx-2">
                        <i className="ai ai-plus-fill fs-4"></i>
                    </Link>
                </div>
            </div> */}
    </div>
  );
};

export default OrderDetails;
