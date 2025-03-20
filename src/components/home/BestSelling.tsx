import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import api from "../../api"; // Import API client
import Button from "../global/Button"; // Import global Button component
import styles from "../../styles/home/BestSelling.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type
import { IoHeartOutline } from "react-icons/io5"; // Icon for wishlist

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await api.get<Product[]>("/products"); // Fetch products
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8)); // Store 8 best-sellers
        setDisplayedProducts(shuffled.slice(0, 4)); // Initially show only 4 products
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
      }
    };

    fetchBestSelling();
  }, []);

  const handleViewAll = () => {
    if (!showAll) {
      setDisplayedProducts(products); // Show all 8 products
    } else {
      setDisplayedProducts(products.slice(0, 4)); // Collapse back to 4
    }
    setShowAll((prev) => !prev);
  };

  return (
    <section className={styles.best_selling_section}>
      {/* Section Header */}
      <div className={styles.header_container}>
        <div className={styles.section_header}>
          <span className={styles.red_rectangle}></span>
          <p className={styles.section_text}>This Month</p>
        </div>
        <h2 className={styles.section_title}>Best Selling Products</h2>
      </div>

      {/* Product List */}
      <div className={styles.product_container}>
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`} // Link to product detail page
              className={styles.product_card}
            >
              {/* Wishlist Button */}
              <button
                className={styles.wishlist_button}
                onClick={(e) => e.stopPropagation()} // Prevent navigation
              >
                <IoHeartOutline />
              </button>

              {/* Product Image */}
              <img src={product.images[0]} alt={product.name} className={styles.product_image} />

              {/* Product Name */}
              <h3 className={styles.product_name}>{product.name}</h3>

              {/* Price */}
              <p className={styles.product_price}>${product.price}</p>
            </Link>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {/* View All Button */}
      <Button
        variant="primary"
        size="large"
        className={styles.view_all_button}
        onClick={handleViewAll}
      >
        {showAll ? "Show Less" : "View All"}
      </Button>
    </section>
  );
};

export default BestSelling;
