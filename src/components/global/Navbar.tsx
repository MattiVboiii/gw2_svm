import { useEffect, useState } from "react";
import { CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router";
import styles from "/src/styles/global/Navbar.module.css";
import api from "../../api"; // Import your API utility

const GUEST_CART_KEY = "guestCart";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const token = localStorage.getItem("token");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  // Function to load the cart and count total items
  const loadCartCount = async () => {
    if (token) {
      try {
        const response = await api.get<{ items: { quantity: number }[] }>(
          "/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Calculate total quantity of all items
        const totalQuantity = response.data.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(totalQuantity);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      const guestItems = guestCart ? JSON.parse(guestCart) : [];

      // Calculate total quantity of guest cart items
      const totalQuantity = guestItems.reduce(
        (total: number, item: { quantity: number }) => total + item.quantity,
        0
      );
      setCartItemCount(totalQuantity);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, [token]);

  return (
    <>
      <nav>
        <h1>Headless Clothing Store</h1>
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
            <CiSearch className="search-icon" onClick={handleSearchClick} />
          </li>
          <li>
            <Link to="/wishlist">
              <CiHeart className="heart-icon" />
            </Link>
          </li>
          <li>
            <Link to="/cart" className={styles.cart_link}>
              <CiShoppingCart className="cart-icon" />
              {cartItemCount > 0 && (
                <span className={styles.cart_badge}>{cartItemCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
