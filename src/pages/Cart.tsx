import { useEffect, useState } from "react";
import { Product } from "../types";
import styles from "../styles/home/Cart.module.css";
import { FaTrash } from "react-icons/fa";
import Button from "../components/global/Button";
import api from "../api";

interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
  _id: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      (async () => {
        try {
          const response = await api.get<{ items: CartItem[] }>("/cart", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setCartItems(response.data.items);
        } catch (error: any) {
          console.error("Error fetching cart:", error.message);
        }
      })();
    }
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
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
      {cartItems.length === 0 ? (
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
                    <a href={`/product/${generateSlug(item.product.name)}`}>
                      {item.product.name}
                    </a>
                  </td>
                  <td>${item.product.price}</td>
                  <td>
                    <select
                      className={styles.quantity_selector}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, parseInt(e.target.value))
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
                      onClick={() => handleRemove(item._id)}
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
