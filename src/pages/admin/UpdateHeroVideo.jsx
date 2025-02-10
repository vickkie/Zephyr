import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useGet from "../../hooks/useGet";

const { VITE_SERVER } = import.meta.env;

const UpdateHeroVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const { data: videoData } = useGet(`hero/video/${id}`);

  // Prefill the video URL from the fetched data
  useEffect(() => {
    if (videoData?.video?.videoUrl) {
      setVideoUrl(videoData.video.videoUrl);
    }
  }, [videoData]);

  // Handle input change & update preview
  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  // Submit updated video URL to backend
  const updateVideoHandler = async (e) => {
    e.preventDefault();
    if (!videoUrl) {
      toast.error("No video URL provided!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${VITE_SERVER}/api/hero/video`, { videoUrl }, { withCredentials: true });

      if (response.data.success) {
        toast.success("Video updated successfully!");
        navigate("/admin/hero-settings");
      } else {
        toast.error("Failed to update video!");
      }
    } catch (error) {
      toast.error("Failed to update video!");
    }
    setLoading(false);
  };

  const VideoHere = () => {
    return (
      videoUrl && (
        <div className="d-flex justify-content-center p-3">
          <video className="rounded" width="200" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    );
  };

  return (
    <form onSubmit={updateVideoHandler} className="container-fluid p-0">
      <div className="row g-3">
        <div className="col-sm-8">
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Update Hero Video</h2>

              {/* Input for video URL */}
              <input
                type="text"
                className="login-input font-color d-block w-100 mb-2"
                value={videoUrl}
                onChange={handleUrlChange} // Updates preview on change
                required
              />
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card container-fluid p-3 mb-3 d-flex">
            {/* Live Preview of Video */}
            <VideoHere />

            <div className="card-body p-3">
              <button
                type="submit"
                className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Video"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateHeroVideo;
