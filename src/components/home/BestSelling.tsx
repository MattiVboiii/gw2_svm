import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectBestSelling } from "../../store/productsSlice";
import ProductCard from "../global/ProductCard";
import Button from "../global/Button";
import styles from "../../styles/home/BestSelling.module.css";
import { RootState } from "../../store";
import { Product } from "../../types";
import { IoChevronForward } from "react-icons/io5";

const BestSelling = () => {
  const bestSelling = useSelector((state: RootState) => selectBestSelling(state));
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const displayedProducts = showAll ? bestSelling : bestSelling.slice(0, 4);

  const handleViewAll = () => {
    setShowAll((prev) => !prev);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  return (
    <section className={styles.best_selling_section}>
      {/* Section Header */}
      <div className={styles.header_container}>
        <div className={styles.section_header}>
          <span className={styles.red_rectangle}></span>
          <p className={styles.section_text}>This Month</p>
        </div>
        <div className={styles.section_title_container}>
          <h2 className={styles.section_title}>Best Selling Products</h2>
          <Button
            variant="primary"
            size="large"
            className={styles.view_all_button}
            onClick={handleViewAll}
          >
            {showAll ? "Show Less" : "View All"}
          </Button>
        </div>
      </div>

      {/* Product Cards */}
      <div className={styles.product_container} ref={scrollRef}>
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product: Product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              slug={product.slug}
              name={product.name}
              images={product.images}
              price={product.price}
              ratings={product.ratings}
              discountPercentage={20} // Best Selling products get -20%
              showAddToCart
            />
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {/* Arrow appears only in View All mode */}
      {showAll && (
        <div className={styles.arrow_container}>
          <button type="button" className={styles.arrow_right} onClick={scrollRight}>
            <IoChevronForward />
          </button>
        </div>
      )}
    </section>
  );
};

export default BestSelling;
