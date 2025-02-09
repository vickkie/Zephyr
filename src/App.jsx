import { useContext, useLayoutEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { Cursor, Logout } from "./components";
import { Home, Login, Search, PageNotFound } from "./pages";

import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import BagContextProvider from "./contexts/BagContextProvider";

import IsAuthenticatedContext from "./contexts/IsAuthenticatedContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoutes from "./contexts/ProtectedRoutes";
import ProtectedCustomer from "./contexts/ProtectedCustomer";

import FloatingThemeToggler from "./components/Theme";
import ScrollTop from "./utils/ScrollTop";
import Loading from "./utils/Loading/Loading";
import FaviconUpdater from "./components/FaviconUpdater";
import SubscribePopup from "./components/SubscribePopup";

const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));

const Bag = lazy(() => import("./pages/Bag"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const Profile = lazy(() => import("./pages/Profile"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Products = lazy(() => import("./pages/admin/Products"));
const AddNewProduct = lazy(() => import("./pages/admin/AddNewProduct"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const CustomerDetails = lazy(() => import("./pages/admin/CustomerDetails"));
const OrderDetails = lazy(() => import("./pages/admin/OrderDetails"));
const UpdateProduct = lazy(() => import("./pages/admin/UpdateProduct"));
const AddNewCategory = lazy(() => import("./pages/admin/AddNewCategory"));
const UpdateCategory = lazy(() => import("./pages/admin/UpdateCategory"));
const CreateAnnouncement = lazy(() => import("./pages/admin/CreateAnnouncement"));
const Announcements = lazy(() => import("./pages/admin/Announcements"));
const UpdateAnnouncement = lazy(() => import("./pages/admin/UpdateAnnouncement"));

const CustomerOrders = lazy(() => import("./pages/customer/Orders"));
const CustomerOrdersDetails = lazy(() => import("./pages/customer/OrderDetails"));
const ProfileSettings = lazy(() => import("./pages/customer/ProfileSettings"));

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
      <FaviconUpdater />
      <SubscribePopup />
      {/* <appContext.Provider value={{search, SetSearch}} > */}
      <ScrollTop />
      <AuthProvider>
        <BagContextProvider>
          <FloatingThemeToggler />

          <Suspense fallback={<Loading />}>
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
                  <Route path="announcements" element={<Announcements />} />
                  <Route path="add-announcement" element={<CreateAnnouncement />} />
                  <Route path="edit-announcement/:id" element={<UpdateAnnouncement />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<OrderDetails />} />
                  <Route path="category/:id" element={<UpdateCategory />} />
                  <Route path="add-category" element={<AddNewCategory />} />

                  <Route path="products" element={<Products />} />
                  <Route path="categories" element={<Categories />} />
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
        {/* </appContext.Provider> */}

        <ToastContainer position="top-left" />
        <Cursor />
      </AuthProvider>
    </>
  );
}

export default App;
