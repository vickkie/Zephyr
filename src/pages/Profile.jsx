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
  console.log(authData);

  /**
   * The function `fetchCustomer` asynchronously fetches customer data from a server using axios,
   * handles errors, and updates the customer state or navigates to a 404 page based on the response.
   */
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/customer/${user._id}`, {
        withCredentials: true,
      });
      console.log("customer", response);
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
      console.log("myOders", response);
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
      console.log(user._id);
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
          <div className="col-4">
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
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--font-color)"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill="var(--font-color)"
                    d="M10.2392344,0 C13.3845587,0 16.2966635,1.39466883 18.2279685,3.74426305 C18.4595621,4.02601608 18.4134356,4.43777922 18.124942,4.66396176 C17.8364485,4.89014431 17.4148346,4.84509553 17.183241,4.5633425 C15.5035716,2.51988396 12.9739849,1.30841121 10.2392344,1.30841121 C5.32416443,1.30841121 1.33971292,5.19976806 1.33971292,10 C1.33971292,14.8002319 5.32416443,18.6915888 10.2392344,18.6915888 C13.0144533,18.6915888 15.5774656,17.443711 17.2546848,15.3485857 C17.4825482,15.0639465 17.9035339,15.0136047 18.1949827,15.2361442 C18.4864315,15.4586837 18.5379776,15.8698333 18.3101142,16.1544725 C16.3816305,18.5634688 13.4311435,20 10.2392344,20 C4.58426141,20 8.8817842e-14,15.5228475 8.8817842e-14,10 C8.8817842e-14,4.4771525 4.58426141,0 10.2392344,0 Z M17.0978642,7.15999289 L19.804493,9.86662172 C20.0660882,10.1282169 20.071043,10.5473918 19.8155599,10.802875 L17.17217,13.4462648 C16.9166868,13.701748 16.497512,13.6967932 16.2359168,13.435198 C15.9743215,13.1736028 15.9693667,12.7544279 16.2248499,12.4989447 L17.7715361,10.9515085 L7.46239261,10.9518011 C7.0924411,10.9518011 6.79253615,10.6589032 6.79253615,10.2975954 C6.79253615,9.93628766 7.0924411,9.64338984 7.46239261,9.64338984 L17.7305361,9.64250854 L16.1726778,8.08517933 C15.9110825,7.82358411 15.9061278,7.40440925 16.1616109,7.14892607 C16.4170941,6.89344289 16.836269,6.89839767 17.0978642,7.15999289 Z"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 my-3">
          <div className="card">
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
                    console.log(customer),
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
