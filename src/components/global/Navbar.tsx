import { useState } from "react";
import { CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router";
import styles from "/src/styles/global/Navbar.module.css";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

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
        </ul>
        {showSearch && (
          <input type="text" placeholder="What are you looking for?" />
        )}
        <ul className={`${styles.icons}`}>
          <li>
            <CiSearch className="search-icon" onClick={handleSearchClick} />
          </li>
          <li>
            <CiHeart className="heart-icon" />
          </li>
          <li>
            <Link to="/cart">
              <CiShoppingCart className="cart-icon" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
export default Navbar;
