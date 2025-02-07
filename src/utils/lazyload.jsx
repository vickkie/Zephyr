import lozad from "lozad";
import { useLayoutEffect } from "react";

const Lazyload = () => {
  useLayoutEffect(() => {
    const observer = lozad(".lozad", {
      rootMargin: "300px 0px",
      loaded: (el) => {
        if (el.dataset.backgroundImage) {
          el.style.backgroundImage = `url(${el.dataset.backgroundImage})`;
          el.style.backgroundSize = "cover";
          el.style.backgroundPosition = "center";
          el.style.backgroundRepeat = "no-repeat";
        }
      },
    });

    observer.observe();
  }, []);

  return null; // No need to render anything
};

export default Lazyload;
