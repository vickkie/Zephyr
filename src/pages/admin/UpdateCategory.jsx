import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImages } from "../../utils/uploadImages";
import axios from "axios";
import useGet from "../../hooks/useGet";

const { VITE_SERVER } = import.meta.env;

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([""]);
  const [categoryPic, setCategoryPic] = useState([]);

  const [selectedImage, setSelectedImage] = useState([]);
  const [newSelected, setnewSelected] = useState(false);
  const { data: categoryData, refetch } = useGet(`admin/category/${id}`);

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData.category.category);
      setSubCategories(categoryData.category.subCategories);
      setSelectedImage([categoryData.category.categoryPic]);
    }
  }, [categoryData]);

  const handleFileChange = (e) => {
    setnewSelected(true);
    const files = Array.from(e.target.files);
    const newFiles = files.filter((file) => !categoryPic.some((img) => img.name === file.name));
    if (newFiles.length > 0) {
      const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setCategoryPic(newFiles);
      setSelectedImage(previewUrls);
    }
  };

  const removeImage = () => {
    setCategoryPic([]);
    setSelectedImage([]);
  };

  const handleSubCategoryChange = (index, value) => {
    const newSubCategories = [...subCategories];
    newSubCategories[index] = value;
    setSubCategories(newSubCategories);
  };

  const addSubCategory = () => {
    setSubCategories([...subCategories, ""]);
  };

  const removeSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let categoryPicUrl = categoryData.category.categoryPic;
    if (newSelected) {
      try {
        categoryPicUrl = await uploadImages(categoryPic);
      } catch (error) {
        toast.error("Image upload failed! Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      //   console.log(
      //     category,
      //     subCategories,
      //     Array.isArray(categoryPicUrl) ? categoryPicUrl[0][0] : categoryPicUrl || categoryData.category?.categoryPic
      //   );
      const response = await axios.put(
        `${VITE_SERVER}/api/admin/update-category/${id}`,
        {
          category,
          subCategories,
          categoryPic: Array.isArray(categoryPicUrl)
            ? categoryPicUrl[0][0]
            : categoryPicUrl || categoryData.category?.categoryPic,
        },
        { withCredentials: true }
      );

      setLoading(false);
      setnewSelected(false);

      //   console.log(response);
      if (response.data.success) {
        toast.success("Category updated successfully!");
        navigate("/admin/categories");
      } else {
        toast.error("Failed to update category!");
        // console.log(response);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update category!");
      if (error.response?.status === 403) {
        toast.error("Session Expired, Login again!");
        navigate("/Logout");
      }
    }
  };

  return (
    <form onSubmit={updateCategoryHandler} className="container-fluid p-0 ">
      <div className="row g-3">
        <div className="col-sm-8">
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Edit Category</h2>
              <input
                type="text"
                className="login-input font-color d-block w-100 mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Subcategories</h2>
              {Array.isArray(subCategories) &&
                subCategories.map((subCategory, index) => (
                  <div key={index} className="d-flex gap-3">
                    <input
                      type="text"
                      className="login-input font-color d-block w-100 mb-2"
                      value={subCategory}
                      onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                    />
                    <div onClick={() => removeSubCategory(index)}>
                      <img
                        src="/images/del.svg"
                        alt="del image"
                        style={{ height: 30, width: 30, justifySelf: "center", alignSelf: "center" }}
                      ></img>
                    </div>
                  </div>
                ))}
              <button type="button" onClick={addSubCategory} className="btn back-primary py-3 my-2">
                Add Subcategory
              </button>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Category Picture</h2>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="d-block mb-3" />
              {selectedImage.length > 0 && (
                <div className="d-flex flex-wrap gap-3">
                  {selectedImage.map((image, index) => (
                    <div
                      key={index}
                      className="position-relative border rounded overflow-hidden"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-1"
                        onClick={removeImage}
                      ></button>
                      <img className="object-fit-cover rounded w-100 h-100" src={image} alt="Preview" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="g-4 card px-3 ">
            <button
              type="submit"
              className="btn back-primary text-uppercase d-block my-2 py-3 w-100 fw-bold"
              disabled={loading}
              style={{ fontSize: 0.88 + "rem" }}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditCategory;
