import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IoCartOutline, IoHeartOutline } from 'react-icons/io5';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import styles from '../styles/home/ProductDetail.module.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          'https://webshop-api-wc6u.onrender.com/api/products'
        );
        const data = await response.json();

        // Find the product by comparing generated slugs
        const matchedProduct = data.find((p) => generateSlug(p.name) === slug);

        setProduct(matchedProduct || null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProducts();
  }, [slug]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className={styles.product_detail}>
      <img
        src={product.images[0]}
        alt={product.name}
        className={styles.image}
      />
      <div className={styles.info}>
        <h1>{product.name}</h1>
        <p className={styles.price}>${product.price}</p>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.ratings}>
          {[...Array(5)].map((_, i) => {
            if (i < Math.floor(product.ratings)) {
              return <FaStar key={i} color='gold' />;
            } else if (i === Math.floor(product.ratings)) {
              return <FaStarHalfAlt key={i} color='gold' />;
            } else {
              return <FaRegStar key={i} color='grey' />;
            }
          })}
        </div>
        <button>
          <IoCartOutline className={styles.icon} /> Add to Cart
        </button>
        <button>
          <IoHeartOutline className={styles.icon} /> Add to Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
