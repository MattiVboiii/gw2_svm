import { useEffect, useState } from "react";
import { Product } from "../types";
import styles from "../styles/home/Wishlist.module.css";
import Button from "../components/global/Button";
import api from "../api";
import { fetchFullWishlistItems } from "../utils/apiHelpers";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      (async () => {
        setIsLoading(true);
        try {
          const response = await api.get<{ products: { _id: string }[] }>(
            "/wishlist",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const wishlistRaw = response.data.products;

          const fullItems = await fetchFullWishlistItems(wishlistRaw);

          setWishlistItems(fullItems);
        } catch (error: any) {
          toast.error("Error fetching wishlist: " + error.message);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleRemove = async (productId: string) => {
    if (!token) return;
    try {
      await api.delete(`/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const itemName = wishlistItems.find(
        (item) => item._id === productId
      )?.name;
      const updated = wishlistItems.filter((item) => item._id !== productId);
      setWishlistItems(updated);
      toast.success(`${itemName} removed from wishlist`);
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await handleRemove(product._id);
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      toast.error(`Error adding item to cart: ${error.message}`);
    }
  };

  const handleClearWishlist = async () => {
    if (!token) return;
    try {
      await api.delete("/wishlist/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems([]);
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Wishlist cleared successfully");
    } catch (error: any) {
      console.error("Error clearing wishlist:", error.message);
    }
  };

  const handleDelete = () => {
    if (selectedItemId) {
      handleRemove(selectedItemId);
      setShowModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Wishlist</h1>
      <Button variant="primary" size="small" onClick={handleClearWishlist}>
        Clear Wishlist
      </Button>
      {isLoading ? (
        <p>Loading wishlist...</p>
      ) : token ? (
        wishlistItems.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          <div className={styles.wishlist_content}>
            <div className={styles.wishlist_cards}>
              {wishlistItems.map((item) => {
                console.log("Wishlist item:", item);
                return (
                  <div key={item._id} className={styles.wishlist_card}>
                    <button
                      className={styles.remove_button}
                      onClick={() => {
                        setShowModal(true);
                        setSelectedItemId(item._id);
                      }}
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
                );
              })}
            </div>
          </div>
        )
      ) : (
        <p>
          Looking for your wishlist? Sign in or create an account to see and
          shop your favourite items.
        </p>
      )}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          content: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            borderRadius: "10px",
            width: "400px",
            height: "100px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <p>
          Are you sure you want to remove{" "}
          <span>
            {wishlistItems.find((item) => item._id === selectedItemId)?.name}
          </span>{" "}
          from your wishlist?
        </p>
        <div className={styles.modal_buttons}>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Wishlist;
