import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lazyload from "../utils/lazyload";
import axios from "axios";
import "./Hero.css";

const { VITE_SERVER } = import.meta.env;
const fallbackVideo = "/videos/av25_banner_10s_desktop.mp4";

const Hero = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(fallbackVideo);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  Lazyload();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${VITE_SERVER}/api/hero/video`);

        if (response.data.success && response.data.video?.videoUrl) {
          setVideoUrl(response.data.video.videoUrl);
        } else {
          console.warn("No active video found, using fallback.");
        }
      } catch (error) {
        console.error("Failed to load video, using fallback.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, []);

  return (
    <section className="banner position-relative mt-3">
      <div className="banner-content d-flex position-absolute top-0 bottom-0 start-0 end-0 align-items-center justify-content-center">
        <div className="row align-items-center">
          <div className="col glass-bg h-100">
            <h1 className="banner-heading lh-1 text-lowercase mb-3">Glam & Grandeur</h1>
            <div className="shop-herobtn">
              <div
                className="banner-paragragh fs-5 fw-medium"
                onClick={() => navigate("/shop", { state: { top: true } })}
              >
                Shop now
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="banner-image position-relative overflow-hidden">
        <div className="image-backdrop-m position-absolute top-0 bottom-0 start-0 end-0 opacity-50"></div>

        {isLoading ? (
          ""
        ) : (
          <video
            className="position-absolute top-0 bottom-0 start-0 end-0 object-fit-cover w-100 h-100"
            autoPlay
            loop
            muted
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <img className="object-fit-cover w-100 h-100 lozad" src="/images/22.webp" alt="home banner" />
      </div>
    </section>
  );
};

export default Hero;
