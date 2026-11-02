import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import "./AdminLayout.css";

const AdminHeader = () => {
  const [storedValue, setStoredValue] = useLocalStorage("themeMode", []);
  const location = useLocation();

  useEffect(() => {
    const storedThemeMode = localStorage.getItem("themeMode");

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
  }, [storedValue, setStoredValue]);

  const lightmode = "lightmode";
  const darkmode = "darkmode";
  const navClass = ({ isActive }) =>
    `admin-nav-link${isActive ? " is-active" : ""}`;

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
    <nav
      aria-label="Admin navigation"
      className="navbar navbar-expand-lg admin-topbar"
    >
      <div className="admin-topbar-inner">
        <NavLink
          aria-label="Zephir home"
          className="admin-brand"
          to="/"
        >
          ZEPHIR
        </NavLink>

        <button
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle admin navigation"
          className="navbar-toggler admin-menu-toggle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-theme="dark"
          data-bs-target="#navbarNav"
        >
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7H21"
              stroke="var(--font-color)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* <path
                    opacity="0.34"
                    d="M3 12H21"
                    stroke="var(--font-color)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  /> */}
            <path
              d="M3 17H21"
              stroke="var(--font-color)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="admin-navbar collapse navbar-collapse" id="navbarNav">
          <ul className="admin-nav-list">
            <li>
              <NavLink
                to="dashboard"
                end
                className={({ isActive }) =>
                  `admin-nav-link${
                    isActive || location.pathname === "/admin"
                      ? " is-active"
                      : ""
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="orders"
                className={navClass}
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="transactions"
                className={navClass}
              >
                Transactions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="categories"
                className={navClass}
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="products"
                className={navClass}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="customers"
                className={navClass}
              >
                Customers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="settings"
                className={navClass}
              >
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                className={navClass}
              >
                Logout
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
    <div className="zephir-admin-shell">
      <AdminHeader />
      <div className="admin-route-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
