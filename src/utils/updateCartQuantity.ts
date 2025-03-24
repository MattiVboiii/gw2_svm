import api from "../api";
import { CartItem } from "../types";

// Update cart item quantity (handles both logged-in and guest users)
export const updateCartQuantity = async (
  token: string | null,
  cartItems: CartItem[],
  setCartItems: (items: CartItem[]) => void,
  setGuestCart: (items: CartItem[]) => void,
  productId: string,
  variantId: string,
  newQuantity: number
) => {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  if (newQuantity <= 0) {
    // Remove item from cart when newQuantity is 0 or less.
    const updated = cartItems.filter(
      (item) =>
        !(item.product._id === productId && item.variantId === variantId)
    );

    if (token) {
      try {
        await api.delete(`/cart/${productId}/${variantId}`, {
          headers: authHeaders,
        });
      } catch (error: any) {
        console.error("Error removing item:", error.message);
      }
    }
    setCartItems(updated);
    if (!token) {
      setGuestCart(updated);
    }
    // Dispatch "cartUpdated" event once after deletion.
    window.dispatchEvent(new Event("cartUpdated"));
    return;
  }

  if (token) {
    try {
      // Remove the old item before updating.
      await api.delete(`/cart/${productId}/${variantId}`, {
        headers: authHeaders,
      });
      // Add the item with the new quantity.
      await api.post(
        "/cart",
        { productId, variantId, quantity: newQuantity },
        { headers: authHeaders }
      );
      // Fetch updated cart data from the server.
      const response = await api.get<{ items: CartItem[] }>("/cart", {
        headers: authHeaders,
      });
      setCartItems(response.data.items);
    } catch (error: any) {
      console.error("Error updating cart quantity:", error.message);
    }
  } else {
    // Update guest cart locally.
    const updated = cartItems.map((item) =>
      item.product._id === productId && item.variantId === variantId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updated);
    setGuestCart(updated);
  }

  // Dispatch "cartUpdated" event once after any update.
  window.dispatchEvent(new Event("cartUpdated"));
};
