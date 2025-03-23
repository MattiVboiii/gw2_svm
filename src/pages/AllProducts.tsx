import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoCartOutline, IoHeart, IoHeartOutline } from "react-icons/io5";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // For reading ?category=... from URL
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
import { toast } from "react-toastify";

// Converts a product name to a URL-friendly slug
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Converts category to slug (for clean URL matching)
const normalizeCategory = (cat: string) =>
  cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const AllProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Get category from the URL, like ?category=men-s-fashion
  const params = new URLSearchParams(location.search);
  const categoryFromURL = params.get("category");
  const activeCategory = normalizeCategory(categoryFromURL || "all");

  const products = useSelector(selectProducts) as Product[];
  const filteredProducts = useSelector(selectFilteredProducts) as Product[];
  const currentPage = useSelector(selectCurrentPage) as number;
  const productsPerPage = useSelector(selectProductsPerPage) as number;

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ name: string; value: string }[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ products: { _id: string }[] }>("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.products.map(p => p._id);
      setWishlistItems(ids);
    } catch (err: any) {
      toast.error("Error fetching wishlist: " + err.message);
    }
  };

  // Toggle wishlist state
  const handleToggleWishlist = async (product: Product) => {
    try {
      setIsUpdatingWishlist(true);
      if (wishlistItems.includes(product._id)) {
        await api.delete(`/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(prev => prev.filter(id => id !== product._id));
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        await api.post(
          "/wishlist",
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistItems(prev => [...prev, product._id]);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error: any) {
      toast.error("Error updating wishlist: " + error.message);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  // Load all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        dispatch(getProducts(response.data));
        setIsLoading(false);
      } catch (error: any) {
        toast.error("Error fetching products: " + error.message);
      }
    };

    fetchProducts();
    if (token) fetchWishlist();
  }, [dispatch, token]);

  // Apply filtering based on URL category
  useEffect(() => {
    if (categoryFromURL && products.length > 0) {
      dispatch(filterProducts(categoryFromURL));
      dispatch(setPage(1));
    }
  }, [categoryFromURL, products, dispatch]);

  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<{ name: string }[]>("/categories");
        const categoriesData = res.data.map(cat => ({
          name: cat.name,
          value: normalizeCategory(cat.name),
        }));
        setCategories([{ name: "All", value: "all" }, ...categoriesData]);
      } catch (err: any) {
        toast.error("Error fetching categories: " + err.message);
      }
    };
    fetchCategories();
  }, []);

  // Manual category filter from buttons
  const handleFilterChange = (categoryName: string) => {
    const newCategory = categoryName === "all" ? "" : categoryName;
  
    // change URL
    const url = new URL(window.location.href);
    if (newCategory) {
      url.searchParams.set("category", newCategory);
    } else {
      url.searchParams.delete("category"); // delete if category is "all"
    }
  
    // changing URL without page reload
    window.history.pushState({}, "", url.toString());
  
    // redux filter
    if (newCategory) {
      dispatch(filterProducts(newCategory));
    } else {
      dispatch(getProducts(products));
    }
  
    dispatch(setPage(1));
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await api.post(
        "/cart",
        {
          productId: product._id,
          variantId: product.variants[0]._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error("Error adding to cart: " + error.message);
    }
  };

  // Pagination logic
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
            {filteredProducts.length === products.length ? "All Products" : "Filtered Products"}
          </h1>

          {/* Select number of products per page */}
          <div className={styles.products_per_page}>
            <label htmlFor="products_per_page">Products per page:</label>
            <input
              type="number"
              id="products_per_page"
              value={productsPerPage}
              min={5}
              step={1}
              max={filteredProducts.length}
              onChange={(e) => dispatch(setProductsPerPage(parseInt(e.target.value)))}
            />
          </div>

          {/* Category filter buttons */}
          <div className={styles.category_buttons}>
          {categories.map(({ name, value }) => (
          <button
           key={value}
           onClick={() => handleFilterChange(value)}
           className={activeCategory === value ? styles.active_button : ""}
          >
         {name}
         </button>
         ))}

          </div>

          {/* Product list */}
          <section className={styles.product_container}>
            {currentProducts.map((product) => (
              <section key={product._id} className={styles.product}>
                <button
                  className={styles.wishlist_button}
                  onClick={() => handleToggleWishlist(product)}
                  disabled={isUpdatingWishlist}
                >
                  {wishlistItems.includes(product._id) ? <IoHeart color="red" /> : <IoHeartOutline />}
                </button>
                <Link
                  to={`/product/${product.slug || generateSlug(product.name)}-${product._id}`}
                >
                  <img src={product.images[0]} alt={product.name} />
                  <h2>{product.name}</h2>
                  <p>${product.price}</p>
                  <p className={styles.ratings}>
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(product.ratings)) return <FaStar key={i} color="gold" />;
                      else if (i === Math.floor(product.ratings)) return <FaStarHalfAlt key={i} color="gold" />;
                      else return <FaRegStar key={i} color="grey" />;
                    })}
                  </p>
                </Link>
                <Button
                  variant="primary"
                  size="small"
                  className={styles.cart_button}
                  onClick={() => handleAddToCart(product)}
                >
                  <IoCartOutline size={20} /> Add to Cart
                </Button>
              </section>
            ))}
          </section>

          {/* Pagination */}
          <div className={styles.pagination}>
            {currentPage > 1 && (
              <Button variant="primary" size="small" onClick={() => paginate(1)}>
                |&lt;&lt;
              </Button>
            )}
            {currentPage > 1 && (
              <Button variant="primary" size="small" onClick={() => paginate(currentPage - 1)}>
                &lt;
              </Button>
            )}
            {Array.from({ length: 3 }, (_, i) => {
              const pageNumber = currentPage + i - 1;
              if (pageNumber > 0 && pageNumber <= Math.ceil(filteredProducts.length / productsPerPage)) {
                return (
                  <Button
                    key={pageNumber}
                    variant="primary"
                    size="small"
                    className={currentPage === pageNumber ? styles.active_button : undefined}
                    onClick={() => paginate(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              }
              return null;
            })}
            {currentPage < Math.ceil(filteredProducts.length / productsPerPage) && (
              <Button variant="primary" size="small" onClick={() => paginate(currentPage + 1)}>
                &gt;
              </Button>
            )}
            {currentPage < Math.ceil(filteredProducts.length / productsPerPage) && (
              <Button
                variant="primary"
                size="small"
                onClick={() => paginate(Math.ceil(filteredProducts.length / productsPerPage))}
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
