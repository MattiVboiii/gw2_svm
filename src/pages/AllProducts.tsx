import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import { FaRegStar, FaStar, FaStarHalfAlt, FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router';
import styles from '../styles/home/AllProducts.module.css';
import {
  getProducts,
  filterProducts,
  setPage,
  selectProducts,
  selectFilteredProducts,
  selectCurrentPage,
} from '../store/productsSlice';
import api from "../api";
import { Product } from '../types'; // Adjust the import path as necessary
const AllProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);
  const currentPage = useSelector(selectCurrentPage);
  const productsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products"); 
        dispatch(getProducts(response.data)); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleFilterChange = (categoryName: string) => {
    if (categoryName === 'all') {
      dispatch(getProducts(products));
    } else {
      dispatch(filterProducts(categoryName));
    }
    dispatch(setPage(1));
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => dispatch(setPage(pageNumber));

  return (
    <div className={styles.all_products}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>
            {filteredProducts.length === products.length
              ? 'All Products'
              : `Products in ${
                  filteredProducts.length
                    ? filteredProducts[0]?.category.name
                    : 'All'
                }`}
          </h1>
          <div className={styles.category_buttons}>
            <button
              type='button'
              className={
                filteredProducts.length === products.length
                  ? styles.active_button
                  : undefined
              }
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            {Array.from(
              new Set(products.map((product: Product) => product.category.name))
            ).map((categoryName) => (
              <button
                key={categoryName}
                type='button'
                className={
                  filteredProducts.length > 0 &&
                  filteredProducts[0]?.category.name === categoryName &&
                  filteredProducts.length !== products.length
                    ? styles.active_button
                    : undefined
                }
                onClick={() => handleFilterChange(categoryName)}
              >
                {categoryName}
              </button>
            ))}
          </div>
          <section className={styles.product_container}>
            {currentProducts.map((product) => (
              <section key={product.id} className={styles.product}>
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
                </p>
                <Link to={`/product/${product.id}`}>
                  <FaRegEye className={styles.eye_icon} />
                </Link>
              </section>
            ))}
          </section>
          <div className={styles.pagination}>
            {Array.from(
              {
                length: Math.ceil(filteredProducts.length / productsPerPage),
              },
              (_, i) => (
                <button
                  key={i + 1}
                  className={
                    currentPage === i + 1 ? styles.active_button : undefined
                  }
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
