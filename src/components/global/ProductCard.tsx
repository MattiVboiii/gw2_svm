import React from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "../../styles/global/ProductCard.module.css";
import Button from "./Button";
import { ProductCardProps } from "../../types";
import api from "../../api";
import { toast } from "react-toastify";
import { useWishlist } from "../../context/WishlistContext";
import { useGlobalCounts } from "../../context/GlobalCountsContext";
import { useNavigate } from "react-router-dom";

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const {
    _id,
    slug,
    name,
    images,
    price,
    ratings,
    discountPercentage = 0,
    showAddToCart = false,
    showRating = true,
    showDiscount = true,
    customLink,
    className,
    customImageStyle,
  } = props;

  const { wishlistItems, refetchWishlist } = useWishlist();
  const { refreshCounts } = useGlobalCounts(); // <-- Added call
  const [isUpdatingWishlist, setIsUpdatingWishlist] = React.useState(false);
  const token = localStorage.getItem("token");
  const validToken = token && token.trim() !== "" && token !== "undefined";
  const navigate = useNavigate();

  const navigateToProductPage = () => {
    navigate(link);
  };

  const handleToggleWishlist = async () => {
    if (!validToken) {
      toast.error("Please log in to manage your wishlist");
      return;
    }
    try {
      setIsUpdatingWishlist(true);
      if (wishlistItems.includes(_id)) {
        await api.delete(`/wishlist/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`${name} removed from wishlist!`);
      } else {
        await api.post(
          "/wishlist",
          { productId: _id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`${name} added to wishlist!`);
      }
      // Refresh the wishlist state in WishlistContext
      await refetchWishlist();
      // Explicitly update the global wishlist counter
      await refreshCounts();
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      toast.error("Error updating wishlist");
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post(
        "/cart",
        { productId: _id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${name} added to cart!`);
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  const generatedSlug =
    slug ||
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  const link = customLink || `/product/${generatedSlug}-${_id}`;
  const image = images[0];
  const discountedPrice = discountPercentage
    ? Math.round(price * (1 - discountPercentage / 100))
    : price;
  const oldPrice = discountPercentage ? price : null;

  return (
    <div className={`${styles.card} ${className || ""}`}>
      {showDiscount && discountPercentage > 0 && (
        <span className={styles.discount_badge}>-{discountPercentage}%</span>
      )}
      <button
        className={styles.wishlist_button}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleWishlist();
        }}
      >
        {wishlistItems.includes(_id) ? (
          <IoHeart color="red" />
        ) : (
          <IoHeartOutline />
        )}
      </button>
      <Link to={link}>
        <img
          src={image}
          alt={name}
          className={styles.product_image}
          style={customImageStyle}
        />
        <h3 className={styles.product_name}>{name}</h3>
        <div className={styles.price_block}>
          <span className={styles.product_price}>${discountedPrice}</span>
          {oldPrice && (
            <span className={styles.old_price}>${oldPrice.toFixed(0)}</span>
          )}
        </div>
        {showRating && (
          <div className={styles.product_rating}>
            {[...Array(5)].map((_, i) =>
              i < Math.floor(ratings) ? (
                <FaStar key={i} color="gold" />
              ) : (
                <FaRegStar key={i} color="grey" />
              )
            )}
          </div>
        )}
      </Link>
      {showAddToCart && (
        <Button
          variant="primary"
          size="small"
          className={styles.add_to_cart}
          onClick={navigateToProductPage}
        >
          View Details
        </Button>
      )}
    </div>
  );
};

export default ProductCard;
