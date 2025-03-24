import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { filterProducts } from "../../store/productsSlice";
import api from "../../api";
import styles from "../../styles/home/CategorySection.module.css";
import { IoStarOutline } from "react-icons/io5";
import { GiClothes, GiDress, GiBelt } from "react-icons/gi";
import { FaTags } from "react-icons/fa";

const CategorySection: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const categoryFromURL = params.get("category");

  // Local state for all categories fetched from the API
  const [categories, setCategories] = useState<{ name: string; value: string }[]>([]);

  // Track the currently selected category
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    // Update activeCategory when URL changes
    setActiveCategory(categoryFromURL || "");
  }, [categoryFromURL]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ name: string }[]>("/categories");

        const slugify = (str: string) =>
          str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const categoriesData = response.data.map((cat) => ({
          name: cat.name,
          value: slugify(cat.name),
        }));

        setCategories([{ name: "All", value: "all" }, ...categoriesData]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // When a category is clicked
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category); // Update local active category
    dispatch(
      filterProducts(
        category === "all"
          ? { type: "category", value: "" }
          : { type: "category", value: category }
      )
    );
    navigate(`/allproducts?category=${category}`);
  };

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryRectangle}></span>
        <p className={styles.categoryText}>Categories</p>
      </div>

      <h2 className={styles.categoryTitle}>Browse By Category</h2>

      <div className={styles.categoryContainer}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.value}
              className={`${styles.categoryButton} ${
                activeCategory === category.value ? styles.active : ""
              }`}
              onClick={() => handleCategoryClick(category.value)}
            >
               {category.name === "All" && <IoStarOutline className={styles.categoryIcon} />}
              {category.name === "Men's Fashion" && <GiClothes className={styles.categoryIcon} />}
              {category.name === "Women's Fashion" && <GiDress className={styles.categoryIcon} />}
              {category.name === "Accessories" && <GiBelt className={styles.categoryIcon} />}
              {category.name === "Sale" && <FaTags className={styles.categoryIcon} />}
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
