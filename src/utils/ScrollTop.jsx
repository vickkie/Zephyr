import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollTop() {
  const location = useLocation();

  const exemptions = ["shop", "women", "men", "kids"];

  useEffect(() => {
    if (exemptions.includes(location.pathname.split("/")[1], 0)) {
      // console.log("seen");
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}
