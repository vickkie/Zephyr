// import { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import BagContext from "../contexts/BagContext";
// import Lazyload from "../utils/lazyload";

// const ProductCard = ({ id, productName, regularPrice, salePrice, image, images = [] }) => {
//   const { addToBag } = useContext(BagContext);

//   const [mainImg, setMainImg] = useState(image);

//   // Lazyload initialization
//   Lazyload();

//   const item = {
//     id,
//     productName,
//     image,
//     salePrice,
//     quantity: 1,
//     images,
//   };

//   useEffect(() => {
//     let interval;

//     console.log(images.length);
//     if (images.length > 0) {
//       const changeImageInterval = () => {
//         let index = 0;
//         interval = setInterval(() => {
//           setMainImg((prev) => {
//             const nextIndex = (index + 1) % images.length;
//             index = nextIndex;
//             return images[nextIndex];
//           });
//         }, 1000); // Change image every 1 second
//       };
//       changeImageInterval(); // Start the image change interval

//       // Cleanup the interval on component unmount or when the images change
//       return () => clearInterval(interval);
//     }
//   }, [images]); // Run effect when `images` change

//   const handleMouseEnter = () => {
//     if (images.length > 1) {
//       setMainImg(images[0]); // Start with the first image when hovering
//     }
//   };

//   const handleMouseLeave = () => {
//     setMainImg(image); // Reset to main image when mouse leaves
//   };

//   return (
//     <div className="card product-card position-relative p-2">
//       <Link to={`/product/${id}`} className="product-link d-block position-relative overflow-hidden">
//         <div
//           className="image-container position-relative w-100 h-100"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           {images.length > 1 ? (
//             images.map((img, index) => (
//               <img
//                 key={index}
//                 className={`lozad object-fit-cover w-100 h-100 position-absolute transition-opacity`}
//                 src={img}
//                 alt={`product-${index}`}
//                 style={{
//                   opacity: mainImg === img ? 1 : 0, // Only show the active image
//                   transition: "opacity 0.5s ease",
//                 }}
//               />
//             ))
//           ) : (
//             <img
//               className="lozad object-fit-cover w-100 h-100"
//               src={mainImg}
//               alt="product"
//               style={{ transition: "opacity 0.5s ease" }}
//             />
//           )}
//         </div>
//       </Link>
//       <div className="container-fluid p-3 pb-0">
//         <div className="row">
//           <div className="col-8">
//             <h2 className="card-heading font-color text-uppercase fs-4">{productName}</h2>
//             <Link onClick={() => addToBag(item)} className="btn add-cart-btn fw-medium p-1 px-3">
//               <span className="fas mx-1 fs-5">&#xf290;</span> <span className="pe-2">Add to bag</span>
//             </Link>
//           </div>
//           <div className="col-4">
//             <p className="product-card-price font-color m-0">KES {salePrice.toFixed(2)}</p>
//             <p className="product-card-price striked m-0">KES {regularPrice.toFixed(2)}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import BagContext from "../contexts/BagContext";
import Lazyload from "../utils/lazyload";

const defaultImg = "https://source.unsplash.com/random/500x500/?man,fashion,cloth,placeholder";

const ProductCard = ({ id, productName, regularPrice, salePrice, image, images = [], status }) => {
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
              src={hoverImg}
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
            <p className="product-card-price font-color m-0">KES {salePrice.toFixed(2)}</p>
          </div>
          <div className="col-12">
            {/* Disable Add to Bag if Sold */}
            <button
              onClick={() => addToBag(item)}
              className="btn add-cart-btn fw-medium p-1 px-3"
              disabled={status === "Sold"}
              style={{ opacity: status === "Sold" ? 0.5 : 1, cursor: status === "Sold" ? "not-allowed" : "pointer" }}
            >
              <span className="fas mx-1 fs-5">&#xf290;</span>
              <span className="pe-2">{status === "Sold" ? "Unavailable" : "Add to bag"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
