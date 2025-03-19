import { useEffect, useState } from "react";
import api from "../../api"; // Import API client
import styles from "../../styles/home/BestSelling.module.css"; // Import CSS module
import { Product } from "../../types"; // Import product type

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]); // Store best-selling products

  // Fetch random products when the component mounts
  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await api.get<Product[]>("/products"); // Fetch all products
        const shuffled = response.data.sort(() => 0.5 - Math.random()); // Shuffle array
        setProducts(shuffled.slice(0, 8)); // Select first 8 as best-sellers
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
      }
    };

    fetchBestSelling();
  }, []);

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
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className={styles.product_card}>
              {/* Product Image */}
              <img src={product.images[0]} alt={product.name} className={styles.product_image} />

              {/* Product Name */}
              <h3 className={styles.product_name}>{product.name}</h3>

              {/* Price */}
              <p className={styles.product_price}>${product.price}</p>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </section>
  );
};

export default BestSelling;
