import { useEffect, useState } from "react";
import { WishlistItem } from "../types";
import styles from "../styles/home/Wishlist.module.css";
import { FaTrash } from "react-icons/fa";
import Button from "../components/global/Button";
import api from "../api";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      (async () => {
        setIsLoading(true);
        try {
          const response = await api.get<{ products: WishlistItem[] }>(
            "/wishlist",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const items = response.data.products; // Adjusted to get products
          setWishlistItems(items);
        } catch (error: any) {
          console.error("Error fetching wishlist:", error.message);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const items = wishlistItems.filter(
        (item) => item._id !== productId // Adjusted to use _id
      );
      setWishlistItems(items);
      await api.delete(`/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error: any) {
      console.error("Error removing item from wishlist:", error.message);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await api.post(
        "/cart",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const items = wishlistItems.filter(
        (item) => item._id !== productId // Adjusted to use _id
      );
      setWishlistItems(items);
    } catch (error: any) {
      console.error("Error adding item to cart:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Wishlist</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : wishlistItems.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className={styles.wishlist_content}>
          <table className={styles.wishlist_table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Add to Cart</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <a
                      href={`/product/${item._id
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td>${item.price}</td>
                  {/* You may want to update this to show actual price */}
                  <td>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleAddToCart(item._id)}
                    >
                      Add to Cart
                    </Button>
                  </td>
                  <td>
                    <FaTrash
                      className={styles.remove}
                      size={20}
                      onClick={() => handleRemove(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
