import axios from "axios";

const {
  VITE_CLOUDINARY_UPLOAD_PRESET: Upload_Preset,
  VITE_CLOUDINARY_CLOUD_NAME: Cloud_Name,
  VITE_LOCAL_UPLOAD_URL: Local_Upload_Url,
} = import.meta.env;

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${Cloud_Name}/image/upload`;

/**
 * The uploadImages function uploads multiple image files to either a local server or Cloudinary,
 * depending on the environment (local or production).
 * @param {File[]} files - The array of image files to upload.
 * @returns {Promise<string[]>} - An array of secure URLs of the uploaded images.
 * @throws Will throw an error if the upload fails.
 */
const uploadImages = async (files) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload.");
  }

  if (!Upload_Preset || !Cloud_Name || !Local_Upload_Url) {
    throw new Error("Missing required environment variables: Please check your .env file.");
  }

  try {
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("productImage", file);

      // Local upload
      if (import.meta.env.MODE !== "production") {
        console.log("Uploading to local server:", Local_Upload_Url);
        const localResponse = await axios.post(Local_Upload_Url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedUrls.push(localResponse.data.secure_url);
        console.log(uploadedUrls.flat());
      } else {
        // Cloudinary upload
        console.log("Uploading to Cloudinary:", cloudinaryUrl);
        formData.append("upload_preset", Upload_Preset);

        const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedUrls.push(cloudinaryResponse.data.secure_url);
      }
    }

    return uploadedUrls;
  } catch (error) {
    console.error("Image upload failed:", error.message || error);
    throw new Error("Failed to upload images. Please try again.");
  }
};

export { uploadImages };
