import lozad from "lozad";
import { useLayoutEffect } from "react";

const Lazyload = () => {
  useLayoutEffect(() => {
    // Observer for <img> elements
    const imgObserver = lozad(".lozad", {
      rootMargin: "300px 0px",
      loaded: (el) => {
        if (el.dataset.src) {
          el.src = el.dataset.src;
          el.classList.add("loaded"); // Optional class for styling
        }
      },
    });

    // Observer for background images
    const bgObserver = lozad(".lozad-back", {
      rootMargin: "300px 0px",
      loaded: (el) => {
        if (el.dataset.backgroundImage) {
          el.style.backgroundImage = `url(${el.dataset.backgroundImage})`;
          el.style.backgroundSize = "cover";
          el.style.backgroundPosition = "center";
          el.style.backgroundRepeat = "no-repeat";
          el.classList.add("loaded"); // Optional class for styling
        }
      },
    });

    imgObserver.observe();
    bgObserver.observe();
  });

  // return null;
};

export default Lazyload;
