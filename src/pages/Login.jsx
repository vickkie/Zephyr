import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { AuthContext } from "../contexts/AuthContext";
import { api, unwrap } from "../utils/api";
import styles from "./css/Login.module.css";

const { VITE_GOOGLE_CLIENT_ID } = import.meta.env;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(IsAuthenticatedContext);
  const { setAuthData } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);
  const googleCredentialHandler = useRef(null);

  /**
   * Redirect an authenticated customer by role. Shared by the password
   * and Google flows so both behave identically.
   */
  const finishLogin = (customer) => {
    login({ _id: customer._id, role: customer.role });
    setAuthData(customer);
    toast.success("Logged in successfully!", { className: "toastify" });
    navigate(customer.role === "admin" ? "/admin" : "/profile");
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await api.post("/auth/login", values);
        const data = unwrap(response);
        if (data.customer) finishLogin(data.customer);
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
    },
  });

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
      if (data.customer) finishLogin(data.customer);
    } catch (error) {
      toast.error(error?.payload?.message || "Google sign-in failed", {
        className: "toastify",
      });
    } finally {
      setGoogleLoading(false);
    }
  };
  googleCredentialHandler.current = handleGoogleCredential;

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
  }, []);

  // Initialize GIS + render the explicit button once the script is available.
  useEffect(() => {
    if (!VITE_GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    const initGoogle = () => {
      if (cancelled) return;
      if (!window.google || !window.google.accounts) return false;
      try {
        window.google.accounts.id.initialize({
          client_id: VITE_GOOGLE_CLIENT_ID,
          callback: (resp) => googleCredentialHandler.current(resp),
          auto_select: false,
          cancel_on_tap_outside: false,
        });
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            shape: "rectangular",
            width: 400,
            text: "continue_with",
            locale: "en",
          });
        }
        window.google.accounts.id.prompt();
        setGoogleReady(true);
        return true;
      } catch {
        return false;
      }
    };

    if (initGoogle()) return;

    // GIS may load after this effect runs; poll until it's ready.
    const interval = setInterval(() => {
      if (initGoogle()) clearInterval(interval);
    }, 300);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailErr =
    formik.touched.email && formik.errors.email ? styles.inputError : "";
  const pwdErr =
    formik.touched.password && formik.errors.password ? styles.inputError : "";

  return (
    <div className={styles.split}>
      {/* Left column — hero image */}
      <aside className={styles.hero} aria-hidden="true">
        <div className={styles.heroOverlay}>
          <span className={styles.heroBrand}>
            ZEPHIR <i className="ai ai-crown-fill" />
          </span>
          <div className={styles.heroTagline}>
            <h2>Wear the quiet luxury.</h2>
            <p>Curated pieces for the modern wardrobe.</p>
          </div>
        </div>
      </aside>

      {/* Right column — login form */}
      <main className={styles.panel}>
        <div className={styles.form}>
          <Link to="/" className={styles.logo}>
            ZEPHIR <i className="ai ai-crown-fill" />
          </Link>

          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subheading}>Log in to continue</p>

          {/* Google login */}
          {VITE_GOOGLE_CLIENT_ID ? (
            googleLoading ? (
              <div className={styles.googleLoading}>
                <span className={styles.spinner} />
                Signing in with Google…
              </div>
            ) : (
              <div className={styles.googleBtn} ref={googleButtonRef}>
                {!googleReady && (
                  <div className={styles.googleFallback}>
                    Continue with Google
                  </div>
                )}
              </div>
            )
          ) : (
            <div className={styles.googleFallback}>Continue with Google</div>
          )}

          <div className={styles.divider} role="separator">
            or
          </div>

          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`${styles.input} ${emailErr}`}
                  aria-invalid={Boolean(emailErr)}
                  aria-describedby="email-err"
                />
              </div>
              <span
                className={styles.errorText}
                id="email-err"
                aria-live="polite"
              >
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""}
              </span>
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`${styles.input} ${pwdErr}`}
                  aria-invalid={Boolean(pwdErr)}
                  aria-describedby="password-err"
                />
                <button
                  type="button"
                  className={styles.pwdToggle}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span
                className={styles.errorText}
                id="password-err"
                aria-live="polite"
              >
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""}
              </span>
            </div>

            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className={styles.footerLink}>
            Don&apos;t have an account?
            <Link to="/register">Sign up</Link>
          </p>

          <Link to="/" className={styles.backHome}>
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Login;
