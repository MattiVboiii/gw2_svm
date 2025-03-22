import { useEffect, useState } from "react";
import api from "../../api";
import styles from "../../styles/global/CategoryNavigation.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// Define types for clarity
interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface Subcategory {
  _id: string;
  name: string;
  description: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const CategoryNavigation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch both categories and subcategories concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, subcatResponse] = await Promise.all([
          api.get<Category[]>("/categories"),
          api.get<Subcategory[]>("/categories/subcategories"),
        ]);
        setCategories(catResponse.data);
        setSubcategories(subcatResponse.data);
      } catch (error: any) {
        console.error("Error fetching categories:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Toggle expand/collapse for a given category by ID
  const toggleCategory = (categoryId: string) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  // Get subcategories that belong to a given category
  const getSubcategoriesFor = (categoryId: string) => {
    return subcategories.filter((sub) => sub.category._id === categoryId);
  };

  // While loading, show a skeleton
  if (isLoading) {
    return (
      <div className={styles.skeletonContainer}>
        <div className={styles.skeletonItem} />
        <div className={styles.skeletonItem} />
        <div className={styles.skeletonItem} />
      </div>
    );
  }

  return (
    <nav className={styles.nav}>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category._id} className={styles.categoryItem}>
            <div
              className={styles.categoryHeader}
              onClick={() => toggleCategory(category._id)}
            >
              <span>{category.name}</span>
              <button className={styles.chevronButton}>
                {expanded[category._id] ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
            <ul
              className={`${styles.subcategoryList} ${
                expanded[category._id] ? styles.expanded : ""
              }`}
            >
              {getSubcategoriesFor(category._id).map((sub) => (
                <li key={sub._id} className={styles.subcategoryItem}>
                  {sub.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;
