// import Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import "swiper/css";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const { VITE_SERVER } = import.meta.env;

const LatestProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/products/hqall?page=1&limit=10&sortOrder="desc"`, {
        withCredentials: true,
      });
      // console.log("featured-products", response.data);
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      error.message ? toast.error(error.message, { className: "toastify" }) : null;
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const breakpoints = {
    // when window width is >= 220px
    220: {
      slidesPerView: 1,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
    },
    // when window width is >= 720px
    720: {
      slidesPerView: 3,
    },
    // when window width is >= 1024px
    1024: {
      slidesPerView: 4,
    },
  };
  return (
    <section className="slider mt-3">
      <div className="headeruzi col justify-content-between d-flex">
        <h2 className="font-color text-uppercase fs-1 m-5">NEW ARRIVALS</h2>
        <div className="d-flex decoline-wrapper">
          <div className="decoline"></div>
        </div>
      </div>
      <Swiper
        modules={[Autoplay, A11y]}
        spaceBetween={16}
        slidesPerView={3}
        autoplay
        breakpoints={breakpoints}
        // onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {products?.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              id={product._id}
              productName={product.productName}
              regularPrice={product.regularPrice}
              salePrice={product.salePrice}
              image={product.images[0]}
              status={product?.status}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LatestProducts;
