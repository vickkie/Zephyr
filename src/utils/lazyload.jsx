import lozad from "lozad";
import { useLayoutEffect } from "react";

const Lazyload = () => {
  useLayoutEffect(() => {
    const observer = lozad(".lozad", {
      rootMargin: "300px 0px",
      loaded: function (el) {
        // console.log("Element loaded:", el);
      },
    });
    observer.observe();
  });
};

export default Lazyload;
