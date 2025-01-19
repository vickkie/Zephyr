import axios from "axios";
import { useContext, useEffect } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { AuthContext } from "../contexts/AuthContext";

const { VITE_SERVER } = import.meta.env;

const Logout = () => {
  const { logout } = useContext(IsAuthenticatedContext);

  const { setAuthData } = useContext(AuthContext);

  const logOut = async () => {
    // Clear user data in context
    setAuthData(null);

    // Clear localStorage
    localStorage.removeItem("authData");

    // logs out from server
    const response = await axios.get(`${VITE_SERVER}/auth/logout`, {
      withCredentials: true,
    });
    // console.log(response.data);

    // Clear session storage
    sessionStorage.clear();

    logout(); // calling context fn
  };

  useEffect(() => {
    logOut();
  });

  // return <div>Something went wrong! please go back and try again.</div>;
};

export default Logout;
