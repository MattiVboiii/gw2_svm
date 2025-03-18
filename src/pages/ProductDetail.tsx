import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import styles from '../styles/home/ProductDetail.module.css';
import { getProducts, selectProducts } from '../store/productsSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const product = products.find((product) => product.id === Number(id)) || null;
  if (!product) return <p>Product not found</p>;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://webshop-api-wc6u.onrender.com/api/products/${id}`
        );
        const data = await response.json();
        dispatch(getProducts(data));
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [dispatch, id]);

  return (
    <div className={styles.product_detail_page}>
      <section className={styles.product}>
        <img src={product.images[0]} alt={product.name} />
        <button type='button'>
          <IoCartOutline className={styles.cart_icon} />
          Add to Cart
        </button>
        <h2>{product.name}</h2>
        <p>${product.price}</p>
        <p>
          {[...Array(5)].map((_, i) => {
            if (i < Math.floor(product.ratings)) {
              return <FaStar key={i} color='gold' />;
            } else if (i === Math.floor(product.ratings)) {
              return <FaStarHalfAlt key={i} color='gold' />;
            } else {
              return <FaRegStar key={i} color='grey' />;
            }
          })}
          <span>({product.ratings})</span>
        </p>
      </section>
    </div>
  );
};

export default ProductDetail;
