import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const authData = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData || !authData.authData || authData.authData.role !== "admin" || !authData.authData.token) {
      console.log("Unauthorized or inactive user");

      navigate("/logout");
      navigate("/login");
    } else {
      // console.log(authData);
    }
  }, [authData, navigate]);

  // Render the children components if authenticated
  return authData && authData.authData && authData.authData.role === "admin" ? <Outlet /> : null;
};

export default ProtectedRoutes;
