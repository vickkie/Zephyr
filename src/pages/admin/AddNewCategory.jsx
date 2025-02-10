import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uploadImages } from "../../utils/uploadImages";
import axios from "axios";
import useGet from "../../hooks/useGet";

const { VITE_SERVER } = import.meta.env;

const AddNewCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: allCategories } = useGet("admin/all-categories");

  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([""]);
  const [categoryPic, setCategoryPic] = useState([]); // Now initialized as an array
  const [selectedImage, setSelectedImage] = useState([]);

  // Handle image upload for category picture
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter((file) => !categoryPic.some((img) => img.name === file.name));

    if (newFiles.length > 0) {
      const previewUrls = newFiles.map((file) => URL.createObjectURL(file));

      setCategoryPic((prev) => [...(prev || []), ...newFiles]); // Ensure prev is always an array
      setSelectedImage((prev) => [...prev, ...previewUrls]);
    }
  };

  const removeImage = (index) => {
    setCategoryPic((prev) => prev.filter((_, i) => i !== index));
    setSelectedImage((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubCategoryChange = (index, value) => {
    const newSubCategories = [...subCategories];
    newSubCategories[index] = value;
    setSubCategories(newSubCategories);
  };

  const addSubCategory = () => {
    setSubCategories([...subCategories, ""]); // Add an empty input field
  };

  const removeSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index)); // Remove at index
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let categoryPicUrl = "";
    if (categoryPic.length > 0) {
      try {
        categoryPicUrl = await uploadImages(categoryPic); // Pass the whole array
      } catch (error) {
        toast.error("Image upload failed! Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      // console.log(category, subCategories, categoryPicUrl[0].toString());
      const response = await axios.post(
        `${VITE_SERVER}/api/admin/add-category`,
        {
          category,
          subCategories,
          categoryPic:
            categoryPicUrl[0].toString() ||
            "https://res.cloudinary.com/dgcgemsn7/image/upload/f_auto,q_auto/viefnhtx7mver3tgw1ye",
        },
        { withCredentials: true }
      );

      setLoading(false);
      if (response.data.success) {
        toast.success("Category added successfully!");
        navigate("/admin/categories");
      } else {
        // console.log(response);
        toast.error("Failed to add category!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to add category!");
      if (error.response?.status === 403) {
        toast.error("Session Expired, Login again!");
        navigate("/Logout");
      }
    }
  };

  return (
    <form onSubmit={addCategoryHandler} className="container-fluid p-0">
      <div className="row g-3">
        <div className="col-sm-8">
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Category Name *</h2>
              <input
                type="text"
                className="login-input font-color d-block w-100 mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Subcategories */}
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Subcategories</h2>
              {subCategories.map((subCategory, index) => (
                <div key={index} className="d-flex gap-3">
                  <input
                    type="text"
                    className="login-input font-color d-block w-100 mb-2"
                    value={subCategory}
                    onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                  />
                  <div onClick={() => removeSubCategory(index)} className="">
                    <img
                      src="/images/del.svg"
                      alt="del image"
                      style={{ height: 30, width: 30, justifySelf: "center", alignSelf: "center" }}
                    ></img>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubCategory}
                className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
              >
                Add Subcategory
              </button>
            </div>
          </div>

          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Category Picture *</h2>
              <label className="d-block p-3 px-5" htmlFor="categoryImage">
                <div className="d-flex justify-content-center align-items-center border border-dashed rounded bg-color p-5">
                  <i className="ai ai-plus bag me-2"></i>
                  <i className="ai ai-file-image-fill fs-1 bag"></i>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="visually-hidden"
                  id="categoryImage"
                  aria-label="Upload category images"
                />
              </label>

              {selectedImage.length > 0 && (
                <div className="d-flex justify-content-center p-3 flex-wrap gap-3">
                  {selectedImage.map((image, index) => (
                    <div
                      key={index}
                      className="position-relative border rounded overflow-hidden"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-1"
                        onClick={() => removeImage(index)}
                      ></button>
                      <img
                        className="object-fit-cover rounded w-100 h-100"
                        src={image}
                        alt={`Uploaded preview ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <button
                type="submit"
                className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
                disabled={loading}
              >
                {loading ? "Loading..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Existing Categories</h2>
              <div className="d-flex flex-column font-color gap-3 my-5">
                {allCategories?.categories?.map((category) => (
                  <div key={category._id}>
                    <h4 className="card-heading text-uppercase fs-4 text-primary2 mb-4">{category.category}</h4>
                    <p className="text-uppercase fs-12 font-color mb-2">
                      Subcategories: {category.subCategories.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewCategory;
