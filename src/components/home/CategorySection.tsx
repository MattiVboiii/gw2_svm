import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterProducts, selectFilteredProducts } from "../../store/productsSlice";
import api from "../../api"; // Подключаем API
import styles from "../../styles/home/CategorySection.module.css";
import { IoStarOutline } from "react-icons/io5";

const CategorySection: React.FC = () => {
  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredProducts);
  const selectedCategory = filteredProducts.length > 0 ? filteredProducts[0]?.category?.name : "all";

  const [categories, setCategories] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ name: string }[]>("/categories"); // Запрашиваем категории из API
        const categoriesData = response.data.map((cat) => ({
          name: cat.name,
          value: cat.name.toLowerCase(),
        }));
        setCategories([{ name: "All", value: "all" }, ...categoriesData]); // Добавляем "All" в начало
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    dispatch(filterProducts(category)); // Фильтруем товары через Redux
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
              className={`${styles.categoryButton} ${selectedCategory === category.value ? styles.active : ""}`}
              onClick={() => handleCategoryClick(category.value)}
            >
              {category.name === "All" ? <IoStarOutline /> : null}
              {category.name}
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
