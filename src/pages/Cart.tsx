import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem, Product } from "../types"; // CartItem should include properties like variantId, selectedSize, and selectedColour
import styles from "../styles/home/Cart.module.css";
import { FaTrash } from "react-icons/fa";
import Button from "../components/global/Button";
import { updateCartQuantity } from "../utils/updateCartQuantity";
import api from "../api";
import { toast } from "react-toastify"; // Import react-toastify

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

const Cart = () => {
  // State for the cart items and the loading indicator
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // Retrieve the authentication token from localStorage (if available)
  const token = localStorage.getItem("token");

  // Helper function to retrieve guest cart items from localStorage
  const getGuestCart = (): LocalCartItem[] => {
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  };

  // Helper function to update guest cart items in localStorage
  const setGuestCart = (items: LocalCartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  };

  // Function to sync guest cart items with the server when a user logs in
  const syncGuestCart = async (guestItems: CartItem[]) => {
    for (const item of guestItems) {
      try {
        // Post each guest cart item to the server
        await api.post<{ message: string }>(
          "/cart",
          {
            productId: item.product._id,
            variantId: item.variantId,
            quantity: item.quantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error: any) {
        console.error("Error syncing guest cart:", error.message);
      }
    }
    // Remove guest cart from localStorage after syncing
    localStorage.removeItem(GUEST_CART_KEY);
  };

  // Load the cart items when the component mounts or when the token changes
  useEffect(() => {
    const loadCart = async () => {
      if (token) {
        // Retrieve guest cart items from localStorage
        const guestItems = getGuestCart();

        // If there are guest cart items, synchronize them with the server
        if (guestItems.length > 0) {
          await syncGuestCart(guestItems);
        }

        try {
          // Fetch the updated cart items from the server using the auth token
          const response = await api.get<{ items: CartItem[] }>("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const items = response.data.items;

          // Combine items with the same product and variant by summing their quantities
          const combinedItems = items.reduce((map, item) => {
            const key = item.product._id + "-" + item.variantId;
            const existingItem = map.get(key);

            if (existingItem) {
              // If an item with the same key exists, sum their quantities
              return map.set(key, {
                ...item,
                quantity: existingItem.quantity + item.quantity,
              });
            }

            // Otherwise, set the new item for this key
            return map.set(key, item);
          }, new Map());

          // Update the cartItems state with the combined items
          setCartItems(Array.from(combinedItems.values()));
        } catch (error: any) {
          console.error("Error fetching cart:", error.message);
        } finally {
          // End the loading state regardless of success or error
          setIsLoading(false);
        }
      } else {
        // For guest users: load cart items from localStorage
        const guestCart = getGuestCart();
        setCartItems(guestCart);
        setIsLoading(false);
      }
    };
    // Execute the loadCart function
    loadCart();
  }, [token]);

  // Function to handle removal of an item from the cart
  const handleRemove = async (
    productId: string,
    variantId: string,
    product: Product
  ) => {
    if (token) {
      try {
        // Delete the item from the server cart using the provided product and variant IDs
        await api.delete(`/cart/${productId}/${variantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out the removed item from the local state
        const updated = cartItems.filter(
          (item) =>
            !(item.product._id === productId && item.variantId === variantId)
        );
        setCartItems(updated);
      } catch (error: any) {
        console.error("Error removing item from cart:", error.message);
      }
    } else {
      // For guest users, remove the item locally and update localStorage
      const updated = cartItems.filter(
        (item) =>
          !(item.product._id === productId && item.variantId === variantId)
      );
      setCartItems(updated);
      setGuestCart(updated);
      toast.success(`${product.name} removed from cart`);
    }
  };

  // Function to handle quantity changes by calling the updateCartQuantity utility function
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
  };

  // Function to calculate the total price of all items in the cart
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // Function to handle "Proceed to checkout" click
  const handleProceedCheckout = () => {
    if (!token) {
      // Show a toast message for guest users telling them to log in or sign up
      toast.info("Please log in or sign up to proceed to checkout.");
    } else {
      // If the user is logged in, navigate to the checkout page
      navigate("/checkout");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      {isLoading ? (
        // Show loading message while the cart is being loaded
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        // Inform the user if the cart is empty
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
                    {/* Display product thumbnail */}
                    <img src={item.product.images[0]} alt={item.product.name} />
                  </td>
                  <td>
                    {/* Link to the product detail page */}
                    <a
                      href={`/product/${item.product.name
                        .toLowerCase()
                        .replace(/ /g, "-")}-${item.product._id}`}
                    >
                      {item.product.name}
                    </a>
                  </td>
                  <td>
                    {/* Show variant details if available */}
                    {item.selectedSize && item.selectedColour
                      ? `${item.selectedSize} / ${item.selectedColour}`
                      : "Default"}
                  </td>
                  <td>${item.product.price}</td>
                  <td>
                    {/* Quantity selector; triggers handleQuantityChange on change */}
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
                    {/* Remove button to delete the item from the cart */}
                    <FaTrash
                      className={styles.remove}
                      size={20}
                      onClick={() =>
                        handleRemove(
                          item.product._id,
                          item.variantId,
                          item.product
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {/* <p>
                <strong>Items:</strong>{" "}
                <span>
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </p> */}
              {/* Button to proceed to checkout */}
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
