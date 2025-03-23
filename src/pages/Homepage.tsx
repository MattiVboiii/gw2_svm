import { useEffect } from "react";             
import { useDispatch } from "react-redux";
import type { RootState } from "../store";
import type { Action } from "redux";
import type { ThunkDispatch } from "redux-thunk";
import { fetchProducts } from "../store/productsSlice"; // new action to fetch products
import CategoryNavigation from "../components/global/CategoryNavigation";
import CategorySection from "../components/home/CategorySection";
// import Carousel from '../components/global/Carousel';
import Advantages from "../components/home/Advantages";
import ExploreProducts from "../components/home/ExploreProducts";
import Best from "../components/home/BestSelling";
import FlashSales from "../components/home/FlashSales";
import styles from "../styles/pages/Homepage.module.css"; // new CSS module for layout
import HeroSection from "../components/home/HeroSection";
import NewArrivals from "../components/home/NewArrivals";
const HomePage = () => {
  const dispatch: ThunkDispatch<RootState, undefined, Action> = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts()); // Dispatch the action
  }, [dispatch]);
  return (
    <div className={styles.homeContainer}>
     <div className={styles.sidebarContainer}>
    <div className={styles.navContainer}>
    <CategoryNavigation />
    </div>
    <div className={styles.banner}>
    <HeroSection />
   </div>
    </div>
      <main className={styles.mainContent}>
        <FlashSales />
        <CategorySection />
        <Best />
        <ExploreProducts />
        <NewArrivals />
        <Advantages />
      </main>
    </div>
  );
};

export default HomePage;
