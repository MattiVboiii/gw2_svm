import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router";
import { Product } from "../types";
import styles from "../styles/home/AllProducts.module.css";
import {
  getProducts,
  filterProducts,
  setPage,
  setProductsPerPage,
  selectProducts,
  selectFilteredProducts,
  selectCurrentPage,
  selectProductsPerPage,
} from "../store/productsSlice";
import api from "../api";
import Button from "../components/global/Button";

const AllProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts) as Product[];
  const filteredProducts = useSelector(selectFilteredProducts) as Product[];
  const currentPage = useSelector(selectCurrentPage) as number;
  const productsPerPage = useSelector(selectProductsPerPage) as number;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<
    { name: string; value: string }[]
  >([]);

  // Function to add a product to the cart
  const handleAddToCart = async (product: Product) => {
    if (localStorage.getItem("token")) {
      try {
        const response = await api.post<{ message: string }>(
          "/cart",
          {
            productId: product._id,
            variantId: product.variants[0]._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(`${product.name} added to cart`);
      } catch (error: any) {
        console.error("Error adding product to cart:", error.message);
      }
    } else {
      console.log("Please login to add product to cart");
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        dispatch(getProducts(response.data)); // Store products in Redux state
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ name: string }[]>("/categories");
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
    console.log("Selected category:", categoryName);
    if (categoryName === "all") {
      dispatch(getProducts(products)); // Reset to all products
    } else {
      dispatch(filterProducts(categoryName)); // Filter products by category
    }
    dispatch(setPage(1)); // Reset pagination to first page
  };

  // Pagination calculations
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
              ? "All Products"
              : `Products in ${
                  filteredProducts.length
                    ? filteredProducts[0]?.category?.name
                    : "All"
                }`}
          </h1>
          <div className={styles.products_per_page}>
            <label htmlFor="products_per_page">Products per page:</label>
            <input
              type="number"
              id="products_per_page"
              value={productsPerPage}
              min={5}
              step={1}
              max={filteredProducts.length}
              onChange={(e) =>
                dispatch(setProductsPerPage(parseInt(e.target.value)))
              }
            />
          </div>
          {/* Category filter buttons */}
          <div className={styles.category_buttons}>
            {categories.map(({ name, value }) => (
              <button
                key={value}
                className={
                  filteredProducts.length === products.length
                    ? name === "All"
                      ? styles.active_button
                      : undefined
                    : filteredProducts[0]?.category?.name === name
                    ? styles.active_button
                    : undefined
                }
                onClick={() => handleFilterChange(value)}
              >
                {name}
              </button>
            ))}
          </div>
          {/* Product list */}
          <section className={styles.product_container}>
            {currentProducts.map((product: Product) => (
              <section key={product._id} className={styles.product}>
                <Link to={`/product/${generateSlug(product.name)}`}>
                  <img src={product.images[0]} alt={product.name} />
                  <button className={styles.wishlist_button}>
                    <IoHeartOutline size={20} />
                  </button>
                  <h2>{product.name}</h2>
                  <p>${product.price}</p>
                  <p className={styles.ratings}>
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(product.ratings)) {
                        return <FaStar key={i} color="gold" />;
                      } else if (i === Math.floor(product.ratings)) {
                        return <FaStarHalfAlt key={i} color="gold" />;
                      } else {
                        return <FaRegStar key={i} color="grey" />;
                      }
                    })}
                  </p>
                </Link>
                <Button
                  variant="primary"
                  size="small"
                  className={styles.cart_button}
                  onClick={() => handleAddToCart(product)}
                >
                  <IoCartOutline size={20} />
                  Add to Cart
                </Button>
              </section>
            ))}
          </section>
          {/* Pagination controls */}
          <div className={styles.pagination}>
            {currentPage > 1 && (
              <Button
                key="first"
                variant="primary"
                size="small"
                onClick={() => paginate(1)}
              >
                |&lt;&lt;
              </Button>
            )}
            {currentPage > 1 && (
              <Button
                key="prev"
                variant="primary"
                size="small"
                onClick={() => paginate(currentPage - 1)}
              >
                &lt;
              </Button>
            )}
            {Array.from({ length: 3 }, (_, i) => {
              const pageNumber = currentPage + i - 1;
              if (
                pageNumber > 0 &&
                pageNumber <=
                  Math.ceil(filteredProducts.length / productsPerPage)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant="primary"
                    size="small"
                    className={
                      currentPage === pageNumber
                        ? styles.active_button
                        : undefined
                    }
                    onClick={() => paginate(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              }
              return null;
            })}
            {currentPage <
              Math.ceil(filteredProducts.length / productsPerPage) && (
              <Button
                key="next"
                variant="primary"
                size="small"
                onClick={() => paginate(currentPage + 1)}
              >
                &gt;
              </Button>
            )}
            {currentPage <
              Math.ceil(filteredProducts.length / productsPerPage) && (
              <Button
                key="last"
                variant="primary"
                size="small"
                onClick={() =>
                  paginate(Math.ceil(filteredProducts.length / productsPerPage))
                }
              >
                &gt;&gt;|
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
