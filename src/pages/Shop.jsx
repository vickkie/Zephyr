import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Footer, Header, PageTitle, ProductGrid } from "../components";
import { toast } from "react-toastify";

const { VITE_SERVER } = import.meta.env;

const Shop = ({ category: initialCategory, subCategory: initialSubCategory }) => {
  const location = useLocation();
  const navCategory = location.state?.category; // Get category from navigation state
  const top = location.state?.top;
  // console.log(top);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(navCategory?.category || initialCategory || "all");
  const [subCategory, setSubCategory] = useState(initialSubCategory || "");

  /** Fetch all available categories **/
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/admin/all-categories`, {
        withCredentials: true,
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories", { className: "toastify" });
    }
  };

  /** Fetch all products **/
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${VITE_SERVER}/api/all-products`, {
        withCredentials: true,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products", { className: "toastify" });
    } finally {
      setLoading(false);
    }
  };

  /** Fetch products by category & subcategory **/
  const fetchProductsByCategory = async (category, subCategory) => {
    setLoading(true);
    try {
      const response = await axios.get(`${VITE_SERVER}/api/category/${category}/${subCategory}`, {
        withCredentials: true,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products", { className: "toastify" });
    } finally {
      setLoading(false);
    }
  };

  /** Initial Data Fetch **/
  useEffect(() => {
    fetchCategories();

    if (category === "all") {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(category, subCategory);
    }
  }, [category, subCategory]);

  useEffect(() => {
    if (top) {
      window.scrollTo(0, 0);
    }
  }, [location, top]);

  return (
    <>
      <Header />
      <div className="col d-flex justify-content-between align-items-center">
        <PageTitle title={`Shop / ${category} - ${subCategory || ""}`} />
        <div className="  mt-3">
          <select className="font-color login-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option className="color-black" value="all">
              All Categories
            </option>
            {categories.map((cat) => (
              <option className="color-black" key={cat._id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Dropdown */}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100 w-100">
          <span className="spinner-grow spinner-grow bag" aria-hidden="true"></span>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      <Footer />
    </>
  );
};

export default Shop;
