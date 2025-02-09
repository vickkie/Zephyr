import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../../utils/uploadVideos";
import axios from "axios";

const { VITE_SERVER } = import.meta.env;

const AddHeroVideo = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  // Handle video selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file)); // Generate preview URL
  };

  // Upload video to Cloudinary
  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Please select a video first!");
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = await uploadVideo([videoFile]); // Upload to Cloudinary
      if (uploadedUrl.length > 0) {
        console.log("final", uploadedUrl);
        setVideoUrl(uploadedUrl); // Set the uploaded video URL
        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      toast.error("Video upload failed!");
    }
    setLoading(false);
  };

  // Submit video URL to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) {
      toast.error("Please upload a video first!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${VITE_SERVER}/api/hero/video`, { videoUrl }, { withCredentials: true });

      if (response.data.success) {
        toast.success("Video added successfully!");
        navigate("/admin/hero-settings");
      } else {
        toast.error("Failed to add video!");
      }
    } catch (error) {
      toast.error("Failed to add video!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="container-fluid p-0">
      <div className="row g-3">
        <div className="col-sm-8">
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Hero Video *</h2>
              <input
                type="text"
                className="login-input font-color d-block w-100 mb-2"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                placeholder="Video URL will appear here after upload"
                disabled
              />
            </div>
          </div>

          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Upload Video</h2>
              <label className="d-block p-3 px-5" htmlFor="videoUpload">
                <div className="d-flex justify-content-center align-items-center border border-dashed rounded bg-color p-5">
                  <i className="ai ai-plus bag me-2"></i>
                  <i className="ai ai-file-image-fill fs-1 bag"></i>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="visually-hidden"
                  id="videoUpload"
                  aria-label="Upload video"
                />
              </label>

              <button
                type="button"
                className="btn back-primary d-block my-2 py-3 w-75 justify-self-center m-auto"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </div>
        </div>
        <div className="col-sm-4 card container-fluid p-3 mb-3 d-flex">
          {videoPreview && (
            <div className="d-flex justify-content-center p-3">
              <video className="rounded" width="200" controls>
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div className="card-body p-3 ">
            <button
              type="submit"
              className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Video"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddHeroVideo;
