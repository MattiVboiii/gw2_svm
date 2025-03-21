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
  // Create headers for auth if token is available
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  if (newQuantity <= 0) {
    // If new quantity is zero or less, remove the item completely
    const updated = cartItems.filter(
      (item) =>
        !(item.product._id === productId && item.variantId === variantId)
    );

    if (token) {
      try {
        // Remove the item from the server's cart if user is logged in
        await api.delete(`/cart/${productId}/${variantId}`, {
          headers: authHeaders,
        });
      } catch (error: any) {
        console.error("Error removing item:", error.message);
      }
    }

    // Update local state with the filtered cart items
    setCartItems(updated);
    // For guest users update the locally stored guest cart
    if (!token) setGuestCart(updated);
    return;
  }

  if (token) {
    try {
      // For logged-in users: update quantity by simulating PUT via DELETE + POST

      // First, remove the existing item from the server cart
      await api.delete(`/cart/${productId}/${variantId}`, {
        headers: authHeaders,
      });

      // Then, add the item back with the updated quantity
      await api.post(
        "/cart",
        { productId, variantId, quantity: newQuantity },
        { headers: authHeaders }
      );

      // Fetch the updated cart from the server
      const response = await api.get<{ items: CartItem[] }>("/cart", {
        headers: authHeaders,
      });

      // Update the local state with the cart items received from the server
      setCartItems(response.data.items);
    } catch (error: any) {
      console.error("Error updating cart quantity:", error.message);
    }
  } else {
    // For guest users, update the cart locally:
    // Map over the cartItems and update the quantity for the matching item.
    const updated = cartItems.map((item) =>
      item.product._id === productId && item.variantId === variantId
        ? { ...item, quantity: newQuantity }
        : item
    );
    // Update the state with the new cart items
    setCartItems(updated);
    // Also update the guest cart stored in localStorage (or wherever it's managed)
    setGuestCart(updated);
  }
};
