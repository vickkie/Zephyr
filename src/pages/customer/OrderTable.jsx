/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const OrdersTable = ({ orders, action, deleteHandler }) => {
  // console.log(orders.length);
  // console.log(orders[0]);
  return (
    <div className="card container-fluid bg-colo h-100">
      <div className="card-body p-4">
        <div className="row h-100 ">
          <h3 className="card-heading font-color fs-4 text-uppercase">Orders</h3>
          <p className="card-text font-color fs-6">Find all your oders and their status below.</p>
          <div className="table-responsive">
            <table className="order-table w-100">
              <thead className="card-heading text-uppercase font-color fs-6 bag">
                <tr className="border-bottom border-warning border-opacity-10">
                  <th className="p-1">#Order</th>
                  <th>Fulfilment</th>
                  <th>Payment</th>
                  <th>Total</th>
                  {action ? <th>Action</th> : null}
                </tr>
              </thead>
              <tbody className="font-color fs-6">
                {
                  // check if there are orders present or not
                  orders?.length > 0 ? (
                    orders.map((order) => (
                      <tr
                        key={order?.orderId}
                        className="border-bottom border-warning border-opacity-10
                     
                      "
                      >
                        <td className="p-4">{order?.orderId}</td>
                        <td className="p-4">{order?.orderStatus}</td>
                        <td className="p-4">{order?.paymentStatus}</td>
                        <td className="p-4">${order?.total}.00</td>
                        {action ? (
                          <td className="p-4">
                            <Link to={`${order?._id}`} className="text-decoration-none me-3">
                              <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  opacity="0.5"
                                  d="M10 22C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 18.7712 2 15"
                                  stroke="var(--font-color)"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  opacity="0.5"
                                  d="M22 15C22 18.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22"
                                  stroke="var(--font-color)"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  opacity="0.5"
                                  d="M14 2C17.7712 2 19.6569 2 20.8284 3.17157C22 4.34315 22 5.22876 22 9"
                                  stroke="var(--font-color)"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  opacity="0.5"
                                  d="M10 2C6.22876 2 4.34315 2 3.17157 3.17157C2 4.34315 2 5.22876 2 9"
                                  stroke="var(--font-color)"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M5.89243 14.0598C5.29748 13.3697 5 13.0246 5 12C5 10.9754 5.29747 10.6303 5.89242 9.94021C7.08037 8.56222 9.07268 7 12 7C14.9273 7 16.9196 8.56222 18.1076 9.94021C18.7025 10.6303 19 10.9754 19 12C19 13.0246 18.7025 13.3697 18.1076 14.0598C16.9196 15.4378 14.9273 17 12 17C9.07268 17 7.08038 15.4378 5.89243 14.0598Z"
                                  stroke="var(--font-color)"
                                  strokeWidth="1.5"
                                />
                                <circle cx="12" cy="12" r="2" stroke="var(--font-color)" strokeWidth="1.5" />
                              </svg>
                            </Link>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-2">No</td>
                      <td>Orders</td>
                      <td>Found</td>
                      <td></td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
