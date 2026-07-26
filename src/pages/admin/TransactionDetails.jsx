import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { api, unwrap } from "../../utils/api";

const statusBadgeClass = (status) => {
  switch (status) {
    case "success":
      return "bg-success";
    case "failed":
      return "bg-danger";
    case "abandoned":
      return "bg-secondary";
    default:
      return "bg-warning text-dark";
  }
};

const TransactionDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [record, setRecord] = useState(null);

  const fetchOne = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/admin/transactions/${id}`);
      const data = unwrap(res);
      setRecord(data.transaction);
    } catch (err) {
      const msg = err?.payload?.message || err?.message || "Failed to load transaction";
      setError(msg);
      toast.error(msg, { className: "toastify" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (newStatus) => {
    const result = await Swal.fire({
      title: "Update status?",
      text: `Set this transaction to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await api.patch(`/api/admin/transactions/${id}/status`, { status: newStatus });
      const data = unwrap(res);
      setRecord((prev) => ({ ...prev, ...data.transaction }));
      toast.success("Status updated", { className: "toastify" });
    } catch (err) {
      toast.error(err?.payload?.message || "Update failed", { className: "toastify" });
    }
  };

  if (loading) {
    return (
      <main className="container-fluid mt-3">
        <div className="d-flex justify-content-center align-items-center py-5">
          <span className="spinner-grow spinner-grow bag" aria-hidden="true"></span>
        </div>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="container-fluid mt-3">
        <div className="card container-fluid p-3">
          <div className="card-body p-4 text-center">
            <p className="font-color product-card-price">{error || "Transaction not found."}</p>
            <Link to="/admin/transactions" className="btn btn-sm">
              Back to transactions
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tx = record;
  const order = tx.order;
  const customer = tx.user;

  return (
    <main className="container-fluid mt-3">
      <div className="card container-fluid p-3">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-heading text-uppercase fs-5 font-color mb-0">Transaction Details</h2>
            <Link to="/admin/transactions" className="btn btn-sm">
              Back
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <h3 className="card-heading font-color fs-6 text-uppercase mb-3">Payment</h3>
              <ul className="list-unstyled product-card-price font-color">
                <li className="mb-2">
                  <strong>Reference:</strong> {tx.reference}
                </li>
                <li className="mb-2">
                  <strong>Gateway Ref:</strong> {tx.gatewayReference || "—"}
                </li>
                <li className="mb-2">
                  <strong>Amount:</strong> {tx.currency} {(tx.amount / 100).toFixed(2)}
                </li>
                <li className="mb-2">
                  <strong>Method:</strong> <span className="text-capitalize">{tx.method || "—"}</span>
                </li>
                <li className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${statusBadgeClass(tx.status)} text-capitalize`}>{tx.status}</span>
                </li>
                <li className="mb-2">
                  <strong>Gateway Response:</strong> {tx.gatewayResponse || "—"}
                </li>
                <li className="mb-2">
                  <strong>Paid At:</strong>{" "}
                  {tx.paidAt ? new Date(tx.paidAt).toLocaleString() : "—"}
                </li>
                <li className="mb-2">
                  <strong>Created:</strong> {new Date(tx.createdAt).toLocaleString()}
                </li>
              </ul>
            </div>

            <div className="col-md-6">
              <h3 className="card-heading font-color fs-6 text-uppercase mb-3">Customer & Order</h3>
              <ul className="list-unstyled product-card-price font-color">
                <li className="mb-2">
                  <strong>Customer:</strong>{" "}
                  {customer ? (
                    <Link to={`/admin/customers/${customer._id}`}>{customer.email}</Link>
                  ) : (
                    tx.metadata?.email || "Guest"
                  )}
                </li>
                <li className="mb-2">
                  <strong>Order:</strong>{" "}
                  {order ? (
                    <Link to={`/admin/orders/${order._id}`}>#{order.orderId || order._id}</Link>
                  ) : (
                    "—"
                  )}
                </li>
                {order && (
                  <li className="mb-2">
                    <strong>Order Payment:</strong> {order.paymentStatus}
                  </li>
                )}
                {order && (
                  <li className="mb-2">
                    <strong>Order Total:</strong> KES {order.total?.toFixed(2)}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <hr className="font-color my-4" />

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="product-card-price font-color me-2">Admin actions:</span>
            <button className="btn btn-sm btn-success" onClick={() => updateStatus("success")}>
              Mark Success
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => updateStatus("failed")}>
              Mark Failed
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => updateStatus("abandoned")}>
              Mark Abandoned
            </button>
            <span className="product-card-price font-color ms-2" style={{ fontSize: "0.75rem" }}>
              Refund support is a future extension.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionDetails;
