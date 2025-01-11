// ProductImage.js
import React, { useState, useRef } from "react";
import { gsap } from "gsap";

const ProductImage = ({ images, initialImage }) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const animationRef = useRef(null);

  const changeImage = () => {
    const nextIndex = (images.indexOf(currentImage) + 1) % images.length;
    setCurrentImage(images[nextIndex]);
  };

  return (
    <>
      <div
        ref={animationRef}
        style={{ width: "100%", height: "auto", maxWidth: "100%", maxHeight: "auto", objectFit: "cover" }}
      >
        <img
          src={currentImage || images[0]}
          alt={`Product ${initialImage}`}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>
      <div className="additional-images">
        {images.map((img) => (
          <img
            key={img}
            src={img}
            alt={`Additional Image ${img}`}
            onClick={changeImage}
            style={{ width: "40px", height: "40px", margin: "10px", cursor: "pointer" }}
          />
        ))}
      </div>
    </>
  );
};

export default ProductImage;
