import { useEffect, useState } from "react";
import { CartItem } from "../types";
import styles from "../styles/home/Cart.module.css";
import { FaTrash } from "react-icons/fa";
import Button from "../components/global/Button";
import api from "../api";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      (async () => {
        setIsLoading(true);
        try {
          const response = await api.get<{ items: CartItem[] }>("/cart", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const items = response.data.items;
          const combinedItems = items.reduce((map, item) => {
            const existingItem = map.get(item.product._id);
            if (existingItem) {
              return map.set(item.product._id, {
                ...item,
                quantity: existingItem.quantity + item.quantity,
              });
            }
            return map.set(item.product._id, item);
          }, new Map());
          setCartItems(Array.from(combinedItems.values()));
        } catch (error: any) {
          console.error("Error fetching cart:", error.message);
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
      const items = cartItems.filter((item) => item.product._id !== productId);
      setCartItems(items);
      await api.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error: any) {
      console.error("Error removing item from cart:", error.message);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
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
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={item.product.images[0]} alt={item.product.name} />
                  </td>
                  <td>
                    <a
                      href={`/product/${item.product.name
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                    >
                      {item.product.name}
                    </a>
                  </td>
                  <td>${item.product.price}</td>
                  <td>
                    <select
                      className={styles.quantity_selector}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product._id,
                          parseInt(e.target.value)
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
                      onClick={() => handleRemove(item.product._id)}
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
              <Button
                variant="primary"
                size="large"
                className={styles.proceed_checkout}
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
