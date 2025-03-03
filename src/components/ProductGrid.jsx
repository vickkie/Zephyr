import ProductCard from "./ProductCard";

const ProductGrid = (props) => {
  // console.log(props.products);

  return (
    <section className="product-grid container-fluid p-0">
      <div className="row g-1">
        {props.products.length > 0 ? (
          props.products.map((product) => (
            <div className="col-lg-3 col-md-4 col-sm-12" key={product._id}>
              <ProductCard
                id={product._id}
                productName={product?.productName}
                regularPrice={product?.regularPrice}
                salePrice={product?.salePrice}
                image={product?.image}
                images={product?.images}
                status={product?.status}
              />
            </div>
          ))
        ) : (
          <div className="text-center fs-3 mb-5">No Products Found!</div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
