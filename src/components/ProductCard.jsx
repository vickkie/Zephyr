/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import BagContext from "../contexts/BagContext";
import Lazyload from "../utils/lazyload";

const defaultImg = "https://source.unsplash.com/random/500x500/?man,fashion,cloth,placeholder";

const ProductCard = ({ id, productName, regularPrice, salePrice, image, images = [], status, height }) => {
  const { addToBag } = useContext(BagContext);

  const [mainImg, setMainImg] = useState(image);
  const [hoverImg, setHoverImg] = useState(images[0] || image);

  // Lazyload initialization
  Lazyload();

  const item = {
    id,
    productName,
    image,
    salePrice,
    quantity: 1,
    images,
  };

  const handleMouseEnter = () => {
    if (images.length > 0) {
      setMainImg(hoverImg);
    }
  };

  const handleMouseLeave = () => {
    setMainImg(image);
  };

  return (
    <div
      className="card product-card position-relative p-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: height ? height : "" }}
    >
      {/* Image & Overlay */}
      <Link to={`/product/${id}`} className="product-link d-block position-relative overflow-hidden">
        <div className="image-container position-relative w-100 h-100">
          <img
            className={`lozad object-fit-cover w-100 h-100 ${status === "Sold" ? "sold-out-image" : ""}`}
            src={mainImg}
            alt="product"
          />
          {images.length > 0 && (
            <img
              className="lozad object-fit-cover w-100 h-100 position-absolute transition-opacity"
              data-src={hoverImg}
              alt="product-hover"
              style={{ opacity: mainImg === hoverImg ? 1 : 0, transition: "opacity 0.5s ease" }}
            />
          )}
          {/* Sold Out Badge */}
          {status === "Sold" && <span className="sold-out-badge">Sold Out</span>}
        </div>
      </Link>

      {/* Product Info */}
      <div className="container-fluid p-3 pb-0">
        <div className="row">
          <div className="col-12">
            <h2 className="card-heading font-color text-uppercase fs-4">{productName}</h2>
          </div>
          <div className="row col-lg-12 col-md-12 col-sm-12 p-2 py-1">
            <p className="product-card-price font-color m-0">
              KES {salePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="col-12">
            {/* Disable Add to Bag if Sold */}
            <button
              onClick={() => addToBag(item)}
              className={`btn  add-cart-btn fw-medium p-1 px-3 pe-2 ${status === "Sold" ? "soldout" : "available"}`}
              disabled={status === "Sold"}
              style={{ opacity: status === "Sold" ? 0.5 : 1, cursor: status === "Sold" ? "not-allowed" : "pointer" }}
            >
              <span className="fas mx-1 fs-5">&#xf290;</span>
              <span className={`pe-2 px-2 ${status === "Sold" ? "soldout" : "available"}`}>
                {status === "Sold" ? "Unavailable" : "Add to bag"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
