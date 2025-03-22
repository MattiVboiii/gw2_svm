import { useEffect, useState, useRef } from "react";
import styles from "../../styles/home/FlashSales.module.css";
import FlashSalesTimer from "./FlashSalesTimer";
import { Product } from "../../types";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import Button from "../global/Button";

const FlashSales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
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
        const shuffled = response.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);

        // Ensure slug exists
        shuffled.forEach((p) => {
          if (!p.slug) {
            p.slug = p.name
              .toLowerCase()
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
      {/*  Header row with title and countdown */}
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
              <button className={styles.arrow_left} onClick={scrollLeft}>
                <IoChevronBack />
              </button>
              <button className={styles.arrow_right} onClick={scrollRight}>
                <IoChevronForward />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Product Cards */}
      <div className={styles.product_container} ref={scrollRef}>
        {products.map((product) => (
          <Link
            key={product._id}
            // Use product.slug if available, otherwise generate one, then append the unique product ID
            to={`/product/${
              product.slug ||
              product.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
            }-${product._id}`}
            className={styles.product_card}
          >
            {/* Fake Discount */}
            <span className={styles.discount_badge}>-35%</span>

            {/* Wishlist */}
            <button
              className={styles.wishlist_button}
              onClick={(e) => e.stopPropagation()}
            >
              <IoHeartOutline />
            </button>

            {/* Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              className={styles.product_image}
            />

            {/*  Name */}
            <h3 className={styles.product_name}>{product.name}</h3>

            {/*  Prices */}
            <div className={styles.price_block}>
              <span className={styles.product_price}>${product.price}</span>
              <span className={styles.old_price}>
                ${(product.price / 0.65).toFixed(0)}
              </span>
            </div>

            {/*  Rating */}
            <div className={styles.product_rating}>
              {[...Array(5)].map((_, i) =>
                i < Math.floor(product.ratings) ? (
                  <FaStar key={i} color="gold" />
                ) : (
                  <FaRegStar key={i} color="grey" />
                )
              )}
            </div>

            {/*  Reused Add to Cart Button */}
            <Button
              variant="primary"
              size="small"
              className={styles.add_to_cart}
              // Also update the navigate() call to include the product id
              onClick={() =>
                navigate(
                  `/product/${
                    product.slug ||
                    product.name
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  }-${product._id}`
                )
              }
            >
              Add To Cart
            </Button>
          </Link>
        ))}
      </div>

      {/* View All Button */}
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
