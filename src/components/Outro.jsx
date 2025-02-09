import "./Hero.css";
import Lazyload from "../utils/lazyload";
import { useNavigate } from "react-router-dom";

const Outro = () => {
  const navigate = useNavigate();
  Lazyload();

  return (
    <section className="banner position-relative mt-3">
      <div className="banner-content d-flex position-absolute top-0 bottom-0 start-0 end-0 align-items-center justify-content-center">
        <div className="row align-items-center">
          <div className="col glass-bg  h-100">
            <h1 className="banner-heading lh-1 text-lowercase">5% off on checkout</h1>
            <div className=" shop-herobtn">
              <div
                className="banner-paragragh fs-5 fw-medium"
                onClick={() => {
                  navigate("/shop", { state: { top: true } });
                }}
              >
                Shop now
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="banner-image outro-banner position-relative overflow-hidden">
        <div className="image-backdrop-m outro-backdrop position-absolute top-0 bottom-0 start-0 end-0 opacity-50"></div>

        <video
          className="position-absolute  outro-video2 object-fit-cover w-100 h-100 lozad"
          autoPlay
          loop
          muted
          preload="metadata"
          data-src="/videos/17_carrossel_desktop_sunglasses_2.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="glass-bg outro-backdrop-in position-absolute top-0 bottom-0 start-0 end-0 "></div>
        <video
          className="lozad position-absolute outro-video object-fit-cover w-100 h-100"
          autoPlay
          loop
          muted
          preload="metadata"
          data-src="/videos/17_carrossel_desktop_sunglasses_2.mp4"
        >
          Your browser does not support the video tag.
        </video>

        <img className="object-fit-cover w-100 h-100 lozad" src="/images/videoframe_10069.png" alt="home banner" />
      </div>
    </section>
  );
};

export default Outro;
