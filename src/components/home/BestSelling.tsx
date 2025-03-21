import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import api from "../../api"; // Import API client
import Button from "../global/Button"; // Import global Button component
import styles from "../../styles/home/BestSelling.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type
import { IoHeartOutline } from "react-icons/io5"; // Icon for wishlist
import { FaStar, FaRegStar } from "react-icons/fa"; // Icons for ratings

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Function to generate slug if missing
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with "-"
      .replace(/[^a-z0-9-]/g, ""); // Remove special characters
  };

  // Function to generate old price (if not provided by API)
  const getOldPrice = (price: number) => {
    return Math.round(price * 1.2); // Add 20% to current price
  };

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await api.get<Product[]>("/products"); // Fetch products
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        const bestSelling = shuffled.slice(0, 8); // Store 8 best-sellers

        // Ensure slug exists
        bestSelling.forEach((p) => {
          if (!p.slug) {
            p.slug = generateSlug(p.name);
          }
        });

        setProducts(bestSelling);
        setDisplayedProducts(bestSelling.slice(0, 4)); // Initially show only 4 products

        console.log("Fetched Best Selling Products:", bestSelling);
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
      }
    };

    fetchBestSelling();
  }, []);

  // Handle View All button
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
        <div className={styles.section_title_container}>
          <h2 className={styles.section_title}>Best Selling Products</h2>

          {/* View All Button */}
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

      {/* Product List */}
      <div className={styles.product_container}>
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product.slug}`} // Ensure slug exists
              className={styles.product_card}
            >
              {/* Wishlist Button */}
              <button
                className={styles.wishlist_button}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation when clicking the wishlist button
                }}
              >
                <IoHeartOutline />
              </button>

              {/* Product Image */}
              <img
                src={product.images[0]}
                alt={product.name}
                className={styles.product_image}
              />

              {/* Product Name */}
              <h3 className={styles.product_name}>{product.name}</h3>

              {/* Price with old price */}
              <p className={styles.product_price}>
                ${product.price}
                <span className={styles.old_price}>${getOldPrice(product.price)}</span>
              </p>

              {/* Rating */}
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
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </section>
  );
};

export default BestSelling;
