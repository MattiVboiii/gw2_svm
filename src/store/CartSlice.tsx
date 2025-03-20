import { Action } from "redux";
import { RootState } from ".";
import { Cart, Product } from "../types";
import api from "../api";
import { Dispatch } from "redux";

// Initial state: stores the list of products, filtered products, and current page
const initialState: Cart = {
  _id: "",
  user: "",
  items: [],
  total: 0,
  createdAt: "",
  updatedAt: "",
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";

// Action creators: functions to dispatch actions
export const addToCart = (
  product: Product,
  variantId: string,
  quantity: number
) => ({
  type: ADD_TO_CART,
  payload: { product, variantId, quantity },
});

export const removeFromCart = (id: string) => ({
  type: REMOVE_FROM_CART,
  payload: id,
});

export const updateQuantity = (id: string, newQuantity: number) => ({
  type: UPDATE_QUANTITY,
  payload: { id, newQuantity },
});

// Async action to fetch products from API using Axios
export const fetchCart = () => async (dispatch: Dispatch) => {
  try {
    const response = await api.get<Cart>("/cart"); // Fetches cart from API
    dispatch(addToCart(response.data.items));
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

// Generic action type with payload
interface ActionWithPayload<T> extends Action {
  payload: T;
}

// Reducer: handles state updates based on dispatched actions
const cartReducer = (state = initialState, action: ActionWithPayload<any>) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { product, variantId, quantity } = action.payload;
      const existingProduct = state.items.find(
        (p) => p.variantId === variantId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        state.items.push({
          product,
          variantId,
          quantity,
          _id: `${product._id}-${variantId}`,
        });
      }
      state.total += product.price * quantity;
      return state;
    case REMOVE_FROM_CART:
      const id = action.payload;
      const productToRemove = state.items.find((p) => p._id === id);
      if (productToRemove) {
        state.total -= productToRemove.product.price * productToRemove.quantity;
        state.items = state.items.filter((p) => p._id !== id);
      }
      return state;
    case UPDATE_QUANTITY:
      const { id: idToUpdate, newQuantity } = action.payload;
      const productToUpdate = state.items.find((p) => p._id === idToUpdate);
      if (productToUpdate) {
        state.total -= productToUpdate.product.price * productToUpdate.quantity;
        productToUpdate.quantity = newQuantity;
        state.total += productToUpdate.product.price * newQuantity;
      }
      return state;
    default:
      return state; // Returns the existing state if action type is unknown
  }
};

// Selectors: functions to get specific data from Redux state
export const selectCartItems = (state: RootState) => state.cartSlice.items;
export const selectCartTotal = (state: RootState) => state.cartSlice.total;
export default cartReducer;
