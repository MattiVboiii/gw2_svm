import { useEffect, useState } from "react";
import { CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router";
import { toast } from "react-toastify";
import styles from "/src/styles/global/Navbar.module.css";
import api from "../../api"; // Import your API utility
import logo from "/src/assets/images/logo.png";
const GUEST_CART_KEY = "guestCart";
const GUEST_WISHLIST_KEY = "guestWishlist";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const token = localStorage.getItem("token");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  // Function to load the cart and count total items
  const loadCartAndWishlistCount = async () => {
    if (token) {
      try {
        const [cartResponse, wishlistResponse] = await Promise.all([
          api.get<{ items: { quantity: number }[] }>("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<{ products: { id: number }[] }>("/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Calculate total quantity of all items in the cart
        const totalQuantity = cartResponse.data.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(totalQuantity);

        // Calculate total quantity of all items in the wishlist
        const totalWishlistQuantity = wishlistResponse.data.products.length;
        setWishlistItemCount(totalWishlistQuantity);
      } catch (error) {
        toast.error("Error fetching cart and wishlist:");
      }
    } else {
      // Load guest cart and wishlist from localStorage
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      const guestItems = guestCart ? JSON.parse(guestCart) : [];

      // Calculate total quantity of guest cart items
      const totalQuantity = guestItems.length;
      setCartItemCount(totalQuantity);

      const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
      const guestWishlistItems = guestWishlist ? JSON.parse(guestWishlist) : [];

      // Calculate total quantity of guest wishlist items
      const totalWishlistQuantity = guestWishlistItems.length;
      setWishlistItemCount(totalWishlistQuantity);
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
    <a href="/allproducts" className={styles.shopNow}>ShopNow</a>
  </p>
  <span className={styles.language}>English ▼</span>
</div>

      <nav>
      <div className={styles.logoContainer}>
  <img src={logo} alt="Urban Indigo Logo" className={styles.logo} />
</div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          {!token && (
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          )}
          {token && (
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
        <ul className={styles.icons}>
          <li>
            <CiSearch
              size={20}
              className="search-icon"
              onClick={handleSearchClick}
            />
          </li>
          <li>
            <Link to="/wishlist" className={styles.wishlist_link}>
              <CiHeart size={20} className={styles.wishlist_icon} />
            </Link>
            {wishlistItemCount > 0 && (
              <span className={styles.wishlist_badge}>{wishlistItemCount}</span>
            )}
          </li>
          <li>
            <Link to="/cart" className={styles.cart_link}>
              <CiShoppingCart size={20} className={styles.cart_icon} />
            </Link>
            {cartItemCount > 0 && (
              <span className={styles.cart_badge}>{cartItemCount}</span>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
