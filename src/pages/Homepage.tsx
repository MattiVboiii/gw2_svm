import CategorySection from '../components/home/CategorySection';
// import Carousel from '../components/global/Carousel';
import Advantages from '../components/home/Advantages';
import AllProducts from '../pages/AllProducts'; 

const HomePage = () => {
  return (
    <div>
     
      <CategorySection />
{/*      
      <Carousel />  */}
     
      <AllProducts />
     
      <Advantages />
    </div>
  );
};

export default HomePage;

