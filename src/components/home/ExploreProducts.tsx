import { useEffect, useState, useRef } from "react";
import { IoHeartOutline, IoCartOutline, IoChevronBack, IoChevronForward } from "react-icons/io5"; // Icons for wishlist, cart, and navigation
import { FaStar, FaRegStar } from "react-icons/fa"; // Icons for ratings
import api from "../../api"; // Import global API client
import styles from "../../styles/home/ExploreProducts.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type

const ExploreProducts = () => {
  const [products, setProducts] = useState<Product[]>([]); // Store product list
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showAll, setShowAll] = useState(false); // State to toggle full product list
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Currently displayed products
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference for horizontal scrolling

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products"); // Fetch products from API
        setProducts(response.data);
        setDisplayedProducts(response.data.slice(0, 8)); // Show first 8 initially
      } catch (error) {
        console.error("Error fetching explore products:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);

  // Update displayed products when showAll changes
  useEffect(() => {
    if (showAll) {
      setDisplayedProducts(products); // Show all products
    } else {
      setDisplayedProducts(products.slice(0, 8)); // Show only 8 products initially
    }
  }, [showAll, products]);

  // Debugging: Log when showAll changes
  useEffect(() => {
    console.log("ShowAll changed:", showAll);
  }, [showAll]);

  // Function to scroll the product container left
  const scrollLeft = () => {
    if (containerRef.current && !showAll) {
      containerRef.current.scrollBy({ left: -600, behavior: "smooth" }); // Adjust scroll distance
    }
  };

  // Function to scroll the product container right
  const scrollRight = () => {
    if (containerRef.current && !showAll) {
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
        {/* Hide arrows if all products are shown */}
        {!showAll && (
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
          {/* Product List - Swaps between grid and scrollable view */}
          <div className={styles.scroll_wrapper}>
            <div
              className={`${styles.product_container} ${showAll ? styles.all_products_active : ""}`}
              ref={!showAll ? containerRef : null} 
            >
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <div key={product._id} className={styles.product_card}>
                    {/* Wishlist Button */}
                    <button className={styles.wishlist_button}>
                      <IoHeartOutline />
                    </button>
  
                    {/* Product Image */}
                    <img src={product.images[0]} alt={product.name} className={styles.product_image} />
  
                    {/* Product Name */}
                    <h3 className={styles.product_name}>{product.name}</h3>
  
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
  
                    {/* Add to Cart Button */}
                    <button className={styles.add_to_cart}>
                      <IoCartOutline className={styles.cart_icon} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </>
      )}
  
      {/* View All Products Button */}
      <button
        className={styles.view_all_button}
        onClick={() => {
          console.log("Before:", showAll);
          setShowAll((prev) => !prev);
          console.log("After:", showAll);
        }}
      >
        {showAll ? "Show Less" : "View All Products"}
      </button>
    </section>
  );
}  
export default ExploreProducts;
