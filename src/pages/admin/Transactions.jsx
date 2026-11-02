import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api, unwrap, fromSmallestUnit } from "../../utils/api";

const STATUSES = ["pending", "success", "failed", "abandoned"];

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

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // filters
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [limit] = useState(20);

  const fetchTransactions = async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = { page: p, limit, sort, order };
      if (status) params.status = status;
      if (search) params.search = search;
      if (method) params.method = method;
      const res = await api.get("/api/admin/transactions", { params });
      const data = unwrap(res);
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      const msg = err?.payload?.message || err?.message || "Failed to load transactions";
      setError(msg);
      toast.error(msg, { className: "toastify" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, method, sort, order]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions(1);
  };

  const goto = (p) => {
    if (p < 1 || p > pages) return;
    fetchTransactions(p);
  };

  return (
    <main className="admin-page admin-transactions-page">
      <div className="row gap-3 admin-transactions-layout">
        {/* Filters sidebar */}
        <div className="col-md-3 p-0 admin-transactions-filters">
          <div className="card container-fluid position-sticky top-0 admin-filter-card">
            <div className="card-body p-4">
              <div className="row h-100">
                <h3 className="card-heading font-color fs-6 text-uppercase">
                  Filters
                </h3>

                <form onSubmit={onSearchSubmit} className="my-3">
                  <input
                    aria-label="Search transactions by reference or email"
                    type="text"
                    className="login-input font-color d-block w-100 mb-2"
                    id="transaction-search"
                    placeholder="Reference or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-sm w-100 admin-filter-submit"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Search
                  </button>
                </form>

                <div className="d-flex flex-column gap-3 my-2">
                  <span
                    className="product-card-price font-color"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Status
                  </span>
                  <input
                    type="radio"
                    className="btn-check"
                    name="txstatus"
                    value=""
                    id="tx-all"
                    checked={status === ""}
                    onChange={(e) => setStatus(e.target.value)}
                    autoComplete="off"
                  />
                  <label
                    className="filter-btn btn btn-sm border bag mx-lg-4"
                    htmlFor="tx-all"
                  >
                    All
                  </label>
                  {STATUSES.map((s) => (
                    <div key={s}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="txstatus"
                        value={s}
                        id={`tx-${s}`}
                        checked={status === s}
                        onChange={(e) => setStatus(e.target.value)}
                        autoComplete="off"
                      />
                      <label
                        className="filter-btn btn btn-sm border bag mx-lg-4 text-capitalize"
                        htmlFor={`tx-${s}`}
                      >
                        {s}
                      </label>
                    </div>
                  ))}

                  <label
                    className="product-card-price font-color mt-3"
                    style={{ fontSize: "0.8rem" }}
                    htmlFor="transaction-method"
                  >
                    Method
                  </label>
                  <input
                    type="text"
                    className="login-input font-color d-block w-100"
                    id="transaction-method"
                    placeholder="card, mpesa, bank…"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  />

                  <label
                    className="product-card-price font-color mt-3"
                    style={{ fontSize: "0.8rem" }}
                    htmlFor="transaction-sort-field"
                  >
                    Sort
                  </label>
                  <select
                    className="login-input font-color d-block w-100"
                    id="transaction-sort-field"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="createdAt">Date</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                  </select>
                  <select
                    aria-label="Sort order"
                    className="login-input font-color d-block w-100"
                    id="transaction-sort-order"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col p-0 admin-transactions-table-column">
          <div className="card container-fluid p-3 admin-transactions-card">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-heading text-uppercase fs-5 font-color mb-0">
                  Transactions
                </h2>
                <span
                  className="product-card-price font-color admin-transaction-total"
                  style={{ fontSize: "0.8rem" }}
                >
                  {total} total
                </span>
              </div>

              {loading ? (
                <div className="d-flex h-100 justify-content-center align-items-center py-5">
                  <span
                    className="spinner-grow spinner-grow bag"
                    aria-hidden="true"
                  ></span>
                </div>
              ) : error ? (
                <div className="text-center py-5">
                  <p className="font-color product-card-price">{error}</p>
                  <button
                    className="btn btn-sm"
                    onClick={() => fetchTransactions(page)}
                  >
                    Retry
                  </button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-5">
                  <p className="font-color product-card-price">
                    No transactions found.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle admin-transactions-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx._id}>
                          <td style={{ fontSize: "0.8rem" }}>{tx.reference}</td>
                          <td style={{ fontSize: "0.85rem" }}>
                            {tx.user?.email || tx.metadata?.email || "—"}
                          </td>
                          <td>
                            {tx.currency}{" "}
                            {fromSmallestUnit(tx.amount, tx.currency)}
                          </td>
                          <td className="text-capitalize">
                            {tx.method || "—"}
                          </td>
                          <td>
                            <span
                              className={`badge ${statusBadgeClass(tx.status)} text-capitalize`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.8rem" }}>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <Link
                              to={`/admin/transactions/${tx._id}`}
                              className="btn btn-sm admin-transaction-view"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {pages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3 admin-pagination">
                      <button
                        className="btn btn-sm"
                        disabled={page <= 1}
                        onClick={() => goto(page - 1)}
                      >
                        Prev
                      </button>
                      <span
                        className="product-card-price font-color"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Page {page} of {pages}
                      </span>
                      <button
                        className="btn btn-sm"
                        disabled={page >= pages}
                        onClick={() => goto(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Transactions;
