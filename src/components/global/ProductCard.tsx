import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "../../styles/global/ProductCard.module.css";
import Button from "./Button";
import { ProductCardProps } from "../../types";
import api from "../../api";
import { toast } from "react-toastify";

const ProductCard: React.FC<ProductCardProps> = ({
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
}) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await api.get<{ products: { _id: string }[] }>(
          "/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistItems(res.data.products.map((p) => p._id));
      } catch (err) {
        toast.error("Error fetching wishlist");
      }
    };
    fetchWishlist();
  }, [token]);

  const handleToggleWishlist = async () => {
    if (!token) {
      toast.error("Please log in to manage your wishlist");
      return;
    }
    try {
      setIsUpdatingWishlist(true);
      if (wishlistItems.includes(_id)) {
        await api.delete(`/wishlist/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems((prev) => prev.filter((id) => id !== _id));
        toast.success(`${name} removed from wishlist!`);
      } else {
        await api.post(
          "/wishlist",
          { productId: _id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems((prev) => [...prev, _id]);
        toast.success(`${name} added to wishlist!`);
      }
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
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      )}
    </div>
  );
};

export default ProductCard;
