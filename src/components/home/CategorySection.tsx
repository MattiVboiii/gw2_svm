import { 
  IoShirtOutline, 
  IoWomanOutline,  
  IoDiamondOutline, 
  IoStarOutline 
} from "react-icons/io5";
import { SlHandbag } from "react-icons/sl";
import { CiDiscount1 } from "react-icons/ci";

import styles from "../../styles/home/CategorySection.module.css";

// props
interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}
const categories = [
  { name: "All", icon: <IoStarOutline />, value: "all" },
  { name: "Men", icon: <IoShirtOutline />, value: "men's clothing" },
  { name: "Women", icon: <IoWomanOutline />, value: "women's clothing" },
  { name: "Accessories", icon: <SlHandbag />, value: "accessories" },
  { name: "Limited Edition", icon: <IoDiamondOutline />, value: "limited-edition" },
  { name: "Sale", icon: <CiDiscount1 />, value: "sale" }
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
     <div className={styles.categoryHeader}>
        <span className={styles.categoryRectangle}></span>
        <p className={styles.categoryText}>Categories</p>
      </div>
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