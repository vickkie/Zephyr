import React, { useState, useEffect, useContext } from "react";
import "./ProfileSettings.css";
import PasswordSettings from "./PasswordSettings";
import MyDetails from "./MyDetails";
import { AuthContext } from "../../contexts/AuthContext";
import usePut from "../../hooks/usePut";
import { toast } from "react-toastify";

import { uploadImages } from "../../utils/uploadImages";
import { useLocation } from "react-router-dom";
import { Header, Footer, PageTitle } from "../../components";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("my-details");
  const [selectedImage, setSelectedImage] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const { authData, setAuthData } = useContext(AuthContext);

  const location = useLocation();
  const id = location.state?.id;
  const user = authData;

  console.log(user);

  const { postData, isLoading, error, errorMessage, updateStatus, responseData } = usePut("customer/updateImage");

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      setAuthData(JSON.parse(storedAuthData));
    }
  }, []);

  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
    // console.log(authData);
  }, [authData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Use FileReader to convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // This will now be a base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image before uploading.", { className: "toastify" });
      return;
    }

    try {
      let imageUrl;
      const uploadimage = [selectedImage];
      imageUrl = await uploadImages(uploadimage);

      if (imageUrl) {
        const updatedara = {
          profilePicture: imageUrl.flat()[0],
          id: user._id,
          token: user.token,
        };

        console.log(updatedara);

        postData(updatedara);

        setSelectedImage(null);
      }
    } catch (error) {
      toast.error("Failed to upload image.", { className: "toastify" });
    }
  };

  useEffect(() => {
    if (error) {
      const message = typeof errorMessage === "string" ? errorMessage : "An error occurred. Please try again.";
      toast.error(message, { duration: 6000 }, { className: "toastify" });
    }

    if (updateStatus === 200 && responseData) {
      toast.success("Profile image updated successfully!", { className: "toastify" });
      setAuthData((prevData) => ({
        ...prevData,
        profilePicture: responseData.updatedCustomer.profilePicture,
      }));
    }
  }, [error, errorMessage, updateStatus, responseData, setAuthData]);

  const handlePasswordSubmit = () => {
    // console.log("Password update submitted");
  };

  const ProfilePicture = () => (
    <div className="profileImgWrapper">
      <div
        className="profileImg2"
        style={{ backgroundImage: `url(${previewImage || authData.profilePicture || "./images/userDefault.png"})` }}
      ></div>
    </div>
  );

  if (isLoading) {
    // console.log(authData);
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <PageTitle title={"Profile Settings"} />

      <div className="profile-settings">
        <div className="profile-header">
          <div className="profile-header-inner profile-wrap">
            <div className="profile-image">
              <div className="editPicButton">
                <label htmlFor="imageUpload" className="svg-icon-label">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                      fill="var(--secondary-color)"
                    />
                  </svg>
                </label>

                {/* Hidden input for image upload */}
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              <ProfilePicture />
            </div>
            <div className="profile-info">
              <p className="font-3">{user?.username}</p>
              <p className="font-1">{user ? user?.email : "test@gmail.com"}</p>

              <p className="font-1">{user?.phonenumber}</p>
            </div>
          </div>
          <div>
            {selectedImage && (
              <div className="image-upload-section">
                <button
                  className="uploadImageBtn btn btn-sm border bag mx-lg-4"
                  onClick={handleImageUpload}
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Update Picture"}
                </button>
              </div>
            )}

            <div className="settings-tabs">
              <div
                className={activeTab === "my-details" ? "active actionTab" : "actionTab"}
                onClick={() => setActiveTab("my-details")}
              >
                My details
              </div>

              <div
                className={activeTab === "password" ? "active actionTab" : "actionTab"}
                onClick={() => setActiveTab("password")}
              >
                Password
              </div>
            </div>

            {activeTab === "password" && <PasswordSettings onSubmit={handlePasswordSubmit} />}
            {activeTab === "my-details" && <MyDetails user={user} />}

            {/* <PageWithChat /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
