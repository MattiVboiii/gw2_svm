import CategorySection from "../components/home/CategorySection";

const HomePage = () => {
  return (
    <div>
       {/* TODO: Pass selectedCategory to AllProducts.tsx once filtering is implemented */}
      <CategorySection onCategorySelect={(category) => console.log(`Selected category: ${category}`)} />
    </div>
  );
};

export default HomePage;
