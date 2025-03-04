import CategorySection from '../components/home/CategorySection';
import Carousel from '../components/global/Carousel';

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
    </div>
  );
};

export default HomePage;
