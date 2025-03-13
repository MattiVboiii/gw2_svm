import { FaTshirt, FaFemale, FaHatCowboy, FaShoePrints, FaStar } from "react-icons/fa";
import styles from "./categorySection.module.css";

// props
interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}
const categories = [
    { name: "All", icon: <FaStar />, value: "all" },
    { name: "Men", icon: <FaTshirt />, value: "men's clothing" },
    { name: "Women", icon: <FaFemale />, value: "women's clothing" },
    { name: "Accessories", icon: <FaHatCowboy />, value: "accessories" },
    { name: "Limited Edition", icon: <FaShoePrints />, value: "limited-edition" }
  ];

const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect, selectedCategory }) => {
    const handleCategoryClick = (category: string) => {
    console.log(`Category clicked: ${category}`); // log the selected category. TODO: Remove console.log after integrating with AllProducts.tsx
    onCategorySelect(category);
  };
  // fixing the error in the console. TODO: Remove console.log after integrating with AllProducts.tsx
console.log(handleCategoryClick);
      
return (
  <section className={styles.categorySection}>
    <h2 className={styles.categoryTitle}>Browse By Category</h2>
    <div className={styles.categoryContainer}>
      {categories.map((category) => (
        <button
          key={category.value}
          className={`${styles.categoryButton} ${selectedCategory === category.value ? styles.active : ""}`}
          onClick={() => onCategorySelect(category.value)}
        >
          <span className={styles.categoryIcon}>{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  </section>
);

  };
  
  
  export default CategorySection;