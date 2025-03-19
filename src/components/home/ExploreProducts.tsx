import { useEffect, useState } from "react";
import api from "../../api";

const ExploreProducts = () => {
  // State to store products
  const [products, setProducts] = useState([]);

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching explore products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section>
      <h2>Explore Our Products</h2>
      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id}>
              <img src={product.images[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </section>
  );
};

export default ExploreProducts;
