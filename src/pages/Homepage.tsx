import CategorySection from '../components/home/CategorySection';
// import Carousel from '../components/global/Carousel';
import Advantages from '../components/home/Advantages'; 
import ExploreProducts from '../components/home/ExploreProducts';
const HomePage = () => {
  return (
    <div>
     
      <CategorySection />
{/*      
      <Carousel />  */}
     
     <ExploreProducts />
     
      <Advantages />
    </div>
  );
};

export default HomePage;

