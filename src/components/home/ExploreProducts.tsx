import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { IoHeartOutline, IoCartOutline, IoChevronBack, IoChevronForward } from "react-icons/io5"; // Icons
import { FaStar, FaRegStar } from "react-icons/fa"; // Icons for ratings
import api from "../../api"; // Import global API client
import Button from "../global/Button"; // Import global Button component
import styles from "../../styles/home/ExploreProducts.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type

const ExploreProducts = () => {
  const [products, setProducts] = useState<Product[]>([]); // Store product list
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference for horizontal scrolling

  // Function to generate slug if missing
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with "-"
      .replace(/[^a-z0-9-]/g, ""); // Remove special characters
  };

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products"); // Fetch products from API
        const shuffled = response.data.sort(() => 0.5 - Math.random()).slice(0, 8); // Select random 8 products

        // Ensure each product has a slug
        shuffled.forEach((p) => {
          if (!p.slug) {
            p.slug = generateSlug(p.name);
          }
        });

        setProducts(shuffled);
      } catch (error) {
        console.error("Error fetching explore products:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);

  // Function to scroll the product container left
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -600, behavior: "smooth" }); // Adjust scroll distance
    }
  };

  // Function to scroll the product container right
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 600, behavior: "smooth" }); // Adjust scroll distance
    }
  };

  return (
    <section className={styles.explore_section}>
      {/* Section Header */}
      <div className={styles.header_container}>
        <div className={styles.section_header}>
          <span className={styles.red_rectangle}></span>
          <p className={styles.section_text}>Our Products</p>
        </div>
        {/* Hide arrows if not enough products to scroll */}
        {products.length > 4 && (
          <div className={styles.arrow_container}>
            <button className={styles.arrow_left} onClick={scrollLeft}>
              <IoChevronBack />
            </button>
            <button className={styles.arrow_right} onClick={scrollRight}>
              <IoChevronForward />
            </button>
          </div>
        )}
      </div>
      <h2 className={styles.section_title}>Explore Our Products</h2>

      {isLoading ? (
        <p className={styles.loading_text}>Loading products...</p>
      ) : (
        <>
          {/* Product List - Scrollable */}
          <div className={styles.scroll_wrapper}>
            <div className={styles.product_container} ref={containerRef}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`} // Ensure slug exists
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
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={styles.product_image}
                    />

                    {/* Product Name */}
                    <h3 className={styles.product_name}>{product.name}</h3>
                    <div className={styles.price_rating_container}>
                    {/* Price */}
                    <p className={styles.product_price}>${product.price}</p>

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
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className={styles.add_to_cart}
                      onClick={(e) => e.stopPropagation()} // Prevent navigation
                    >
                      <IoCartOutline className={styles.cart_icon} />
                      <span>Add to Cart</span>
                    </button>
                  </Link>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* View All Products Button - Navigates to AllProducts page */}
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

export default ExploreProducts;
