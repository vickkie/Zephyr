import "./Hero.css";
import Lazyload from "../utils/lazyload";

const Hero = () => {
  Lazyload();

  return (
    <section className="banner position-relative mt-3">
      <div className="banner-content d-flex position-absolute top-0 bottom-0 start-0 end-0 align-items-end">
        <div className="row align-items-end">
          <div className="col h-100">
            <h1 className="banner-heading lh-1 text-uppercase">
              Fashion <br /> & Freedom
            </h1>
            <p className="banner-paragragh fs-5 fw-medium">
              Bringing Your Fashion Brand&rsquo;s Unique Identity to Life Through <br /> Amazing Styles and Products.
            </p>
          </div>
        </div>
      </div>
      <div className="banner-image position-relative overflow-hidden">
        <div className="image-backdrop-m position-absolute top-0 bottom-0 start-0 end-0 opacity-50"></div>

        <video
          className="position-absolute top-0 bottom-0 start-0 end-0 object-fit-cover w-100 h-100 lozad"
          loop
          autoPlay
          muted
        >
          <source data-src="/videos/av25_banner_10s_desktop.mp4" type="video/mp4" />
        </video>

        <img className="object-fit-cover w-100 h-100 lozad" data-src="/images/22.webp" alt="home banner" />
      </div>
    </section>
  );
};

export default Hero;
