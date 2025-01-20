import React from "react";
import "./Loading.css";
const Loading = ({ isLoading }) => {
  return (
    <div className={`preloader ${isLoading ? "" : "hide"}`} id="preloader">
      <figure className="preloader--icon">
        <img className="skip-lazy" src="/svg/preloader.svg" width="80" height="80" alt="LOading" />
      </figure>
    </div>
  );
};

export default Loading;
