import axios from "axios";
import { OrdersTable } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const { VITE_SERVER } = import.meta.env;

const CustomerDetails = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState();
  const [loading, setLoading] = useState();
  const [orders, setOrders] = useState([]);

  const { id } = useParams();
  /**
   * The function fetches customer data from a server using an async request and handles errors
   * appropriately.
   */
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/customer/${id}`, {
        withCredentials: true,
      });
      response ? setCustomer({ ...response.data.customer }) : navigate("/404");
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
      if (error.response.status === 500) {
        navigate("/404");
      }
    }
  };

  /**
   * The function `fetchOrders` is an asynchronous function that fetches orders from a server using
   * axios, handles the response data, and navigates to a 404 page if there is an error.
   */
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/orders/${id}`, {
        withCredentials: true,
      });
      response ? setOrders(response.data.orders) : navigate("/404");
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
      if (error.response.status === 500) {
        navigate("/404");
      }
    }
  };

  /**
   * The `deleteHandler` function is an asynchronous function that sends a delete request to the server
   * to delete a customer by ID, with error handling and toast notifications.
   */
  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete customer`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    // If user confirmed, proceed with approval
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await axios.delete(`${VITE_SERVER}/api/admin/delete-customer/${id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          toast.success("Customer deleted successfully!", { className: "toastify" });
          navigate("/admin/customers");
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        error.message ? toast.error(error.message, { className: "toastify" }) : null;
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchOrders();
  }, []);

  return (
    <section className="admin-page admin-customer-details-page container-fluid mt-3 p-0">
      <div className="row justify-content-end gap-3 admin-customer-actions">
        <div className="col-2">
          <button
            aria-label="Delete account"
            disabled={loading || !customer}
            onClick={() => deleteHandler(customer?._id)}
            className="d-none d-sm-block btn btn-sm filter-btn border bag w-100 overflow-hidden"
            type="button"
          >
            Delete Account
          </button>
          <button
            aria-label="Delete account"
            className="d-sm-none btn btn-sm filter-btn border bag w-100 overflow-hidden"
            disabled={loading || !customer}
            onClick={() => deleteHandler(customer?._id)}
            type="button"
          >
            <i className="ai ai-trash-fill"></i>
          </button>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-3 my-3 admin-customer-profile-grid">
        <div className="card admin-customer-avatar-card">
          <div className="card-body p-4">
            <div className="row h-100 overflow-hidden">
              <label htmlFor="dp">
                <div
                  style={{
                    backgroundImage: `url(${
                      customer?.profilePicture ? customer?.profilePicture : "/images/userDefault.png"
                    }
                      )`,
                    backgroundSize: "cover",
                  }}
                  aria-label="Customer profile picture"
                  className="profile-picture admin-customer-avatar rounded-circle object-fit-cover"
                  role="img"
                />
              </label>
              <input type="file" className="visually-hidden" name="dp" id="dp" />
            </div>
          </div>
        </div>

        <div className="card flex-grow-1 admin-customer-info-card">
          <div className="p-5">
            <div className="mx-auto">
              <h3 className="card-headin font-color fs-1">{customer?.fullName}</h3>
              <p className="card-text bag fs-6">
                <span className="bag">Email: </span> {customer?.email} <br />
                <span className="bag">Phone: </span> {customer?.phone} <br />
                <span className="bag">Address: </span> {customer?.address?.street} {customer?.address?.city},{" "}
                {customer?.address?.state}, {customer?.address?.pincode} {customer?.address?.country}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 admin-customer-orders">
        <div className="col-sm-12">
          <OrdersTable orders={orders} />
        </div>
      </div>
    </section>
  );
};

export default CustomerDetails;
