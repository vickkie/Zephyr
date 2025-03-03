import axios from "axios";
import { Footer, Header, PageTitle } from "../components";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const { VITE_SERVER } = import.meta.env;

const Profile = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({});
  const [myOrders, setMyOrders] = useState([]);

  const { user, isAuthenticated } = useContext(IsAuthenticatedContext);

  const { authData } = useContext(AuthContext);
  // console.log(authData);

  /**
   * The function `fetchCustomer` asynchronously fetches customer data from a server using axios,
   * handles errors, and updates the customer state or navigates to a 404 page based on the response.
   */
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/customer/${user._id}`, {
        withCredentials: true,
      });
      // console.log("customer", response);
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
   * The function fetches the orders for a specific user from a server and handles any errors that may
   * occur during the process.
   */
  const fetchMyOrders = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/orders/${user._id}`, {
        withCredentials: true,
      });
      // console.log("myOders", response);
      response ? setMyOrders(response.data.orders) : navigate("/404");
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
      if (error.response.status === 500) {
        navigate("/404");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // console.log(user._id);
      fetchCustomer();
      fetchMyOrders();
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <>
      <Header />
      <PageTitle title={"Profile"} />
      <section className="container-fluid mt-3 p-0">
        <div className="row justify-content-start gap-3">
          <div className="col-span-4 sm:col-span-12">
            <button
              onClick={() => navigate("/logout")}
              className="d-none d-sm-block btn btn-sm filter-btn border bag w-100 py-2 overflow-hidden"
            >
              Log Out
            </button>
            <button
              onClick={() => navigate("/logout")}
              className="d-sm-none btn btn-sm filter-btn border bag w-100 overflow-hidden"
            >
              <span className="p-4">LOGOUT</span>
            </button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 my-3">
          <div className="card w-100 ">
            <div className="card-body p-4">
              <div className="row h-100  overflow-hidden justify-content-center">
                <label htmlFor="dp" className="justify-content-center d-flex">
                  <div
                    style={{
                      backgroundImage: `url(${
                        customer?.profilePicture ? customer?.profilePicture : "/images/userDefault.png"
                      }
                      )`,
                      backgroundSize: "cover",
                      height: "calc(var(--zy-xxxl)* 3)",
                      width: "calc(var(--zy-xxxl)* 3)",
                    }}
                    className="profile-picture rounded-circle object-fit-cover"
                    alt="Profile Picture"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="card flex-grow-1">
            <div className="p-5">
              <div className="mx-auto">
                <h3 className="card-headin font-color fs-1">
                  {/* Frederick C. Frazier */}
                  {customer.fullName}
                </h3>
                <p className="card-text bag fs-6">
                  <span className="bag">Email: </span> {customer.email} <br />
                  <span className="bag">Phone: </span> {customer.phone} <br />
                  <span className="bag">Address: </span> {customer.address?.street} {customer.address?.city}{" "}
                  {customer.address?.state} {customer.address?.pincode} {customer.address?.country}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-sm-12 col-md-6 ">
            <div className="card p-4">
              <div>
                <button className="myButton" onClick={() => navigate("/orders")}>
                  View all orders
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 ">
            <div className="card p-4">
              <div>
                <button
                  className="myButton"
                  onClick={() => {
                    // console.log(customer),
                    navigate(`/profile/settings`, {
                      state: {
                        user: authData,
                        id: user?._id,
                      },
                    });
                  }}
                >
                  Profile settings
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-sm-12"></div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Profile;
