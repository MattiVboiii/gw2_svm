import { useState } from "react";
import { Product } from "../types";
import styles from "../styles/home/Cart.module.css";
import { FaTrash } from "react-icons/fa";
import Button from "../components/global/Button";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([
    {
      _id: "1",
      name: "LCD Monitor",
      images: ["https://picsum.photos/200/300"],
      price: 650,
      quantity: 1,
      inCart: true,
    },
    {
      _id: "2",
      name: "H1 Gamepad",
      images: ["https://picsum.photos/200/301"],
      price: 550,
      quantity: 2,
      inCart: true,
    },
  ]);

  const handleRemove = (id: string) => {
    setCartProducts(cartProducts.filter((product) => product._id !== id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartProducts(
      cartProducts.map((product) =>
        product._id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const calculateTotal = () => {
    return cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      {cartProducts.length === 0 ? (
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
              {cartProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.images[0]} alt={product.name} />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <select
                      className={styles.quantity_selector}
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          product._id,
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
                  <td>${product.price * product.quantity}</td>
                  <td>
                    <FaTrash
                      className={styles.remove}
                      onClick={() => handleRemove(product._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            {/* <div className={styles.coupon_section}>
              <input type="text" placeholder="Coupon Code" />
              <Button variant="primary" size="small">
                Apply Coupon
              </Button>
            </div> */}

            {/* Cart Total Section */}
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
