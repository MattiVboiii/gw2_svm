import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import styles from "../../styles/global/CategoryNavigation.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// Define types
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
  const navigate = useNavigate();

  // Fetch categories and subcategories concurrently
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

  // Toggle expand/collapse for a given category by its ID
  const toggleCategory = (categoryId: string) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  // Get subcategories for a given category
  const getSubcategoriesFor = (categoryId: string) => {
    return subcategories.filter((sub) => sub.category._id === categoryId);
  };

  // Navigate to AllProducts with filter set to the category name (if no subcategories exist)
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/allproducts?category=${encodeURIComponent(categoryName)}`);
  };

  // Navigate to AllProducts with filter set to the subcategory name
  const handleSubcategoryClick = (
    subName: string,
    parentCategoryName: string
  ) => {
    navigate(
      `/allproducts?subcategory=${encodeURIComponent(
        subName
      )}&category=${encodeURIComponent(parentCategoryName)}`
    );
  };

  // While loading, show skeleton loader
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
        {categories.map((category) => {
          const subs = getSubcategoriesFor(category._id);
          return (
            <li key={category._id} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <span
                  onClick={() => {
                    if (subs.length === 0) {
                      handleCategoryClick(category.name);
                    } else {
                      toggleCategory(category._id);
                    }
                  }}
                >
                  {category.name}
                </span>
                {subs.length > 0 && (
                  <button
                    className={styles.chevronButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when toggling
                      toggleCategory(category._id);
                    }}
                  >
                    {expanded[category._id] ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>
                )}
              </div>
              {subs.length > 0 && (
                <ul
                  className={`${styles.subcategoryList} ${
                    expanded[category._id] ? styles.expanded : ""
                  }`}
                >
                  {subs.map((sub) => (
                    <li
                      key={sub._id}
                      className={styles.subcategoryItem}
                      onClick={() =>
                        handleSubcategoryClick(sub.name, sub.category.name)
                      }
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;
