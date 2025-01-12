import { useEffect, useState } from "react";
import { uploadImages } from "../../utils/uploadImages"; // Utility function for image upload
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const { VITE_SERVER } = import.meta.env;
const defaultImg = "https://source.unsplash.com/random/500x500/?man,fashion,cloth,placeholder";

const UpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL
  const location = useLocation();

  const existingProduct = location.state?.existingProduct;

  // console.log(existingProduct);

  const [productName, setProductName] = useState(existingProduct?.productName);
  const [shortDescription, setShortDescription] = useState(existingProduct?.shortDescription);
  const [longDescription, setLongDescription] = useState(existingProduct?.longDescription);

  const [images, setImages] = useState([]); // Files for upload
  const [selectedImage, setSelectedImage] = useState([]); // Preview URLs
  const [allImages, setAllImages] = useState([existingProduct?.image, existingProduct?.images].flat()); // Preview URLs

  const [regularPrice, setRegularPrice] = useState(existingProduct?.regularPrice);
  const [salePrice, setSalePrice] = useState(existingProduct?.salePrice);
  const [selectedCategory, setSelectedCategory] = useState(existingProduct?.selectedCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(existingProduct?.selectedSubCategory);
  const [featured, setFeatured] = useState(existingProduct?.featured);

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
        const response = await axios.patch(
          `${VITE_SERVER}/api/admin/update-product`,
          {
            ...productData,
            images: finalImgs,
            id: id,
          },
          {
            withCredentials: true,
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

  if (loading) {
    return;
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
              <div className="card-body p-3">
                <div className="row">
                  <div className="col">
                    <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Existing Pictures *</h2>

                    {allImages.length > 0 && (
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
                      <input
                        type="radio"
                        className="btn-check"
                        name="category"
                        value="men"
                        id="men"
                        checked={selectedCategory === "men"}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        autoComplete="off"
                        required
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="men">
                        Men
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="category"
                        value="women"
                        id="women"
                        checked={selectedCategory === "women"}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        autoComplete="off"
                        required
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="women">
                        Women
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="category"
                        value="kids"
                        id="kids"
                        checked={selectedCategory === "kids"}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        autoComplete="off"
                        required
                      />
                      <label className="filter-btn btn btn-sm border bag mx-lg-4" htmlFor="kids">
                        Kids
                      </label>
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
                        <input
                          type="radio"
                          className="btn-check"
                          name="sub-category"
                          value="dresses"
                          id="dresses"
                          checked={selectedSubCategory === "dresses"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label className="filter-btn btn btn-sm border bag w-100" htmlFor="dresses">
                          Dresses
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="sub-category"
                          value="skirts"
                          id="skirts"
                          checked={selectedSubCategory === "skirts"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label className="filter-btn btn btn-sm border bag w-100" htmlFor="skirts">
                          Skirts
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="sub-category"
                          value="pants"
                          id="pants"
                          checked={selectedSubCategory === "pants"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label className="filter-btn btn btn-sm border bag w-100" htmlFor="pants">
                          Pants
                        </label>
                      </div>
                      <div className="d-flex flex-column gap-3 my-5 w-100">
                        <input
                          type="radio"
                          className="btn-check"
                          name="sub-category"
                          value="shirts"
                          id="shirts"
                          checked={selectedSubCategory === "shirts"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label className="filter-btn btn btn-sm border bag w-100" htmlFor="shirts">
                          Shirts
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="sub-category"
                          value="t-shirts"
                          id="t-shirts"
                          checked={selectedSubCategory === "t-shirts"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label className="filter-btn btn btn-sm border bag w-100" htmlFor="t-shirts">
                          T-shirts
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="sub-category"
                          value="hoodies"
                          id="hoodies"
                          checked={selectedSubCategory === "hoodies"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label className="filter-btn btn btn-sm border bag w-100" htmlFor="hoodies">
                          Hoodies
                        </label>
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
                          <span role="status">Adding...</span>
                        </>
                      ) : (
                        "Add Product"
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
