import { Footer, Header } from "../components";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { api, unwrap } from "../utils/api";

const { VITE_GOOGLE_CLIENT_ID } = import.meta.env;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(IsAuthenticatedContext);
  const { setAuthData } = useContext(AuthContext);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef(null);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Password login. Sends credentials to the backend; on success stores the
   * customer in auth context and redirects by role.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const data = unwrap(response);
      const customer = data.customer;
      if (customer) {
        login({ _id: customer._id, role: customer.role });
        setAuthData(customer);
        toast.success("Logged in successfully!", { className: "toastify" });
        navigate(customer.role === "admin" ? "/admin" : "/profile");
      }
    } catch (error) {
      if (error?.payload?.message) {
        toast.error(error.payload.message, { className: "toastify" });
      } else if (error?.code === "ERR_NETWORK") {
        toast.error("Server Down!", { className: "toastify" });
      } else {
        toast.error("Server Error", { className: "toastify" });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google One Tap credential callback. The credential (a Google ID token)
   * is sent to the backend for server-side verification. The client is never
   * trusted for identity.
   */
  const handleGoogleCredential = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await api.post("/auth/google", {
        credential: response.credential,
      });
      const data = unwrap(res);
      const customer = data.customer;
      if (customer) {
        login({ _id: customer._id, role: customer.role });
        setAuthData(customer);
        toast.success("Logged in with Google!", { className: "toastify" });
        navigate(customer.role === "admin" ? "/admin" : "/profile");
      }
    } catch (error) {
      toast.error(error?.payload?.message || "Google sign-in failed", {
        className: "toastify",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Render the Google One Tap prompt + button alongside the existing form.
  // This is additive — the password form below is unchanged in function.
  useEffect(() => {
    if (!VITE_GOOGLE_CLIENT_ID || typeof window === "undefined") return;
    if (!window.google || !window.google.accounts) return;

    try {
      window.google.accounts.id.initialize({
        client_id: VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // Render the explicit button (always visible alongside the form).
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
        });
      }

      // Show the One Tap prompt too (dismissable).
      window.google.accounts.id.prompt();
    } catch {
      // GIS may not be ready yet; safe to ignore — the button still renders.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inject the Google Identity Services script once.
  useEffect(() => {
    if (!VITE_GOOGLE_CLIENT_ID) return;
    if (document.getElementById("google-gis-script")) return;
    const script = document.createElement("script");
    script.id = "google-gis-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <main className="container-fluid position-relative h-500px p-0">
        <div className="login-card h-50 w-50 font-color">
          {/* Login form  */}
          <form
            onSubmit={handleLogin}
            className="login-form align-item-center mb-0 d-flex position-static"
          >
            <h1 className="login-heading fs-5 lh-lg text-uppercase">Login</h1>
            <input
              type="email"
              className="login-input font-color d-block my-2"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => onChangeHandler(e)}
              required
              autoComplete="email"
            />

            <input
              type="password"
              name="password"
              id="password"
              className="login-input font-color d-block my-2"
              placeholder="Enter your password"
              onChange={(e) => onChangeHandler(e)}
              required
              autoComplete="current-password"
            />

            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>

            <button
              type="submit"
              className="btn text-uppercase d-block my-2 py-3"
              style={{ fontSize: 0.88 + "rem" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-grow spinner-grow-sm text-dark me-2"
                    aria-hidden="true"
                  ></span>
                  <span role="status">Logging in…</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          {/* Google One Tap — alongside the existing login, not replacing it. */}
          {VITE_GOOGLE_CLIENT_ID && (
            <div className="mt-3 d-flex flex-column align-items-center gap-2">
              <div
                className="product-card-price font-color"
                style={{ fontSize: "0.8rem" }}
              >
                or
              </div>
              <div ref={googleButtonRef} aria-label="Continue with Google" />
              {googleLoading && (
                <span
                  className="product-card-price font-color"
                  style={{ fontSize: "0.8rem" }}
                >
                  Signing in with Google…
                </span>
              )}
            </div>
          )}
          {!VITE_GOOGLE_CLIENT_ID && (
            <p
              className="product-card-price font-color mt-3"
              style={{ fontSize: "0.75rem" }}
            >
              Google sign-in is not configured on this environment.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
