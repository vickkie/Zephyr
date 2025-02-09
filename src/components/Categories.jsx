import "./Categories.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { VITE_SERVER } = import.meta.env;

const Categories = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${VITE_SERVER}/api/admin/all-categories`, { withCredentials: true });

        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="categories-banner mt-3 w-100">
      <div className="categories-content w-100 d-flex flex-column align-items-center justify-content-center">
        <h1 className="categories-heading text-uppercase text-white">Categories</h1>
        <div className="w-100">
          <div className="row g-3 justify-content-center ">
            {Array.isArray(categories) &&
              categories.map((category) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={category._id}>
                  <div
                    className="categories-box lozad-back"
                    data-background-image={category?.categoryPic}
                    // style={{ backgroundImage: `url(${category?.categoryPic})` }}
                    onClick={() => {
                      // onSelectCategory(category);
                      navigate("/shop", {
                        state: {
                          category,
                          top: true,
                        },
                      });
                    }}
                  >
                    <div className="overlay"></div>
                    <span className="category-title">{category?.category}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
