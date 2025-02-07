import axios, { all } from "axios";
import { useContext, useEffect, useState } from "react";
import { Footer, Header } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import BagContext from "../contexts/BagContext";
import { toast } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// import "swiper/css/navigation";
// import "swiper/swiper-bundle.css";

import "swiper/css";

const { VITE_SERVER } = import.meta.env;
const defaultImg = "https://source.unsplash.com/random/500x500/?man,fashion,cloth,placeholder";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { addToBag } = useContext(BagContext);

  const [product, setProduct] = useState({});
  const [allImages, setAllImages] = useState([""]);
  const [quantity, setQuantity] = useState(1);

  let { id } = useParams();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/product/${id}`, {
        withCredentials: true,
      });
      // console.log("product", response);
      // setAllImages(response.data.product.image, response.data.product.image);
      response ? setProduct({ ...response.data.product }) : navigate("/404");

      let gottenFirst = [];

      gottenFirst = [response.data.product?.image];
      // console.log("gottenFirst", gottenFirst);

      const allImgs = [gottenFirst.flat(), response.data.product?.images.flat()].flat();

      // console.log("allImgs", allImgs);

      const finalImgs = allImgs.filter(removedef);

      // console.log("finalImgs", finalImgs);

      // const finalMain = console.log(finalImgs[0]);

      // console.log("finalMain", finalMain);

      if (gottenFirst.includes(defaultImg, 0) && allImgs.length <= 1) {
        toast.error("You must have atleast 1 image!", { className: "toastify" });
        // console.log("CANNOT CONTINUE");
        setAllImages([gottenFirst]);
      } else {
        setAllImages(finalImgs);
      }
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

  function removedef(def) {
    return def !== defaultImg;
  }

  const updateBag = (e) => {
    e.preventDefault();
    const item = {
      id: product._id,
      productName: product.productName,
      image: product.image,
      salePrice: product.salePrice,
      quantity,
    };
    addToBag(item);
  };

  const Navigation = () => {
    return (
      <>
        <div className="swiper-button-prev">
          <svg width="40" height="40" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M40.9468 81.1677C43.4644 79.3981 43.6063 75.6764 41.231 73.7151L10.1383 48.0405C7.70667 46.0326 9.07604 42.0574 12.2125 42.0444C20.7849 42.0084 32.3452 42.0757 41.1557 42.5558C52.749 43.1877 68.9778 45.0466 77.0435 46.0235C79.6777 46.3426 81.9999 44.2599 82 41.5712C82.0001 38.9316 79.7617 36.8651 77.1686 37.1091C69.1429 37.8649 52.796 39.3153 41.1557 39.7581C32.3352 40.0934 20.7694 40.0577 12.1977 39.9589C9.07082 39.9227 7.71928 35.957 10.1437 33.9551L41.231 8.28509C43.6063 6.32354 43.4644 2.60187 40.9468 0.83226C38.903 -0.604202 36.1033 -0.136269 34.6232 1.88926L21.848 19.3689C18.232 24.3166 13.9817 28.7535 9.20903 32.563L0.829079 39.2599C-0.275604 40.1426 -0.276482 41.8394 0.827118 42.7235L9.20903 49.437C13.9817 53.2465 18.232 57.6836 21.848 62.6311L34.6232 80.1108C36.1033 82.1362 38.903 82.6042 40.9468 81.1677Z"
              fill="#000"
            />
          </svg>
        </div>
        <div className="swiper-button-next">
          <svg width="40" height="40" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M40.9468 81.1677C43.4644 79.3981 43.6063 75.6764 41.231 73.7151L10.1383 48.0405C7.70667 46.0326 9.07604 42.0574 12.2125 42.0444C20.7849 42.0084 32.3452 42.0757 41.1557 42.5558C52.749 43.1877 68.9778 45.0466 77.0435 46.0235C79.6777 46.3426 81.9999 44.2599 82 41.5712C82.0001 38.9316 79.7617 36.8651 77.1686 37.1091C69.1429 37.8649 52.796 39.3153 41.1557 39.7581C32.3352 40.0934 20.7694 40.0577 12.1977 39.9589C9.07082 39.9227 7.71928 35.957 10.1437 33.9551L41.231 8.28509C43.6063 6.32354 43.4644 2.60187 40.9468 0.83226C38.903 -0.604202 36.1033 -0.136269 34.6232 1.88926L21.848 19.3689C18.232 24.3166 13.9817 28.7535 9.20903 32.563L0.829079 39.2599C-0.275604 40.1426 -0.276482 41.8394 0.827118 42.7235L9.20903 49.437C13.9817 53.2465 18.232 57.6836 21.848 62.6311L34.6232 80.1108C36.1033 82.1362 38.903 82.6042 40.9468 81.1677Z"
              fill="#000"
            />
          </svg>
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <main className="container-fluid mt-3 p-0 position-relative">
        <div className="row g-3 ">
          {/* Image Slider Section */}
          <div className="col-lg-6">
            {allImages.length >= 1 && (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                // navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                className="product-images-slider"
              >
                {allImages?.map((imagex, index) => (
                  <SwiperSlide key={index}>
                    <div className="position-relative overflow-hidden h-100">
                      <div className="image-backdrop-m position-absolute top-0 bottom-0 start-0 end-0 opacity-50"></div>
                      <img
                        className="product-image object-fit-cover w-100 h-100"
                        src={imagex}
                        alt={`product image ${index + 1}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Details Section */}
          <div className="col-lg-6">
            <div className="card singlep container-fluid h-auto p-lg-4 position-sticky top-0">
              <div className="card-body p-lg-4">
                <div className="row">
                  <div className="col">
                    <h1 className="title-prod text-uppercase font-color my-2">{product.productName}</h1>

                    <div className="mb-1">
                      <p className="banner-paragragh fs-6 fw-medium font-color font-mid">{product.shortDescription}</p>
                    </div>

                    <p className="product-card-price text-uppercase font-color mb-0">
                      <span className="product-card-price font-color me-2">KES {product.salePrice?.toFixed(2)} </span>
                      <span className="product-card-price striked ms-2">KES {product.regularPrice?.toFixed(2)} </span>
                    </p>

                    <form className="contact-form my-5">
                      <div className="d-flex align-items-center w-100 my-4">
                        <button
                          type="button"
                          disabled={quantity === 1}
                          onClick={() => setQuantity(quantity - 1)}
                          className="btn btn-sm bag text-decoration-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-minus"
                          >
                            <path d="M5 12h14"></path>
                          </svg>
                        </button>

                        <input
                          className="login-input text-center font-color mx-3"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          style={{
                            minHeight: 2.9 + "rem",
                            padding: 0.5 + "rem",
                            maxWidth: 4 + "rem",
                          }}
                          min={1}
                          type="number"
                          name="quantity"
                          id="quantity"
                        />

                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="btn btn-sm bag text-decoration-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-plus"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                        </button>
                      </div>

                      <button
                        type="submit"
                        onClick={updateBag}
                        className="btn text-uppercase d-block my-2 py-3 w-100 fw-bold"
                        disabled={product.status === "Sold"}
                        style={{
                          backgroundColor: product.status === "Sold" ? "gray" : "",
                          cursor: product.status === "Sold" ? "not-allowed" : "",
                        }}
                      >
                        {product.status === "Sold" ? "Sold Out" : "Add to Bag"}
                      </button>
                    </form>

                    <div className="">
                      <p className="banner-paragragh fs-6 fw-medium font-color">{product.longDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SingleProduct;
