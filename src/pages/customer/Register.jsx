import { Footer, Header } from "../components";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

const { VITE_SERVER } = import.meta.env;

const Register = () => {
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * The `handleRegister` function is an asynchronous function that handles user registration by sending
   * a POST request to the server, processing the response, and displaying appropriate messages based on the
   * outcome.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(VITE_SERVER + "/auth/register", formData, {
        withCredentials: true,
        headers: {},
      });

      if (response.data.customer) {
        setAuthData(response.data.customer);
        toast.success("Registration successful!", { className: "toastify" });
        navigate("/profile"); // Redirect to the profile page after successful registration
      }
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Server Down!", { className: "toastify" });
      }
      error?.response?.status === 400
        ? toast.error(error.response.data.message, { className: "toastify" })
        : toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container-fluid position-relative h-500px p-0">
        <div className="register-card h-50 w-50 font-color">
          {/* Registration form */}
          <form onSubmit={handleRegister} className="register-form align-item-center mb-0 d-flex position-static">
            <h1 className="register-heading fs-5 lh-lg text-uppercase">Register</h1>
            <input
              type="text"
              className="register-input font-color d-block my-2"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={(e) => onChangeHandler(e)}
              required
            />

            <input
              type="email"
              className="register-input font-color d-block my-2"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => onChangeHandler(e)}
              required
            />

            <input
              type="password"
              name="password"
              id="password"
              className="register-input font-color d-block my-2"
              placeholder="Enter your password"
              onChange={(e) => onChangeHandler(e)}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="register-input font-color d-block my-2"
              placeholder="Confirm your password"
              onChange={(e) => onChangeHandler(e)}
              required
            />

            <button type="submit" className="btn text-uppercase d-block my-2 py-3" style={{ fontSize: 0.88 + "rem" }}>
              Submit
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Register;
