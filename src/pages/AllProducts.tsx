import { useEffect, useState } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { FaRegStar, FaStar, FaStarHalfAlt, FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router';
import styles from '../styles/home/AllProducts.module.css';

const AllProducts = () => {
  const [products, setProducts] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.all_products}>
      <h1>All Products</h1>
      <section className={styles.product_container}>
        {products.map((product) => (
          <section key={product.id} className={styles.product}>
            <img src={product.image} alt={product.title} />
            <button type='button'>
              <IoCartOutline className={styles.cart_icon} />
              Add to Cart
            </button>
            <h2>{product.title}</h2>
            <p>${product.price}</p>
            <p>
              {[...Array(5)].map((_, i) => {
                if (i < Math.floor(product.rating.rate)) {
                  return <FaStar key={i} color='gold' />;
                } else if (i === Math.floor(product.rating.rate)) {
                  return <FaStarHalfAlt key={i} color='gold' />;
                } else {
                  return <FaRegStar key={i} color='grey' />;
                }
              })}
              <span>({product.rating.count})</span>
            </p>
            <Link to={`/product/${product.id}`}>
              <FaRegEye className={styles.eye_icon} />
            </Link>
          </section>
        ))}
      </section>
    </div>
  );
};

export default AllProducts;
