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
          {/* Banner content goes here */}
          <img
            src="https://assets.vogue.com/photos/60759c5567b33f7d0591c58a/16:9/w_4543,h_2555,c_limit/VO0420_CoverStory_17.jpg"
            alt="Banner"
            style={{ maxWidth: "892px", width: "100%", height: "auto" }}
          />
        </div>
      </div>
      <main className={styles.mainContent}>
        <FlashSales />
        <CategorySection />
        <Best />
        {/*
          <Carousel /> 
        */}
        <ExploreProducts />
        <Advantages />
      </main>
    </div>
  );
};

export default HomePage;
