import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components";

const { VITE_SERVER } = import.meta.env;

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const createAnnouncementHandler = async () => {
    if (!message) return toast.error("Message is required!");

    setLoading(true);
    try {
      await axios.post(`${VITE_SERVER}/api/announcements`, { message, isActive }, { withCredentials: true });
      toast.success("Announcement created successfully!", { className: "toastify" });
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
                  <h3 className="card-heading font-color fs-4 text-uppercase">Create New Announcement</h3>
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
                  onClick={createAnnouncementHandler}
                  className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Announcement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateAnnouncement;
