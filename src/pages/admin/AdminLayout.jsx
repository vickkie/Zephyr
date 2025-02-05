import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import FloatingButton from "../../components/FloatingButton";

const AdminHeader = () => {
  const [storedValue, setStoredValue] = useLocalStorage("themeMode", []);

  useEffect(() => {
    const storedThemeMode = localStorage.getItem("themeMode");

    console.log(storedThemeMode);
    if (storedThemeMode) {
      setStoredValue(JSON.parse(storedThemeMode));
    }
  }, []);

  useEffect(() => {
    if (storedValue) {
      localStorage.setItem("themeMode", JSON.stringify(storedValue));
    } else {
      setStoredValue("darkMode");
    }
    console.log(storedValue);
  }, [storedValue, setStoredValue]);

  const lightmode = "lightmode";
  const darkmode = "darkmode";

  useEffect(() => {
    const element = document.querySelector(".body");
    if (storedValue === lightmode) {
      element.classList.add(lightmode);
      element.classList.remove(darkmode);
    } else if (storedValue === darkmode) {
      element.classList.remove(lightmode);
      element.classList.add(darkmode);
    }
  }, []);
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid px-4 py-2">
        <NavLink className="navbar-brand font-color position-relative" to="/">
          Zephyr
          <span className="position-absolute top-0 start-50 translate-middle fs-6">
            <i className="ai ai-crown-fill bag"></i>
          </span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-theme="dark"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H21" stroke="var(--font-color)" strokeWidth="1.5" strokeLinecap="round" />
            {/* <path
                    opacity="0.34"
                    d="M3 12H21"
                    stroke="var(--font-color)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  /> */}
            <path d="M3 17H21" stroke="var(--font-color)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="admin-navbar collapse navbar-collapse row navbarNav" id="navbarNav">
          <ul className="navbar-nav  col font-color justify-content-end gap-">
            <li className="nav-link">
              <NavLink
                to="dashboard"
                id="login"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                to="orders"
                id="login"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Orders
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                to="categories"
                id="login"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Categories
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                to="products"
                id="products"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                to="customers"
                id="customers"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Customers
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                to="announcements"
                id="announcements"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Settings
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                to="/logout"
                id="login"
                className="btn d-flex align-items-center nav-link font-color bg-color px-4 py-2 mx-2 text-uppercase"
                style={{ fontSize: 0.88 + "rem" }}
              >
                Logout
                {/* <i className="ai ai-sign-out-fill ms-2"></i> */}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const AdminLayout = () => {
  const { authData, setAuthData } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      setAuthData(JSON.parse(storedAuthData));
    }
  }, []);

  useEffect(() => {
    if (!authData) {
      navigate("/logout");
      navigate("/login");
    }
  }, [authData, navigate]);
  return (
    <>
      <AdminHeader />
      {/* <FloatingButton /> */}
      <Outlet />
    </>
  );
};

export default AdminLayout;
