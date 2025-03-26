import { useEffect, useState } from "react";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../styles/global/Navbar.module.css";
import logo from "../../assets/images/logo.png";
import { useGlobalCounts } from "../../context/GlobalCountsContext";
import api from "../../api";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [showSearch] = useState(false);
  const { cartCount, wishlistCount } = useGlobalCounts();
  const token = localStorage.getItem("token");
  const validToken = token && token.trim() !== "" && token !== "undefined";

  // Placeholder for user image URL
  const defaultImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png";
  const [userImage, setUserImage] = useState(defaultImage);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!validToken) return;

      try {
        // Decode the token to extract the user ID
        const decodedToken = jwtDecode<{ userId: string }>(token);
        const userId = decodedToken?.userId;

        if (!userId) {
          console.error("User ID not found in token.");
          return;
        }

        // Fetch all users (since we can't query just one)
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data)) {
          // Find the current user by matching the decoded user ID
          const user = res.data.find((u) => u._id === userId);

          if (user && user.image) {
            setUserImage(user.image);
          }
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, [validToken, token]);

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
          <input
            type="text"
            placeholder="What are you looking for?"
            className={styles.searchInput}
          />
        )}
        <div className={styles.icons}>
          <Link
            to="/wishlist"
            className={styles.wishlist}
            style={{ position: "relative" }}
          >
            <CiHeart size={24} />
            {validToken && wishlistCount > 0 && (
              <span className={styles.wishlist_badge}>{wishlistCount}</span>
            )}
          </Link>
          <Link
            to="/cart"
            className={styles.cart}
            style={{ position: "relative" }}
          >
            <CiShoppingCart size={24} />
            {cartCount > 0 && (
              <span className={styles.cart_badge}>{cartCount}</span>
            )}
          </Link>
          <Link to="/account" className={styles.account}>
            <img src={userImage ? userImage : defaultImage} alt="" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
