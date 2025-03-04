import CategorySection from '../components/home/CategorySection';
import CarouselSlider from '../components/global/Carousel';

const HomePage = () => {
  return (
    <div>
      {/* TODO: Pass selectedCategory to AllProducts.tsx once filtering is implemented */}
      <CategorySection
        onCategorySelect={(category) =>
          console.log(`Selected category: ${category}`)
        }
      />
      <CarouselSlider />
    </div>
  );
};

export default HomePage;
