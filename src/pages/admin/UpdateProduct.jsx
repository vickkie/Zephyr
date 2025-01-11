import { useEffect, useState } from "react";
import { uploadImages } from "../../utils/uploadImages"; // Utility function for image upload
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

const { VITE_SERVER } = import.meta.env;

const UpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL

  const [existingProduct, setexistingProduct] = useState("");

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/product/${id}`, {
        withCredentials: true,
      });
      console.log("product", response);
      response ? setexistingProduct({ ...response.data.product }) : navigate("/404");
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
      if (error.response.status === 500) {
        navigate("/404");
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const [productName, setProductName] = useState(existingProduct.productName || "");
  const [shortDescription, setShortDescription] = useState(existingProduct.shortDescription || "");
  const [longDescription, setLongDescription] = useState(existingProduct.longDescription || "");

  const [images, setImages] = useState([]); // Files for upload
  const [selectedImage, setSelectedImage] = useState(existingProduct.images || []); // Preview URLs

  const [regularPrice, setRegularPrice] = useState(existingProduct.regularPrice || "");
  const [salePrice, setSalePrice] = useState(existingProduct.salePrice || "");

  const [selectedCategory, setSelectedCategory] = useState(existingProduct.selectedCategory || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(existingProduct.selectedSubCategory || "");
  const [featured, setFeatured] = useState(existingProduct.featured || false);

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
      Product updated successfully!
      <Link to={`/product/${productId}`} className="ms-2 text-dark">
        view
      </Link>
    </div>
  );

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter((file) => !images.some((img) => img.name === file.name));

    if (newFiles.length > 0) {
      const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newFiles]);
      setSelectedImage((prev) => [...prev, ...previewUrls]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedImage((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProductHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrls = [];
    try {
      imageUrls =
        images.length > 0
          ? await uploadImages(images) // Use the utility function
          : selectedImage;
    } catch (error) {
      toast.error("Image upload failed! Please try again.", { className: "toastify" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${VITE_SERVER}/api/admin/update-product/${productId}`, // Use PUT method for update
        {
          ...productData,
          images: imageUrls.flat(), // Include all uploaded image URLs
        },
        {
          withCredentials: true,
        }
      );

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
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update product!", { className: "toastify" });
      if (error.response && error.response.status === 403) {
        toast.error("Session Expired, Login again!", { className: "toastify" });
        navigate("/Logout");
      }
    }
  };

  useEffect(() => {
    if (parseFloat(salePrice) > parseFloat(regularPrice)) {
      toast.error("Sale price cannot be greater than regular price!", { className: "toastify" });
    }
  }, [salePrice, regularPrice]);

  return (
    <form className="container-fluid p-0" onSubmit={updateProductHandler}>
      <div className="row g-3">
        <div className="col-sm-8">
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
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Other form fields */}

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
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                        placeholder=""
                        required
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
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        placeholder=""
                        required
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
                      <div className="d-flex justify-content-between flex-row gap-3 mt-5">
                        <input
                          type="radio"
                          name="subCategory"
                          value="t-shirt"
                          id="t-shirt"
                          checked={selectedSubCategory === "t-shirt"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label htmlFor="t-shirt" className="filter-btn btn btn-sm border bag w-25">
                          T-Shirt
                        </label>
                      </div>
                      <div className="d-flex justify-content-between flex-row gap-3">
                        <input
                          type="radio"
                          name="subCategory"
                          value="jeans"
                          id="jeans"
                          checked={selectedSubCategory === "jeans"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label htmlFor="jeans" className="filter-btn btn btn-sm border bag w-25">
                          Jeans
                        </label>
                      </div>
                      <div className="d-flex justify-content-between flex-row gap-3">
                        <input
                          type="radio"
                          name="subCategory"
                          value="skirts"
                          id="skirts"
                          checked={selectedSubCategory === "skirts"}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          autoComplete="off"
                          required
                        />
                        <label htmlFor="skirts" className="filter-btn btn btn-sm border bag w-25">
                          Skirts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="card container-fluid p-3 mb-3">
            <div className="card-body p-3">
              <div className="row">
                <div className="col">
                  <h2 className="card-heading text-uppercase fs-4 font-color mb-4">Featured</h2>
                  <label htmlFor="featured">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    Featured Product
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit */}
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateProduct;
