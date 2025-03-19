import { useEffect, useState } from "react";
import api from "../../api"; // Import global API client
import { Product } from "../../types"; // Import product type

const ExploreProducts = () => {
  const [products, setProducts] = useState<Product[]>([]); // Store product list
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data as Product[]);
      } catch (error) {
        console.error("Error fetching explore products:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);

  return (
    <section>
      <h2>Explore Our Products</h2>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id}>
                <img src={product.images[0]} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>${product.price}</p>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ExploreProducts;
