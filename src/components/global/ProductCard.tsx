import React from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "../../styles/global/ProductCard.module.css";
import Button from "./Button";
import { ProductCardProps } from "../../types";

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  slug,
  name,
  images,
  price,
  ratings,
  discountPercentage = 0,
  onAddToCart,
  wishlistButton,
  showAddToCart = false,
  showRating = true,       // Optional: show/hide rating stars
  showDiscount = true,     // Optional: show/hide discount badge
  customLink,
  className,
  customImageStyle,        // Optional: override image styles per use case
}) => {
  // Generate slug from name if not provided
  const generatedSlug = slug || name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const link = customLink || `/product/${generatedSlug}-${_id}`;
  const image = images[0]; // Use the first image from the array

  const discountedPrice = discountPercentage
    ? Math.round(price * (1 - discountPercentage / 100))
    : price;

  const oldPrice = discountPercentage ? price : null;

  return (
    <Link to={link} className={`${styles.card} ${className || ""}`}>
      {/* Discount badge (optional) */}
      {showDiscount && discountPercentage > 0 && (
        <span className={styles.discount_badge}>-{discountPercentage}%</span>
      )}

      {/* Wishlist heart icon (customizable) */}
      <button
        className={styles.wishlist_button}
        onClick={(e) => e.stopPropagation()}
      >
        {wishlistButton || <IoHeartOutline />}
      </button>

      {/* Product image (with optional custom styles) */}
      <img
        src={image}
        alt={name}
        className={styles.product_image}
        style={customImageStyle}
      />

      {/* Product name */}
      <h3 className={styles.product_name}>{name}</h3>

      {/* Price and old price block */}
      <div className={styles.price_block}>
        <span className={styles.product_price}>${discountedPrice}</span>
        {oldPrice && (
          <span className={styles.old_price}>${oldPrice.toFixed(0)}</span>
        )}
      </div>

      {/* Rating stars (optional) */}
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

      {/* Add to Cart button (optional) */}
      {showAddToCart && onAddToCart && (
        <Button
          variant="primary"
          size="small"
          className={styles.add_to_cart}
          onClick={() => {
            onAddToCart();
          }}
        >
          Add To Cart
        </Button>
      )}
    </Link>
  );
};

export default ProductCard;
