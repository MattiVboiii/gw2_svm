import { FaTshirt, FaFemale, FaHatCowboy, FaShoePrints, FaStar } from "react-icons/fa";

// props
interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
}
const categories = [
    { name: "All", icon: <FaStar />, value: "all" },
    { name: "Men", icon: <FaTshirt />, value: "men's clothing" },
    { name: "Women", icon: <FaFemale />, value: "women's clothing" },
    { name: "Accessories", icon: <FaHatCowboy />, value: "accessories" },
    { name: "Limited Edition", icon: <FaShoePrints />, value: "limited-edition" }
  ];

const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect }) => {
    const handleCategoryClick = (category: string) => {
    console.log(`Category clicked: ${category}`); // log the selected category. TODO: Remove console.log after integrating with AllProducts.tsx
    onCategorySelect(category);
  };
  // fixing the error in the console. TODO: Remove console.log after integrating with AllProducts.tsx
console.log(handleCategoryClick);
      
    return (
      <section>
        <h2>Browse By Category</h2>
        <div>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategorySelect(category.value)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </section>
    );
  };
  
  
  export default CategorySection;