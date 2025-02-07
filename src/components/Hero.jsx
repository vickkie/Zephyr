import "./Hero.css";
import Lazyload from "../utils/lazyload";

const Hero = () => {
  Lazyload();

  return (
    <section className="banner position-relative mt-3">
      <div className="banner-content d-flex position-absolute top-0 bottom-0 start-0 end-0 align-items-center justify-content-center">
        <div className="row align-items-center">
          <div className="col glass-bg  h-100">
            <h1 className="banner-heading lh-1 text-lowercase">Fashion & Freedom</h1>
            <div className=" shop-herobtn">
              <div className="banner-paragragh fs-5 fw-medium">Shop now</div>
            </div>
          </div>
        </div>
      </div>
      <div className="banner-image position-relative overflow-hidden">
        <div className="image-backdrop-m position-absolute top-0 bottom-0 start-0 end-0 opacity-50"></div>

        <video
          className="position-absolute top-0 bottom-0 start-0 end-0 object-fit-cover w-100 h-100"
          autoPlay
          loop
          muted
          preload="metadata"
        >
          <source src="/videos/av25_banner_10s_desktop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <img className="object-fit-cover w-100 h-100 lozad" src="/images/22.webp" alt="home banner" />
      </div>
    </section>
  );
};

export default Hero;
