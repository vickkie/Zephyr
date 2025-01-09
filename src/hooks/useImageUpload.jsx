import axios from "axios";

const {
  VITE_CLOUDINARY_UPLOAD_PRESET: Upload_Preset,
  VITE_CLOUDINARY_CLOUD_NAME: Cloud_Name,
  VITE_LOCAL_UPLOAD_URL: Local_Upload_Url,
} = import.meta.env;

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${Cloud_Name}/image/upload`;
// const Local_Upload_Url = `http://192.168.43.15:7000/api/upload`;

/**
 * The useImageUpload custom hook uploads an image file to either a local server or Cloudinary,
 * depending on the environment (local or production).
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 * @throws Will throw an error if the upload fails.
 */
const useImageUpload = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    if (!Upload_Preset || !Cloud_Name || !Local_Upload_Url) {
      throw new Error("Missing required environment variables: Please check your .env file.");
    }

    // Local upload
    if (import.meta.env.MODE !== "production") {
      console.log("Uploading to local server:", Local_Upload_Url);
      const localResponse = await axios.post(Local_Upload_Url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return localResponse.data.secure_url;
    }

    // Cloudinary upload
    console.log("Uploading to Cloudinary:", cloudinaryUrl);
    formData.append("upload_preset", Upload_Preset);

    const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return cloudinaryResponse.data.secure_url;
  } catch (error) {
    console.error("Image upload failed:", error.message || error);
    throw new Error("Failed to upload the image. Please try again.");
  }
};

export { useImageUpload };
