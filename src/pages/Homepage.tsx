import CategorySection from '../components/home/CategorySection';
import Carousel from '../components/global/Carousel';
import Advantages from '../components/home/Advantages';
const HomePage = () => {
  return (
    <div>
      {/* TODO: Pass selectedCategory to AllProducts.tsx once filtering is implemented */}
      <CategorySection
        onCategorySelect={(category) =>
          console.log(`Selected category: ${category}`)
        }
      />
      <Carousel />
      <Advantages />
    </div>
  );
};

export default HomePage;
