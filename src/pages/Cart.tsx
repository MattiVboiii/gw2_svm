import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Product } from "../types";
import styles from "./Cart.module.css";

const Cart = () => {
  const products = useSelector(
    (state: RootState) => state.productsSlice.products
  );
  const cartProducts = products.filter((product: Product) => product.inCart);

  const calculateTotal = () => {
    return cartProducts.reduce(
      (total: number, product: Product) => total + product.price,
      0
    );
  };

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      {cartProducts.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className={styles.products}>
          {cartProducts.map((product: Product) => (
            <div key={product._id} className={styles.product}>
              <img src={product.images[0]} alt={product.name} />
              <div>
                <h2>{product.name}</h2>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ${product.price}</p>
              </div>
            </div>
          ))}
          <div className={styles.total}>
            <h2>Total: ${calculateTotal()}</h2>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;
