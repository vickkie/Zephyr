import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import usePut from "../../hooks/usePut";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const MyDetails = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { postData, isLoading, errorMessage, updateStatus, responseData } = usePut("customer/update");
  const { setAuthData } = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("fullname is required"),
    phone: Yup.string().required("Phone Number is required"),
  });

  useEffect(() => {
    if (errorMessage && updateStatus !== 200) {
      toast.error(
        typeof errorMessage === "string" ? errorMessage : "An error occurred. Please try again.",
        {
          duration: 6000,
        },
        { className: "toastify" }
      );
    }
    if (updateStatus === 200 && formSubmitted) {
      toast.success(responseData?.message || "Profile updated successfully!", { className: "toastify" });
      setAuthData(responseData.updatedCustomer);
      setIsEditing(false);
      setFormSubmitted(false);
    }
  }, [errorMessage, updateStatus, responseData, formSubmitted, setAuthData]);

  if (!user) return <div>Loading...</div>;

  const updateProfile = async (values) => {
    setFormSubmitted(true);
    try {
      console.log(values);
      await postData(values);
    } catch (error) {
      toast.error("Failed to update profile."), { className: "toastify" };
    }
  };

  return (
    <>
      {isEditing ? (
        <Formik
          initialValues={{
            phone: user.phone || "",
            fullName: user.fullName || "",
            userId: user._id,
            token: user.token,
            address: user.address || "",
          }}
          validationSchema={validationSchema}
          onSubmit={updateProfile}
        >
          {({ errors, touched }) => (
            <div className="profile-wrap">
              <Form className="my-details-form">
                {/* Input fields in edit mode */}

                <div className="profile-settings-inner">
                  <div className="form-group">
                    <label>Full name</label>
                    <Field
                      type="text"
                      name="fullName"
                      className={touched.fullName && errors.fullName ? "input-error" : ""}
                    />
                    {touched.fullName && errors.fullName && <div className="error">{errors.fullName}</div>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <Field type="number" name="phone" className={touched.phone && errors.phone ? "input-error" : ""} />
                    {touched.phone && errors.phone && <div className="error">{errors.phone}</div>}
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    className="btn text-uppercase bg-prm d-block my-2 py-3  white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    Cancel
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      ) : (
        <div className="profile-wrap">
          <div className="plainHeader">
            <div className="plainHead">Profile settings</div>
            <div className="form-actions flex-center">
              <button
                className="editButton clearbtn"
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" height="1rem" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                    fill="#0F0F0F"
                  />
                </svg>
                <div>Edit Profile</div>
              </button>
            </div>
          </div>
          <div className="plainDetails">
            <div className="form-group">
              <label>Full name</label>
              <span>{user?.fullName}</span>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <span>{user?.phone}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyDetails;
