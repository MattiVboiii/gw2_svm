import { Action } from "redux";
import { RootState } from ".";
import { Product, ProductsState } from "../types";
import api from "../api";
import { Dispatch } from "redux";

// Initial state: stores the list of products, filtered products, and current page
const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  currentPage: 1,
  productsPerPage: 5,
};

// Action types
const GET_PRODUCTS = "GET_PRODUCTS";
const FILTER_PRODUCTS = "FILTER_PRODUCTS";
const SET_PAGE = "SET_PAGE";
const SET_PRODUCTS_PER_PAGE = "SET_PRODUCTS_PER_PAGE";

// Action creators: functions to dispatch actions
export const getProducts = (products: Product[]) => ({
  type: GET_PRODUCTS,
  payload: products,
});

export const filterProducts = (category: string) => ({
  type: FILTER_PRODUCTS,
  payload: category,
});

export const setPage = (page: number) => ({
  type: SET_PAGE,
  payload: page,
});

export const setProductsPerPage = (productsPerPage: number) => ({
  type: SET_PRODUCTS_PER_PAGE,
  payload: productsPerPage,
});

// Async action to fetch products from API using Axios
export const fetchProducts = () => async (dispatch: Dispatch) => {
  try {
    const response = await api.get<Product[]>("/products"); // Fetches products from API
    dispatch(getProducts(response.data));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Generic action type with payload
interface ActionWithPayload<T> extends Action {
  payload: T;
}

// Reducer: handles state updates based on dispatched actions
const productsReducer = (
  state = initialState,
  action: ActionWithPayload<any>
) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload, // Initially, filtered products are the same as all products
      };
    case FILTER_PRODUCTS:
      return {
        ...state,
        filteredProducts: action.payload
          ? state.products.filter(
              (product) =>
                product.category?.name.toLowerCase() ===
                action.payload.toLowerCase()
            )
          : state.products,
      };

    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload, // Updates the current page
      };
    default:
      return state; // Returns the existing state if action type is unknown

    case SET_PRODUCTS_PER_PAGE:
      return {
        ...state,
        productsPerPage: action.payload,
      };
  }
};

// Selectors: functions to get specific data from Redux state
export const selectProducts = (state: RootState) =>
  state.productsSlice.products;
export const selectFilteredProducts = (state: RootState) =>
  state.productsSlice.filteredProducts;
export const selectCurrentPage = (state: RootState) =>
  state.productsSlice.currentPage;
export const selectProductsPerPage = (state: RootState) =>
  state.productsSlice.productsPerPage;

export default productsReducer;
