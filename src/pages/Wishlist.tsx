import { useEffect, useState } from "react";
import { Product, WishlistItem } from "../types";
import styles from "../styles/home/Wishlist.module.css";
import Button from "../components/global/Button";
import api from "../api";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      (async () => {
        setIsLoading(true);
        try {
          const response = await api.get<{ products: WishlistItem[] }>(
            "/wishlist",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setWishlistItems(response.data.products);
        } catch (error: any) {
          toast.error("Error fetching wishlist: " + error.message);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      // For guest users, you can load wishlist from localStorage if needed
      setIsLoading(false);
    }
  }, [token]);

  const handleRemove = async (productId: string) => {
    if (!token) return;
    try {
      await api.delete(`/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = wishlistItems.filter((item) => item._id !== productId);
      setWishlistItems(updated);
      toast.success("Item removed from wishlist");
      // Dispatch wishlistUpdated event
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error: any) {
      toast.error("Error removing item from wishlist");
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await api.post<{ message: string }>(
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
      await handleRemove(product._id);
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      toast.error(`Error adding item to cart: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Wishlist</h1>
      {isLoading ? (
        <p>Loading wishlist...</p>
      ) : wishlistItems.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className={styles.wishlist_content}>
          <div className={styles.wishlist_cards}>
            {wishlistItems.map((item) => (
              <div key={item._id} className={styles.wishlist_card}>
                <button
                  className={styles.remove_button}
                  onClick={() => handleRemove(item._id)}
                >
                  <FaTrash />
                </button>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className={styles.wishlist_image}
                />
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleAddToCart(item as Product)}
                >
                  Add to Cart
                </Button>
                <h2>{item.name}</h2>
                <p>${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
