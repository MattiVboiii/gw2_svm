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
import { Product } from '../types'; // Importing the Product type

const AllProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);
  const currentPage = useSelector(selectCurrentPage);
  const productsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ name: string; value: string }[]>([]);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        dispatch(getProducts(response.data)); // Store products in Redux state
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ name: string }[]>('/categories');
        const categoriesData = response.data.map((cat) => ({
          name: cat.name,
          value: cat.name.toLowerCase(),
        }));
        setCategories([{ name: "All", value: "all" }, ...categoriesData]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle category filtering
  const handleFilterChange = (categoryName: string) => {
    if (categoryName === 'all') {
      dispatch(getProducts(products)); // Reset to all products
    } else {
      dispatch(filterProducts(categoryName)); // Filter products by category
    }
    dispatch(setPage(1)); // Reset pagination to first page
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
                    ? filteredProducts[0]?.category?.name
                    : 'All'
                }`}
          </h1>
          {/* Category filter buttons */}
          <div className={styles.category_buttons}>
            {categories.map((category) => (
              <button
                key={category.value}
                type='button'
                className={
                  filteredProducts.length > 0 &&
                  filteredProducts[0]?.category?.name.toLowerCase() === category.value
                    ? styles.active_button
                    : undefined
                }
                onClick={() => handleFilterChange(category.value)}
              >
                {category.name}
              </button>
            ))}
          </div>
          {/* Product list */}
          <section className={styles.product_container}>
            {currentProducts.map((product: Product) => (
              <section key={product._id} className={styles.product}>
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
                <Link to={`/product/${product._id}`}>
                  <FaRegEye className={styles.eye_icon} />
                </Link>
              </section>
            ))}
          </section>
          {/* Pagination controls */}
          <div className={styles.pagination}>
            {Array.from(
              { length: Math.ceil(filteredProducts.length / productsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? styles.active_button : undefined}
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