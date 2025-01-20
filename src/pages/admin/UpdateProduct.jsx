import React, { useEffect, useState } from "react";
import { uploadImages } from "../../utils/uploadImages"; // Utility function for image upload
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useGet from "../../hooks/useGet";
import Loading from "../../utils/Loading/Loading";
const { VITE_SERVER } = import.meta.env;
const defaultImg = "https://source.unsplash.com/random/500x500/?man,fashion,cloth,placeholder";

const UpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL
  const location = useLocation();

  const existingProduct = location.state?.existingProduct;

  const { data: allCategories, isLoading, error, errorMessage, statusCode, refetch } = useGet("admin/all-categories");

  // console.log(existingProduct);

  const [productName, setProductName] = useState(existingProduct?.productName);
  const [shortDescription, setShortDescription] = useState(existingProduct?.shortDescription);
  const [longDescription, setLongDescription] = useState(existingProduct?.longDescription);

  const [images, setImages] = useState([]); // Files for upload
  const [selectedImage, setSelectedImage] = useState([]); // Preview URLs
  const [allImages, setAllImages] = useState([existingProduct?.image, existingProduct?.images].flat()); // Preview URLs

  const [regularPrice, setRegularPrice] = useState(existingProduct?.regularPrice);
  const [salePrice, setSalePrice] = useState(existingProduct?.salePrice);
  const [selectedCategory, setSelectedCategory] = useState(existingProduct?.category);
  const [selectedSubCategory, setSelectedSubCategory] = useState(existingProduct?.selectedSubCategory);
  const [featured, setFeatured] = useState(existingProduct?.featured);
  const [isreversing, setisreversing] = useState(false);
  const [categories, setCategories] = useState("");

  const productData = {
    productName,
    shortDescription,
    longDescription,
    regularPrice,
    salePrice,
    selectedCategory,
    selectedSubCategory,
    featured,
  };

  const successMessage = (productId) => (
    <div>
      Product added successfully!
      <Link to={`/admin/products`} className="ms-2 text-dark">
        view
      </Link>
    </div>
  );
  useEffect(() => {
    if (allCategories !== null) {
      setCategories(allCategories.categories);
    }
  }, [allCategories, isLoading]);

  function removedef(def) {
    return def !== defaultImg;
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // console.log("Files selected:", files);
    // Avoid adding duplicate files
    const newFiles = files.filter((file) => !images.some((img) => img.name === file.name));

    if (newFiles.length > 0) {
      // Generate preview URLs for the new files
      const previewUrls = newFiles.map((file) => URL.createObjectURL(file));

      // Update both images and selectedImage state
      setImages((prev) => [...prev, ...newFiles]);
      setSelectedImage((prev) => [...prev, ...previewUrls]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedImage((prev) => prev.filter((_, i) => i !== index));
  };
  const removeExistingImage = (index) => {
    setAllImages((prev) => prev.filter((_, i) => i !== index));
    // setSelectedImage((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProductHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrls = [];
    try {
      // Upload all selected images
      imageUrls =
        images.length > 0
          ? await uploadImages(images) // Use the utility function
          : [defaultImg];
    } catch (error) {
      // console.error("Failed to upload images:", error);
      toast.error("Image upload failed! Please try again.", { className: "toastify" });
      setLoading(false);
      return;
    }

    try {
      // combine new aND old
      const allUpdatedImgs = [imageUrls.flat(), allImages.flat()].flat();
      console.log(allUpdatedImgs);

      const finalImgs = allUpdatedImgs.filter(removedef);
      const allproducts = { ...productData, images: finalImgs };

      console.log(allproducts);

      if (allUpdatedImgs.includes(defaultImg, 0) && allUpdatedImgs.length <= 1) {
        toast.error("You must have atleast 1 image!", { className: "toastify" });
        console.log("CANNOT CONTINUE");
      } else {
        setLoading(true);
        const response = await axios.patch(
          `${VITE_SERVER}/api/admin/update-product`,
          {
            ...productData,
            images: finalImgs,
            id: id,
          },
          {
            withCredentials: true,
            headers: {},
          }
        );

        // console.log(response);

        setLoading(false);

        if (response.data.success) {
          toast.success(successMessage(response.data.product._id), {
            className: "toastify",
            autoClose: 15000,
          });
          navigate("/admin/products");
        } else {
          toast.error("Failed to update product!", { className: "toastify" });
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update product!", { className: "toastify" });
      if (error.response && error.response.status === 403) {
        toast.error("Session Expired, Login again!", { className: "toastify" });
        navigate("/Logout");
      }
    }
  };

  // Validate sale and regular price
  useEffect(() => {
    if (parseFloat(salePrice) > parseFloat(regularPrice)) {
      toast.error("Sale price cannot be greater than regular price!", { className: "toastify" });
    }
  }, [salePrice, regularPrice]);

  const reverseme = () => {
    console.log(allImages, "b4");
    setisreversing(true);
    let imagesrev = allImages.reverse();
    setAllImages(imagesrev);
    toast.success("Images reversed successfully", { className: "toastify" });
    setisreversing(false);
    console.log(allImages, "af");
  };

  if (isreversing) {
    return;
  }

  if (loading) {
    return <Loading />;
  } else {
    return (
      <form className="container-fluid p-0" onSubmit={updateProductHandler}>
        <div className="row g-3">
          <div className="col-sm-8">
            {/* <!-- Bag Items section  --> */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Product Title *</h2>
                    <input
                      type="text"
                      className="login-input font-color d-block w-100 mb-2"
                      id="productName"
                      name="productName"
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder=""
                      value={productName}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Short Description *</h2>
                    <textarea
                      className="login-input font-color d-block w-100 mb-2 p-3"
                      rows={2}
                      id="shortDescription"
                      name="shortDescription"
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder=""
                      value={shortDescription}
                      required
                      autoComplete="off"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Long Description *</h2>
                    <textarea
                      className="login-input font-color d-block w-100 mb-2 p-3"
                      rows={6}
                      id="longDescription"
                      name="longDescription"
                      onChange={(e) => setLongDescription(e.target.value)}
                      placeholder=""
                      required
                      value={longDescription}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="card container-fluid p-3 mb-3">
              <div className="top-1 end-0 position-absolute" onClick={reverseme} title="reverse image order">
                <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.73167 5.77133L5.66953 9.91436C4.3848 11.6526 3.74244 12.5217 4.09639 13.205C4.10225 13.2164 4.10829 13.2276 4.1145 13.2387C4.48945 13.9117 5.59888 13.9117 7.81775 13.9117C9.05079 13.9117 9.6673 13.9117 10.054 14.2754L10.074 14.2946L13.946 9.72466L13.926 9.70541C13.5474 9.33386 13.5474 8.74151 13.5474 7.55682V7.24712C13.5474 3.96249 13.5474 2.32018 12.6241 2.03721C11.7007 1.75425 10.711 3.09327 8.73167 5.77133Z"
                    fill="#1C274C"
                  />
                  <path
                    opacity="0.5"
                    d="M10.4527 16.4432L10.4527 16.7528C10.4527 20.0374 10.4527 21.6798 11.376 21.9627C12.2994 22.2457 13.2891 20.9067 15.2685 18.2286L18.3306 14.0856C19.6154 12.3474 20.2577 11.4783 19.9038 10.7949C19.8979 10.7836 19.8919 10.7724 19.8857 10.7613C19.5107 10.0883 18.4013 10.0883 16.1824 10.0883C14.9494 10.0883 14.3329 10.0883 13.9462 9.72461L10.0742 14.2946C10.4528 14.6661 10.4527 15.2585 10.4527 16.4432Z"
                    fill="#1C274C"
                  />
                </svg>
              </div>
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Existing Pictures *</h2>

                    {allImages.length > 0 && !isreversing && (
                      <div className="d-flex justify-content-center p-3 flex-wrap gap-3">
                        {allImages.map((image, index) => (
                          <div
                            key={index}
                            className="position-relative border rounded overflow-hidden"
                            style={{ width: "120px", height: "120px" }}
                          >
                            {/* Remove button */}
                            <button
                              type="button"
                              className="btn-close position-absolute top-0 end-0 m-1"
                              aria-label={`Remove image ${index + 1}`}
                              onClick={() => removeExistingImage(index)}
                            ></button>

                            {/* Image preview */}
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
              </div>
            </div>
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Updating Pictures *</h2>

                    <label className="d-block p-3 px-5" htmlFor="productImage">
                      <div className="d-flex justify-content-center align-items-center border border-dashed rounded bg-color p-5">
                        <i className="ai ai-plus bag me-2"></i>
                        <i className="ai ai-file-image-fill fs-1 bag"></i>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                        className="visually-hidden"
                        name="productImage"
                        id="productImage"
                        aria-label="Upload product images"
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
                            {/* Remove button */}
                            <button
                              type="button"
                              className="btn-close position-absolute top-0 end-0 m-1"
                              aria-label={`Remove image ${index + 1}`}
                              onClick={() => removeImage(index)}
                            ></button>

                            {/* Image preview */}
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
              </div>
            </div>

            {/* Pricing */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Pricing $.</h2>

                    <div className="row gap-3 px-2">
                      <div className="col-md p-0">
                        <label htmlFor="pincode" className="font-color product-card-price mb-1">
                          Regular Price *
                        </label>
                        <input
                          type="number"
                          className="login-input font-color d-block w-100"
                          id="regularPrice"
                          name="regularPrice"
                          onChange={(e) => setRegularPrice(e.target.value)}
                          placeholder=""
                          required
                          value={regularPrice}
                        />
                      </div>
                      <div className="col-md p-0">
                        <label htmlFor="country" className="font-color product-card-price mb-1">
                          Sale Price *
                        </label>
                        <input
                          type="number"
                          className="login-input font-color d-block w-100"
                          id="salePrice"
                          name="salePrice"
                          onChange={(e) => setSalePrice(e.target.value)}
                          placeholder=""
                          required
                          value={salePrice}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            {/* Category */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Category</h2>
                    <div className="d-flex flex-column gap-3 my-5">
                      {categories &&
                        Array.isArray(categories) &&
                        categories.map((category) => (
                          <div key={category._id}>
                            <input
                              type="radio"
                              className="btn-check"
                              name="category"
                              value={category.category}
                              id={category.category}
                              checked={selectedCategory === category.category}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              autoComplete="off"
                              required
                            />
                            <label
                              className="filter-btn btn btn-sm border bag mx-lg-4 w-100"
                              htmlFor={category.category}
                            >
                              {category.category}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Sub-Category</h2>
                    <div className="d-flex justify-content-center gap-3">
                      <div className="d-flex flex-column gap-3 my-5 w-100">
                        {Array.isArray(categories) &&
                          selectedCategory &&
                          categories
                            .find((cat) => cat.category === selectedCategory)
                            ?.subCategories.map((subCategory, index) => (
                              <div key={index}>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="sub-category"
                                  value={subCategory}
                                  id={subCategory}
                                  checked={selectedSubCategory === subCategory}
                                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                                  autoComplete="off"
                                  required
                                />
                                <label className="filter-btn btn btn-sm border bag w-100" htmlFor={subCategory}>
                                  {subCategory}
                                </label>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured or not */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Featured</h2>

                    <div className="d-flex flex-column gap-3 my-5 px-4 w-100">
                      <input
                        type="checkbox"
                        className="btn-check"
                        name="featured"
                        id="featured"
                        value="featured"
                        // onChange={handleFeaturedCheck}
                        onChange={(e) => setFeatured(e.target.checked)}
                        autoComplete="off"
                        checked={featured}
                      />
                      <label className="filter-btn btn btn-sm border bag w-100" htmlFor="featured">
                        Featured
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Product Button Card */}
            <div className="card container-fluid p-3 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col contact-form">
                    {/* <h2 className="card-heading text-uppercase fs-4 font-color mb-4">
                    Submit
                  </h2> */}
                    <button
                      type="submit"
                      className="btn text-uppercase d-block my-2 py-3 w-100 fw-bold"
                      style={{ fontSize: 0.88 + "rem" }}
                      // disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm text-dark me-2" aria-hidden="true"></span>
                          <span role="status">Updating...</span>
                        </>
                      ) : (
                        "Update Product"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
};

export default UpdateProduct;
