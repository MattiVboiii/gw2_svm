import { useRef } from "react";
import styles from "../../styles/home/FlashSales.module.css";
import FlashSalesTimer from "./FlashSalesTimer";
import { useSelector } from "react-redux";
import { selectFlashSales } from "../../store/productsSlice";
import ProductCard from "../global/ProductCard";
import Button from "../global/Button";
import { RootState } from "../../store";
import { Product } from "../../types";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const FlashSales = () => {
  const flashSales = useSelector((state: RootState) => selectFlashSales(state));
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll left by fixed amount
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -600, behavior: "smooth" });
  };

  // Scroll right by fixed amount
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  return (
    <section className={styles.flash_sales_section}>
      {/* Header with section name and countdown timer */}
      <div className={styles.header_container}>
        <div className={styles.section_header}>
          <span className={styles.red_rectangle}></span>
          <p className={styles.section_text}>Today's</p>
        </div>
        <div className={styles.section_title_container}>
          <h2 className={styles.section_title}>Flash Sales</h2>
          <div className={styles.flash_timer_arrow}>
            <FlashSalesTimer date="2025-03-25T23:59:59" />
            <div className={styles.arrow_container}>
              <button
                type="button"
                className={styles.arrow_left}
                onClick={scrollLeft}
              >
                <IoChevronBack />
              </button>
              <button
                type="button"
                className={styles.arrow_right}
                onClick={scrollRight}
              >
                <IoChevronForward />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sales product cards (horizontal scroll) */}
      <div className={styles.product_container} ref={scrollRef}>
        {flashSales.map((product: Product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            slug={product.slug}
            name={product.name}
            images={product.images}
            price={product.price}
            ratings={product.ratings}
            discountPercentage={35} // Flash Sales have fixed 35% discount
            showAddToCart
          />
        ))}
      </div>

      {/* Link to all products */}
      <Button
        variant="primary"
        size="large"
        className={styles.view_all_button}
        onClick={() => (window.location.href = "/allproducts")}
      >
        View All Products
      </Button>
    </section>
  );
};

export default FlashSales;
