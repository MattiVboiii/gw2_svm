import CategorySection from '../components/home/CategorySection';
// import Carousel from '../components/global/Carousel';
import Advantages from '../components/home/Advantages'; 
import ExploreProducts from '../components/home/ExploreProducts';
import Best from '../components/home/BestSelling';
import FlashSales from '../components/home/FlashSales';
const HomePage = () => {
  return (
    <div>
     <FlashSales />
      <CategorySection />
<Best />
{/*      
      <Carousel />  */}
     
     <ExploreProducts />
     
      <Advantages />
    </div>
  );
};

export default HomePage;

