import { useEffect, useState } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { FaRegStar, FaStar, FaStarHalfAlt, FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router';
import styles from '../styles/home/AllProducts.module.css';

const AllProducts = () => {
  const [products, setProducts] = useState<Array<any>>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

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

  const handleFilterChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') {
      return true;
    }
    return product.category === activeCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.all_products}>
      <h1>
        {activeCategory === 'all'
          ? 'All Products'
          : `Products in ${activeCategory}`}
      </h1>
      <div className={styles.category_buttons}>
        <button
          type='button'
          className={
            activeCategory === 'all' ? styles.active_button : undefined
          }
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        {Array.from(new Set(products.map((product) => product.category))).map(
          (category) => (
            <button
              key={category}
              type='button'
              className={
                activeCategory === category ? styles.active_button : undefined
              }
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </button>
          )
        )}
      </div>
      <section className={styles.product_container}>
        {currentProducts.map((product) => (
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
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(filteredProducts.length / productsPerPage) },
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
    </div>
  );
};

export default AllProducts;
