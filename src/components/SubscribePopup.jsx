import React, { useState, useEffect } from "react";
import Lazyload from "../utils/lazyload";
import axios from "axios";
import { toast } from "react-toastify";
const { VITE_SERVER } = import.meta.env;

const SubscribePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // For button loading state
  const [error, setError] = useState(""); // For error messages

  Lazyload();

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("subscribed");
    if (!hasSubscribed) {
      const timer = setTimeout(() => setIsOpen(true), 12000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("subscribed", "true");
  };

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.", { className: "toastify" });

      return;
    }

    setError(""); // Clear error message
    setLoading(true); // Show loading state

    try {
      const response = await axios.post(`${VITE_SERVER}/api/subscribe/subscribe`, { email }, { withCredentials: true });

      if (response.data.success) {
        toast.success("Subscribed successfully! Thank you for joining.");
        handleDismiss();
      } else {
        toast.error("Failed to subscribe. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      {isOpen && (
        <div className="subscribe-popup-overlay">
          <div className="subscribe-popup">
            <div className="subscribe-box">
              <button className="close-btn" onClick={handleDismiss}>
                &times;
              </button>
              <div className="popup-content">
                <h2>Do You Want 10% Off?</h2>
                <p>Subscribe to our newsletter for exclusive discounts and updates!</p>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="popup-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button
                  className="popup-btn"
                  onClick={handleSubscribe}
                  disabled={loading} // Disable button during loading
                >
                  {loading ? "Processing..." : "Claim My Discount"}
                </button>
                <button className="dismiss-btn" onClick={handleDismiss}>
                  No, Thanks
                </button>
              </div>
            </div>
            <div
              className="popup-image lozad"
              data-background-image="/images/fashionable-woman-in-fur-coat-and-glasses-enjoying-the-day.pngfree.ai2.webp"
              height={100}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscribePopup;
