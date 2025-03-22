import { useEffect, useState } from "react";
import styles from "../../styles/home/FlashSales.module.css"; 
import FlashSalesTimer from "./FlashSalesTimer"; 
import { Product } from "../../types";
import api from "../../api";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import Button from "../global/Button"; 
import { useRef } from "react";
  
const FlashSales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -600, behavior: "smooth" });
  };
  
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };
  useEffect(() => {
    const fetchFlashProducts = async () => {
        try {
          const response = await api.get<Product[]>("/products");
          const shuffled = response.data.sort(() => 0.5 - Math.random()).slice(0, 8);
      // Ensure each product has a slug
          shuffled.forEach((p) => {
            if (!p.slug) {
              p.slug = p.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            }
          });
      
          setProducts(shuffled);
              } catch (error) {
                console.error("Error fetching flash sales products:", error);
              }
          };
      
          fetchFlashProducts();
        }, []);
        

  return (
    <section className={styles.flash_sales_section}>
      {/* Header with title and timer */}
      <div className={styles.header_row}>
        <div>
          <p className={styles.red_text}>Today's</p>
          <h2 className={styles.title}>Flash Sales</h2>
        </div>
        <FlashSalesTimer date="2025-03-25T23:59:59" />
      </div>

      {/* Arrow navigation */}
      <div className={styles.arrow_container}>
        <button className={styles.arrow_left} onClick={scrollLeft}>
          <IoChevronBack />
        </button>
        <button className={styles.arrow_right} onClick={scrollRight}>
          <IoChevronForward />
        </button>
      </div>

      {/* Product cards */}
      <div className={styles.product_container} ref={scrollRef}>
        {products.map((product) => (
           <Link
           key={product._id}
           to={`/product/${product.slug}`} // Ensure slug exists
           className={styles.product_card}
         >
            {/* Fake discount badge */}
            <span className={styles.discount_badge}>-35%</span>

            <button className={styles.wishlist_button} onClick={(e) => e.stopPropagation()}>
              <IoHeartOutline />
            </button>

            <img src={product.images[0]} alt={product.name} className={styles.product_image} />

            <h3 className={styles.product_name}>{product.name}</h3>

            {/* Price + Old Price + Rating */}
            <div className={styles.price_rating_container}>
              <div className={styles.price_block}>
                <span className={styles.product_price}>${product.price}</span>
                <span className={styles.old_price}>${(product.price / 0.65).toFixed(0)}</span>
              </div>
              <div className={styles.product_rating}>
                {[...Array(5)].map((_, i) =>
                  i < Math.floor(product.ratings) ? (
                    <FaStar key={i} color="gold" />
                  ) : (
                    <FaRegStar key={i} color="grey" />
                  )
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Button to go to All Products */}
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