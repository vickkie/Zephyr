import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../components";

const { VITE_SERVER } = import.meta.env;

const UpdateAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the announcement ID from the URL
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch the current announcement data for the edit form
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${VITE_SERVER}/api/announcements/${id}`, {
          withCredentials: true,
        });
        const { message, isActive } = response.data;
        setMessage(message);
        setIsActive(isActive);
      } catch (error) {
        console.error(error);
        toast.error(error.message, { className: "toastify" });
      }
    };
    fetchAnnouncement();
  }, [id]);

  const updateAnnouncementHandler = async () => {
    if (!message) return toast.error("Message is required!");

    setLoading(true);
    try {
      await axios.put(`${VITE_SERVER}/api/announcements/${id}`, { message, isActive }, { withCredentials: true });
      toast.success("Announcement updated successfully!", { className: "toastify" });
      navigate("/admin/announcements");
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message, { className: "toastify" });
      setLoading(false);
    }
  };

  return (
    <>
      <section className="container-fluid mt-3">
        <div className="row gap-3">
          <div className="col p-0">
            <div className="card container-fluid bg-colo h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <h3 className="card-heading font-color fs-4 text-uppercase">Edit Announcement</h3>
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Announcement Message
                  </label>
                  <textarea
                    id="message"
                    className="login-input font-color d-block w-100 mb-2 p-3"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isActive"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Active
                  </label>
                </div>
                <button
                  onClick={updateAnnouncementHandler}
                  className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Announcement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateAnnouncement;
