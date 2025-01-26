import { lazy, Suspense, useContext, useLayoutEffect, useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { Cursor, Logout } from "./components";
import { ToastContainer } from "react-toastify";
import BagContextProvider from "./contexts/BagContextProvider";
import IsAuthenticatedContext from "./contexts/IsAuthenticatedContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoutes from "./contexts/ProtectedRoutes";
import ProtectedCustomer from "./contexts/ProtectedCustomer";
import FloatingThemeToggler from "./components/Theme";
import ScrollTop from "./utils/ScrollTop";
import useGet from "./hooks/useGet";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Bag = lazy(() => import("./pages/Bag"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const Profile = lazy(() => import("./pages/Profile"));
const Search = lazy(() => import("./pages/Search"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Products = lazy(() => import("./pages/admin/Products"));
const AddNewProduct = lazy(() => import("./pages/admin/AddNewProduct"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const CustomerDetails = lazy(() => import("./pages/admin/CustomerDetails"));
const OrderDetails = lazy(() => import("./pages/admin/OrderDetails"));
const UpdateProduct = lazy(() => import("./pages/admin/UpdateProduct"));

const CustomerOrders = lazy(() => import("./pages/customer/Orders"));
const CustomerOrdersDetails = lazy(() => import("./pages/customer/OrderDetails"));
const ProfileSettings = lazy(() => import("./pages/customer/ProfileSettings"));

const { VITE_SERVER } = import.meta.env;

// Configuration for categories and subcategories
const categories = {
  women: ["all", "dresses", "skirts", "pants"],
  men: ["all", "hoodies", "shirts", "pants"],
  kids: ["all", "hoodies", "shirts", "pants"],
};

function App() {
  const { login } = useContext(IsAuthenticatedContext);
  const { data: allCategories, isLoading, error, errorMessage, statusCode, refetch } = useGet("categories");

  const [categoriess, setCategories] = useState();

  useEffect(() => {
    if (allCategories) {
      setCategories(allCategories?.categories);
      console.log(allCategories?.categories);
    }
  }, [allCategories, categoriess]);

  const isLoggedin = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/auth/is-logged-in`, {
        withCredentials: true,
        headers: {},
      });
      if (response.data.success) {
        login(response.data.user);
      } else {
        console.error("Login check failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error checking login:", error.response?.data || error.message);
    }
  };

  useLayoutEffect(() => {
    isLoggedin();
  }, []);

  const generateCategoryRoutes = () => {
    const routes = [];

    Object.entries(categories).forEach(([category, subCategories]) => {
      subCategories.forEach((subCategory) => {
        const path = `/${category}/${subCategory}`;
        routes.push(path);
      });
    });

    // Log the generated routes
    console.log("Generated Routes:", routes);
    console.log(allCategories);

    return Object.entries(categories).map(([category, subCategories]) => (
      <Route key={category} path={`/${category}`}>
        {subCategories.map((subCategory) => (
          <Route
            key={subCategory}
            path={subCategory}
            element={<Shop category={category} subCategory={subCategory === "all" ? "" : subCategory} />}
          />
        ))}
      </Route>
    ));
  };

  return (
    <>
      <ScrollTop />
      <AuthProvider>
        <BagContextProvider>
          <FloatingThemeToggler />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop category={"all"} />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/product/:id" element={<SingleProduct />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/bag" element={<Bag />} />
              <Route path="/logout" element={<Logout />} />

              {/* Dynamically generated category routes */}
              {generateCategoryRoutes()}

              <Route element={<ProtectedCustomer />}>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="orders/:id" element={<CustomerOrdersDetails />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="profile/settings" element={<ProfileSettings />} />
              </Route>

              <Route element={<ProtectedRoutes />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="" element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<OrderDetails />} />
                  <Route path="products" element={<Products />} />
                  <Route path="add-product" element={<AddNewProduct />} />
                  <Route path="editproduct/:id" element={<UpdateProduct />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="customers/:id" element={<CustomerDetails />} />
                </Route>
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BagContextProvider>

        <ToastContainer position="top-left" />
        <Cursor />
      </AuthProvider>
    </>
  );
}

export default App;
