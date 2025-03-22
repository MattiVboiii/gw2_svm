import { useEffect, useState } from "react";
import styles from "../../styles/home/FlashSales.module.css"; 
import FlashSalesTimer from "./FlashSalesTimer"; 
import { Product } from "../../types";
import api from "../../api";
import { Link } from "react-router-dom";
import { IoHeartOutline } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import Button from "../global/Button"; 

const FlashSales = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFlashProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        const shuffled = response.data.sort(() => 0.5 - Math.random()).slice(0, 8);
        setProducts(shuffled);
      } catch (error) {
        console.error("Error fetching flash sales products:", error);
      }
    };

    fetchFlashProducts();
  }, []);

  return (
    <section className={styles.flash_sales_section}>
      {/* Header with timer */}
      <div className={styles.header_row}>
        <div>
          <p className={styles.red_text}>Today's</p>
          <h2 className={styles.title}>Flash Sales</h2>
        </div>
        <FlashSalesTimer date="2025-03-25T23:59:59" />
      </div>

      {/* Product list */}
      <div className={styles.product_container}>
        {products.map((product) => (
          <Link to={`/product/${product.slug}`} key={product._id} className={styles.product_card}>
            <button className={styles.wishlist_button} onClick={(e) => e.stopPropagation()}>
              <IoHeartOutline />
            </button>
            <img src={product.images[0]} alt={product.name} className={styles.product_image} />
            <h3 className={styles.product_name}>{product.name}</h3>
            <p className={styles.product_price}>${product.price}</p>
            <div className={styles.product_rating}>
              {[...Array(5)].map((_, i) =>
                i < Math.floor(product.ratings) ? (
                  <FaStar key={i} color="gold" />
                ) : (
                  <FaRegStar key={i} color="grey" />
                )
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* View All Products Button */}
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
