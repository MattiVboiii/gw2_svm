import { useEffect, useState } from "react";
import { CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom"; // using react-router-dom here
import { toast } from "react-toastify";
import styles from "/src/styles/global/Navbar.module.css";
import api from "../../api";
import logo from "/src/assets/images/logo.png";
import { useWishlist } from "../../context/WishlistContext";

const GUEST_CART_KEY = "guestCart";
const GUEST_WISHLIST_KEY = "guestWishlist";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const token = localStorage.getItem("token");
  const validToken = token && token.trim() !== "" && token !== "undefined";
  const { wishlistItems } = useWishlist();

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const loadCartAndWishlistCount = async () => {
    if (token) {
      try {
        const [cartResponse, wishlistResponse] = await Promise.all([
          api.get<{ items: { quantity: number }[] }>("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<{ products: { _id: string }[] }>("/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const totalQuantity = cartResponse.data.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(totalQuantity);
        const totalWishlist = wishlistResponse.data.products.length;
        setWishlistItemCount(totalWishlist);
      } catch (error: any) {
        toast.error("Error fetching cart and wishlist");
      }
    } else {
      // For guest users, retrieve counts from localStorage (if implemented)
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      const guestItems = guestCart ? JSON.parse(guestCart) : [];
      setCartItemCount(guestItems.length);

      const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
      const guestWishlistItems = guestWishlist ? JSON.parse(guestWishlist) : [];
      setWishlistItemCount(guestWishlistItems.length);
    }
  };

  useEffect(() => {
    loadCartAndWishlistCount();
  }, [token]);

  return (
    <>
      <div className={styles.topBanner}>
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery – OFF 50%!{" "}
          <Link to="/allproducts" className={styles.shopNow}>
            Shop Now
          </Link>
        </p>
        <span className={styles.language}>English ▼</span>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={logo} alt="Logo" className={styles.logo} />
          </Link>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/allproducts">Products</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {!token ? (
            <>
              <li>
                <Link to="/login">Log In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                  toast.success("Logged out successfully!");
                }}
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
        {showSearch && (
          <input type="text" placeholder="What are you looking for?" />
        )}
        <div className={styles.icons}>
          <Link
            to="/wishlist"
            className={styles.wishlist}
            style={{ position: "relative" }}
          >
            <CiHeart size={24} />
            {validToken && wishlistItems.length > 0 && (
              <span className={styles.wishlist_badge}>
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className={styles.cart}
            style={{ position: "relative" }}
          >
            <CiShoppingCart size={24} />
            {validToken && cartItemCount > 0 && (
              <span className={styles.cart_badge}>{cartItemCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
