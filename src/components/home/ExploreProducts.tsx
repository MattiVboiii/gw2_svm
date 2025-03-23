import { useEffect, useState, useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // Icon
import api from "../../api"; // Import global API client
import Button from "../global/Button"; // Import global Button component
import styles from "../../styles/home/ExploreProducts.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type
import ProductCard from "../global/ProductCard";

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
        const shuffled = response.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 8); // Select random 8 products

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
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  slug={product.slug}
                  name={product.name}
                  images={product.images}
                  price={product.price}
                  ratings={product.ratings}
                  showAddToCart={true}
                />
              ))}
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
