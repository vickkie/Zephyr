import axios from "axios";

const { VITE_CLOUDINARY_UPLOAD_PRESET: Upload_Preset, VITE_CLOUDINARY_CLOUD_NAME: Cloud_Name } = import.meta.env;

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${Cloud_Name}/video/upload`;

const uploadVideo = async (file) => {
  if (!file) {
    throw new Error("No video file provided for upload.");
  }

  if (!Upload_Preset || !Cloud_Name) {
    throw new Error("Missing required environment variables: Please check your .env file.");
  }

  try {
    const formData = new FormData();
    formData.append("file", file[0]);
    formData.append("upload_preset", Upload_Preset);
    console.log("File received:", file[0]);

    console.log("Uploading video to Cloudinary:", file[0].name);

    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Video uploaded successfully:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Video upload failed:", error.response?.data || error.message);
    throw new Error("Failed to upload video. Please try again.");
  }
};

export { uploadVideo };
