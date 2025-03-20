import CategorySection from '../components/home/CategorySection';
// import Carousel from '../components/global/Carousel';
import Advantages from '../components/home/Advantages'; 
import ExploreProducts from '../components/home/ExploreProducts';
import Best from '../components/home/BestSelling';
const HomePage = () => {
  return (
    <div>
     
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

