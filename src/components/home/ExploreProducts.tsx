import { useEffect, useState, useRef } from "react";
import { IoHeartOutline, IoCartOutline, IoChevronBack, IoChevronForward } from "react-icons/io5"; // Icons for wishlist, cart, and navigation
import { FaStar, FaRegStar } from "react-icons/fa"; // Icons for ratings
import api from "../../api"; // Import global API client
import styles from "../../styles/home/ExploreProducts.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type

const ExploreProducts = () => {
const [products, setProducts] = useState<Product[]>([]); // Store product list
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference for horizontal scrolling

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products"); // Fetch products from API
        setProducts(response.data as Product[]);
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
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Function to scroll the product container right
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.explore_section}>
      {/* Section Header */}
      <div className={styles.section_header}>
        <span className={styles.red_rectangle}></span>
        <p className={styles.section_text}>Our Products</p>
      </div>
      <h2 className={styles.section_title}>Explore Our Products</h2>

      {isLoading ? (
        <p className={styles.loading_text}>Loading products...</p>
      ) : (
        <>
          {/* Arrows for scrolling */}
          <button className={styles.arrow_left} onClick={scrollLeft}>
            <IoChevronBack />
          </button>
          <button className={styles.arrow_right} onClick={scrollRight}>
            <IoChevronForward />
          </button>

          {/* Product List */}
          <div className={styles.product_container} ref={containerRef}>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className={styles.product_card}>
                  {/* Wishlist Button */}
                  <button className={styles.wishlist_button}>
                    <IoHeartOutline />
                  </button>

                  {/* Product Image */}
                  <img src={product.images[0]} alt={product.name} className={styles.product_image} />

                  {/* Product Name */}
                  <h3 className={styles.product_name}>{product.name}</h3>

                  {/* Product Description */}
                  <p className={styles.product_description}>{product.description}</p>

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
        </>
      )}

      {/* View All Products Button */}
      <button className={styles.view_all_button}>View All Products</button>
    </section>
  );
};

export default ExploreProducts;