import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem, Product } from "../types"; // CartItem should include properties like variantId, selectedSize, and selectedColour
import styles from "../styles/home/Cart.module.css";
import { FaTrash } from "react-icons/fa";
import Button from "../components/global/Button";
import { updateCartQuantity } from "../utils/updateCartQuantity";
import api from "../api";
import { toast } from "react-toastify"; // Import react-toastify
import Modal from "react-modal";

Modal.setAppElement("#root");

// Key used to store/read the guest cart from localStorage
const GUEST_CART_KEY = "guestCart";

export interface LocalCartItem {
  product: Product;
  variantId: string;
  quantity: number;
  _id: string;
  selectedSize?: string;
  selectedColour?: string;
}

// (imports remain unchanged)

const Cart = () => {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getGuestCart = (): LocalCartItem[] => {
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  };

  const setGuestCart = (items: LocalCartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  };

  const syncGuestCart = async () => {
    if (!token) return;

    // Read guest items and immediately clear the guest cart to prevent duplicate syncing.
    const storedGuestItems = getGuestCart();
    if (storedGuestItems.length === 0) return;
    // Clear guest cart immediately to avoid re-syncing on subsequent renders.
    localStorage.removeItem(GUEST_CART_KEY);

    try {
      // Aggregate guest items by product._id and variantId.
      const aggregatedGuestItems = Object.values(
        storedGuestItems.reduce((acc, guestItem) => {
          const key = guestItem.product._id + "-" + guestItem.variantId;
          if (acc[key]) {
            acc[key].quantity += guestItem.quantity;
          } else {
            acc[key] = { ...guestItem };
          }
          return acc;
        }, {} as Record<string, CartItem>)
      );

      // Fetch the current server cart.
      const serverRes = await api.get<{ items: CartItem[] }>("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const serverItems = serverRes.data.items;

      // Process each aggregated guest item.
      for (const guestItem of aggregatedGuestItems) {
        const existingItem = serverItems.find(
          (item) =>
            item.product._id === guestItem.product._id &&
            item.variantId === guestItem.variantId
        );
        if (existingItem) {
          // Merge quantities if item already exists.
          const newQuantity = existingItem.quantity + guestItem.quantity;
          try {
            // Update the server cart item with the new quantity.
            await api.delete(
              `/cart/${guestItem.product._id}/${guestItem.variantId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await api.post(
              "/cart",
              {
                productId: guestItem.product._id,
                variantId: guestItem.variantId,
                quantity: newQuantity,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (updateError: any) {
            console.error(
              `Error updating quantity for ${guestItem.product._id}:`,
              updateError.message
            );
          }
        } else {
          // Add a new item if it doesn't exist.
          try {
            await api.post(
              "/cart",
              {
                productId: guestItem.product._id,
                variantId: guestItem.variantId,
                quantity: guestItem.quantity,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (addError: any) {
            console.error(
              `Error adding product ${guestItem.product._id}:`,
              addError.message
            );
          }
        }
      }
      // Dispatch the cartUpdated event once after syncing.
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error: any) {
      console.error("Error syncing guest cart:", error.message);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      if (token) {
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          await syncGuestCart();
        }

        try {
          const response = await api.get<{ items: CartItem[] }>("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const items = response.data.items;
          const combinedItems = items.reduce((map, item) => {
            const key = item.product._id + "-" + item.variantId;
            const existingItem = map.get(key);
            if (existingItem) {
              return map.set(key, {
                ...item,
                quantity: existingItem.quantity + item.quantity,
              });
            }
            return map.set(key, item);
          }, new Map());

          setCartItems(Array.from(combinedItems.values()));
        } catch (error: any) {
          console.error("Error fetching cart:", error.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        const guestCart = getGuestCart();
        setCartItems(guestCart);
        setIsLoading(false);
      }
    };
    loadCart();
  }, [token]);

  const handleRemove = async (
    productId: string,
    variantId: string,
    product: Product
  ) => {
    if (token) {
      try {
        await api.delete(`/cart/${productId}/${variantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = cartItems.filter(
          (item) =>
            !(item.product._id === productId && item.variantId === variantId)
        );
        setCartItems(updated);
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${product.name} removed from cart`)
      } catch (error: any) {
        console.error("Error removing item from cart:", error.message);
      }
    } else {
      const updated = cartItems.filter(
        (item) =>
          !(item.product._id === productId && item.variantId === variantId)
      );
      setCartItems(updated);
      setGuestCart(updated);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} removed from cart`);
    }
  };

  const handleQuantityChange = (
    productId: string,
    variantId: string,
    quantity: number,
    product: Product
  ) => {
    updateCartQuantity(
      token,
      cartItems,
      setCartItems,
      setGuestCart,
      productId,
      variantId,
      quantity
    );
    toast.success(`${product.name} quantity updated to ${quantity}`);

    // Explicitly dispatch the "cartUpdated" event so the Navbar updates immediately.
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleProceedCheckout = () => {
    if (!token) {
      toast.info("Please log in or sign up to proceed to checkout.");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className={styles.cart_content}>
          <table className={styles.cart_table}>
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Variant</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={`${item.product._id}-${item.variantId}`}>
                  <td>
                    <img src={item.product.images[0]} alt={item.product.name} />
                  </td>
                  <td>
                    <a
                      href={`/product/${item.product.name
                        .toLowerCase()
                        .replace(/ /g, "-")}-${item.product._id}`}
                    >
                      {item.product.name}
                    </a>
                  </td>
                  <td>
                    {item.selectedSize && item.selectedColour
                      ? `${item.selectedSize} / ${item.selectedColour}`
                      : "Default"}
                  </td>
                  <td>${item.product.price}</td>
                  <td>
                    <select
                      className={styles.quantity_selector}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product._id,
                          item.variantId,
                          parseInt(e.target.value),
                          item.product
                        )
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>${item.product.price * item.quantity}</td>
                  <td>
                    <FaTrash
                      className={styles.remove}
                      size={20}
                      onClick={() => {
                        setSelectedItemId(
                          `${item.product._id}-${item.variantId}`
                        );
                        setShowModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <p>Are you sure you want to remove this item from your cart?</p>
            <div className={styles.modal_buttons}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const [productId, variantId] = selectedItemId!.split("-");
                  const item = cartItems.find(
                    (item) =>
                      item.product._id === productId &&
                      item.variantId === variantId
                  );
                  if (item) handleRemove(productId, variantId, item.product);
                  setShowModal(false);
                }}
              >
                Remove
              </Button>
            </div>
          </Modal>
          <div>
            <div className={styles.cart_total}>
              <h2>Cart Total</h2>
              <p>
                Subtotal: <span>${calculateTotal()}</span>
              </p>
              <p>
                Shipping: <span>Free</span>
              </p>
              <p>
                <strong>Total:</strong> <span>${calculateTotal()}</span>
              </p>
              <Button
                variant="primary"
                size="large"
                className={styles.proceed_checkout}
                onClick={handleProceedCheckout}
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
