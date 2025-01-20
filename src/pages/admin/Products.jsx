import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "../../components";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Lazyload from "../../utils/lazyload";
import Swal from "sweetalert2";
import useGet from "../../hooks/useGet";

const { VITE_SERVER } = import.meta.env;

const Products = () => {
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);

  Lazyload();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [searchVisible, setSearchVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    data: responseData,
    isLoading,
    error,
    errorMessage,
  } = useGet(
    `products/hqall?page=${currentPage}&limit=${productsPerPage}&search=${search}&filterStatus=${filterStatus}&sortField=${sortField}&sortOrder=${sortOrder}`
  );

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Accessing the products from the response

  const products = Array.isArray(responseData?.products) ? responseData.products : [];

  // Filter, search, and sort products
  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) =>
          [product.status, product.category].some((field) => field.toLowerCase().includes(search.toLowerCase()))
        )
        .filter(
          (product) =>
            (!filterCategory || product.category === filterCategory) &&
            (!filterStatus || product.status === filterStatus) &&
            (!startDate || new Date(product.createdAt) >= startDate) &&
            (!endDate || new Date(product.createdAt) <= endDate)
        )
    : [];

  const sortedProducts = filteredProducts.sort((a, b) => {
    const getValue = (item) => {
      const value = item[sortField];
      if (sortField === "amount") {
        // Ensuring the amount is a valid string or number
        const amountStr = value != null ? String(value) : "0"; // Convert to string
        return parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));
      }
      return value;
    };

    const aValue = getValue(a);
    const bValue = getValue(b);

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  const indexOfLastTransaction = currentPage * productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfLastTransaction - productsPerPage, indexOfLastTransaction);

  const pendingProductsCount = responseData?.pendingTotal;

  useEffect(() => {
    // This will refetch the data when currentPage or other dependencies change

    // console.log(products);
    setAllProducts(products);
    setLoading(false);
  }, [currentPage, productsPerPage, search, filterStatus, sortField, sortOrder, products]);

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= responseData?.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
    setIsMobile((prev) => !prev);
  };
  const toggleCalendar = () => {
    setCalendarVisible((prev) => !prev);
    setIsMobile((prev) => !prev);
  };

  // const fetchAllProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${VITE_SERVER}/api/all-products`, {
  //       withCredentials: true,
  //     });
  //     // console.log("all-products", response.data);
  //     setAllProducts(response.data.products);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     error.message ? toast.error(error.message, { className: "toastify" }) : null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * The `deleteHandler` function is an asynchronous function that sends a delete request to a server
   * to delete a product by its ID, and handles success and error responses accordingly.
   */
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
        const response = await axios.delete(`${VITE_SERVER}/api/admin/delete-product/${id}`, {
          withCredentials: true,
        });
        console.log("deleteHandler", response.data);

        response.data.success ? toast.success("Product deleted successfully!", { className: "toastify" }) : null;

        setLoading(false);

        // remove product from table
        setAllProducts((prev) => prev.filter((item) => item._id != id));
      } catch (error) {
        console.error(error);
        error.message ? toast.error(error.message, { className: "toastify" }) : null;
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // fetchAllProducts();
  }, []);

  return (
    <>
      {/* <PageTitle title={"Products"} /> */}
      <section className="container-fluid mt-3">
        <div className="row gap-3">
          <div className="col p-0">
            <div className="card container-fluid bg-colo h-100">
              <div className="card-body p-4">
                <div className="row h-100 ">
                  <h3 className="card-heading font-color fs-4 text-uppercase">All Products</h3>
                  <p className="card-text font-color fs-6">Find all your products and their details below.</p>
                  <div className="table-responsive">
                    <table className="order-table w-100">
                      <thead className="card-heading text-uppercase font-color fs-6 bag">
                        <tr className="border-bottom border-warning border-opacity-10">
                          <th className="p-1">#</th>
                          <th></th>
                          <th>Product Name</th>
                          <th>Price {"($)"}</th>
                          <th>Category</th>
                          <th>Sub-Category</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="font-color fs-6">
                        {!loading ? (
                          allProducts.length > 0 ? (
                            allProducts.map((product, index) => (
                              <tr className="border-bottom border-warning border-opacity-10" key={product?._id}>
                                {
                                  //i did math?
                                }
                                <td className="p-2">{currentPage * productsPerPage - productsPerPage + index + 1}</td>
                                <td className="table-image">
                                  <img
                                    className="lozad object-fit-cover rounded-circle p-3"
                                    data-src={product?.images[0] || product?.image}
                                    alt=""
                                  />
                                </td>
                                <td>{product?.productName}</td>
                                <td>${product?.salePrice}.00</td>
                                <td>{product?.category}</td>
                                <td>{product?.subCategory}</td>
                                <td className="edit-delete">
                                  {/* <Link to={`/admin/editproduct/${product._id}`}  */}

                                  {/* className="text-decoration-none me-3">
                                    <i className="ai ai-eye-fill action bag"> */}
                                  <a
                                    onClick={() => {
                                      navigate(`/admin/editproduct/${product._id}`, {
                                        state: {
                                          existingProduct: product,
                                        },
                                      });
                                    }}
                                    className="text-decoration-none me-3"
                                  >
                                    <svg
                                      width="30px"
                                      height="30px"
                                      viewBox="0 -0.5 25 25"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M13.2942 7.95881C13.5533 7.63559 13.5013 7.16358 13.178 6.90453C12.8548 6.64549 12.3828 6.6975 12.1238 7.02072L13.2942 7.95881ZM6.811 14.8488L7.37903 15.3385C7.38489 15.3317 7.39062 15.3248 7.39623 15.3178L6.811 14.8488ZM6.64 15.2668L5.89146 15.2179L5.8908 15.2321L6.64 15.2668ZM6.5 18.2898L5.7508 18.2551C5.74908 18.2923 5.75013 18.3296 5.75396 18.3667L6.5 18.2898ZM7.287 18.9768L7.31152 19.7264C7.36154 19.7247 7.41126 19.7181 7.45996 19.7065L7.287 18.9768ZM10.287 18.2658L10.46 18.9956L10.4716 18.9927L10.287 18.2658ZM10.672 18.0218L11.2506 18.4991L11.2571 18.491L10.672 18.0218ZM17.2971 10.959C17.5562 10.6358 17.5043 10.1638 17.1812 9.90466C16.8581 9.64552 16.386 9.69742 16.1269 10.0206L17.2971 10.959ZM12.1269 7.02052C11.8678 7.34365 11.9196 7.81568 12.2428 8.07484C12.5659 8.33399 13.0379 8.28213 13.2971 7.95901L12.1269 7.02052ZM14.3 5.50976L14.8851 5.97901C14.8949 5.96672 14.9044 5.95412 14.9135 5.94123L14.3 5.50976ZM15.929 5.18976L16.4088 4.61332C16.3849 4.59344 16.3598 4.57507 16.3337 4.5583L15.929 5.18976ZM18.166 7.05176L18.6968 6.52192C18.6805 6.50561 18.6635 6.49007 18.6458 6.47532L18.166 7.05176ZM18.5029 7.87264L19.2529 7.87676V7.87676L18.5029 7.87264ZM18.157 8.68976L17.632 8.15412C17.6108 8.17496 17.5908 8.19704 17.5721 8.22025L18.157 8.68976ZM16.1271 10.0203C15.8678 10.3433 15.9195 10.8153 16.2425 11.0746C16.5655 11.3339 17.0376 11.2823 17.2969 10.9593L16.1271 10.0203ZM13.4537 7.37862C13.3923 6.96898 13.0105 6.68666 12.6009 6.74805C12.1912 6.80943 11.9089 7.19127 11.9703 7.60091L13.4537 7.37862ZM16.813 11.2329C17.2234 11.1772 17.5109 10.7992 17.4552 10.3888C17.3994 9.97834 17.0215 9.69082 16.611 9.74659L16.813 11.2329ZM12.1238 7.02072L6.22577 14.3797L7.39623 15.3178L13.2942 7.95881L12.1238 7.02072ZM6.24297 14.359C6.03561 14.5995 5.91226 14.9011 5.89159 15.218L7.38841 15.3156C7.38786 15.324 7.38457 15.3321 7.37903 15.3385L6.24297 14.359ZM5.8908 15.2321L5.7508 18.2551L7.2492 18.3245L7.3892 15.3015L5.8908 15.2321ZM5.75396 18.3667C5.83563 19.1586 6.51588 19.7524 7.31152 19.7264L7.26248 18.2272C7.25928 18.2273 7.25771 18.2268 7.25669 18.2264C7.25526 18.2259 7.25337 18.2249 7.25144 18.2232C7.2495 18.2215 7.24825 18.2198 7.24754 18.2185C7.24703 18.2175 7.24637 18.216 7.24604 18.2128L5.75396 18.3667ZM7.45996 19.7065L10.46 18.9955L10.114 17.536L7.11404 18.247L7.45996 19.7065ZM10.4716 18.9927C10.7771 18.9151 11.05 18.7422 11.2506 18.499L10.0934 17.5445C10.0958 17.5417 10.0989 17.5397 10.1024 17.5388L10.4716 18.9927ZM11.2571 18.491L17.2971 10.959L16.1269 10.0206L10.0869 17.5526L11.2571 18.491ZM13.2971 7.95901L14.8851 5.97901L13.7149 5.04052L12.1269 7.02052L13.2971 7.95901ZM14.9135 5.94123C15.0521 5.74411 15.3214 5.6912 15.5243 5.82123L16.3337 4.5583C15.4544 3.99484 14.2873 4.2241 13.6865 5.0783L14.9135 5.94123ZM15.4492 5.7662L17.6862 7.6282L18.6458 6.47532L16.4088 4.61332L15.4492 5.7662ZM17.6352 7.58161C17.7111 7.6577 17.7535 7.761 17.7529 7.86852L19.2529 7.87676C19.2557 7.36905 19.0555 6.88127 18.6968 6.52192L17.6352 7.58161ZM17.7529 7.86852C17.7524 7.97604 17.7088 8.07886 17.632 8.15412L18.682 9.22541C19.0446 8.87002 19.2501 8.38447 19.2529 7.87676L17.7529 7.86852ZM17.5721 8.22025L16.1271 10.0203L17.2969 10.9593L18.7419 9.15928L17.5721 8.22025ZM11.9703 7.60091C12.3196 9.93221 14.4771 11.5503 16.813 11.2329L16.611 9.74659C15.0881 9.95352 13.6815 8.89855 13.4537 7.37862L11.9703 7.60091Z"
                                        fill="var(--font-color)"
                                      />
                                    </svg>
                                  </a>
                                  {/* </i>
                                  </Link> */}
                                  <Link
                                    onClick={() => {
                                      deleteHandler(product._id);
                                    }}
                                    aria-disabled={loading}
                                    className="text-decoration-none"
                                  >
                                    {loading ? (
                                      <span className="spinner-grow spinner-grow-sm bag me-2" aria-hidden="true"></span>
                                    ) : (
                                      // <i className="ai ai-trash-fill action bag">del</i>

                                      <img src="/images/del.svg" alt="del image" style={{ height: 30, width: 30 }} />
                                    )}
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-bottom border-warning border-opacity-10">
                              <td>No</td>
                              <td> </td>
                              <td className="p-2 text-center text-wrap">Products</td>
                              <td> to</td>
                              <td>show</td>
                              <td>here</td>
                            </tr>
                          )
                        ) : (
                          <tr className="border-bottom border-warning border-opacity-10">
                            <td>
                              <span className="mx-2 spinner-grow spinner-grow-sm bag" aria-hidden="true"></span>
                            </td>
                            <td></td>
                            <td className="p-2 text-center text-wrap">
                              <span className="mx-2 spinner-grow spinner-grow-sm bag" aria-hidden="true"></span>
                            </td>
                            <td>
                              <span className="mx-2 spinner-grow spinner-grow-sm bag" aria-hidden="true"></span>
                            </td>
                            <td>
                              <span className="mx-2 spinner-grow spinner-grow-sm bag" aria-hidden="true"></span>
                            </td>
                            <td>
                              <span className="mx-2 spinner-grow spinner-grow-sm bag" aria-hidden="true"></span>
                            </td>
                            <td>
                              <span className="mx-2 spinner-grow spinner-grow-sm bag" aria-hidden="true"></span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {responseData?.totalPages > 1 && (
            <div className="pagination ">
              <button
                className="btn font-color bg-color"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                « Previous
              </button>
              <span>
                Page {currentPage} of {responseData.totalPages}
              </span>
              <button
                className="btn font-color bg-color"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === responseData.totalPages}
              >
                Next »
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;
