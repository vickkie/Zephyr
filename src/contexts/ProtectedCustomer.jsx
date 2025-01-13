import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedCustomer = () => {
  const authData = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData || !authData.authData || authData.authData.role !== "customer") {
      console.log("Unauthorized or inactive user", authData);

      navigate("/logout");
      navigate("/login");
    } else {
      // console.log(authData);
    }
  }, [authData, navigate]);

  // Render the children components if authenticated
  return authData && authData.authData && authData.authData.role === "customer" ? <Outlet /> : null;
};

export default ProtectedCustomer;
