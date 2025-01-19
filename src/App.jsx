import { useContext, useLayoutEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { Cursor, Logout } from "./components";
import { Home, Shop, Contact, Login, Bag, SingleProduct, Profile, Search, PageNotFound } from "./pages";
import {
  AdminLayout,
  Products,
  AddNewProduct,
  Customers,
  Dashboard,
  Orders,
  CustomerDetails,
  OrderDetails,
  UpdateProduct,
} from "./pages/admin";

import { Orders as CustomerOrders, OrderDetails as CustomerOrdersDetails } from "./pages/customer";

import { ToastContainer } from "react-toastify";
import BagContextProvider from "./contexts/BagContextProvider";

import IsAuthenticatedContext from "./contexts/IsAuthenticatedContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoutes from "./contexts/ProtectedRoutes";
import ProtectedCustomer from "./contexts/ProtectedCustomer";
import ProfileSettings from "./pages/customer/ProfileSettings";
import FloatingThemeToggler from "./components/Theme";
import ScrollTop from "./utils/ScrollTop";

const { VITE_SERVER } = import.meta.env;

// export const appContext = createContext();
function App() {
  // const [search, SetSearch] = useState();

  const { login } = useContext(IsAuthenticatedContext);

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

  return (
    <>
      {/* <appContext.Provider value={{search, SetSearch}} > */}
      <ScrollTop />
      <AuthProvider>
        <BagContextProvider>
          <FloatingThemeToggler />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop category={"all"} />} />
            <Route path="/kids" element={<Shop category={"kids"} subCategory={""} />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            <Route path="/bag" element={<Bag />} />
            <Route path="/logout" element={<Logout />} />

            <Route path="/women">
              <Route path="all" element={<Shop category={"women"} subCategory={""} />} />
              <Route path="dresses" element={<Shop category={"women"} subCategory={"dresses"} />} />
              <Route path="skirts" element={<Shop category={"women"} subCategory={"skirts"} />} />
              <Route path="pants" element={<Shop category={"women"} subCategory={"pants"} />} />
            </Route>

            <Route path="/men">
              <Route path="all" element={<Shop category={"men"} subCategory={""} />} />
              <Route path="hoodies" element={<Shop category={"men"} subCategory={"hoodies"} />} />
              <Route path="shirts" element={<Shop category={"men"} subCategory={"shirts"} />} />
              <Route path="pants" element={<Shop category={"men"} subCategory={"pants"} />} />
            </Route>

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
        </BagContextProvider>
        {/* </appContext.Provider> */}

        <ToastContainer />
        <Cursor />
      </AuthProvider>
    </>
  );
}

export default App;
