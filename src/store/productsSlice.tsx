import { Action } from "redux";
import { RootState } from ".";
import { Product, ProductsState } from "../types";
import api from "../api";
import { Dispatch } from "redux";

// Normalizes category names into slug format for reliable comparison
const normalizeCategory = (cat: string) =>
  cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Initial state: stores the list of products, filtered products, and current page
const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  flashSales: [], // flash sales section
  bestSelling: [], //  best selling section
  currentPage: 1,
  productsPerPage: 5,
};

// Action types
const GET_PRODUCTS = "GET_PRODUCTS";
const FILTER_PRODUCTS = "FILTER_PRODUCTS";
const SET_PAGE = "SET_PAGE";
const SET_PRODUCTS_PER_PAGE = "SET_PRODUCTS_PER_PAGE";

// Added: action for custom sections
const SET_PRODUCTS_BY_SECTION = "SET_PRODUCTS_BY_SECTION";

// Action creators: functions to dispatch actions
export const getProducts = (products: Product[]) => ({
  type: GET_PRODUCTS,
  payload: products,
});

// Updated filterProducts action creator:
export const filterProducts = (
  filter:
    | { type: "category"; value: string }
    | { type: "subcategory"; value: { sub: string; category: string } }
) => ({
  type: FILTER_PRODUCTS,
  payload: filter,
});

export const setPage = (page: number) => ({
  type: SET_PAGE,
  payload: page,
});

export const setProductsPerPage = (productsPerPage: number) => ({
  type: SET_PRODUCTS_PER_PAGE,
  payload: productsPerPage,
});

// Added: assign products into FlashSales & BestSelling (centralized separation)
export const setProductsBySection = (sections: {
  flashSales: Product[];
  bestSelling: Product[];
}) => ({
  type: SET_PRODUCTS_BY_SECTION,
  payload: sections,
});

// Async action to fetch products from API using Axios
export const fetchProducts = () => async (dispatch: Dispatch) => {
  try {
    const response = await api.get<Product[]>("/products"); // Fetches products from API

    const shuffled = [...response.data].sort(() => 0.5 - Math.random());

    const flashSales = shuffled.slice(0, 8); // Use for -35% discount
    const bestSelling = shuffled.slice(8, 16); // Use for -20% discount

    dispatch(getProducts(response.data));
    dispatch(setProductsBySection({ flashSales, bestSelling }));
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

    //  filterProducts reducer
    case FILTER_PRODUCTS: {
      const payload = action.payload;

      // Filtering by category
      if (payload.type === "category") {
        const normalizedValue = normalizeCategory(payload.value);
        if (!normalizedValue || normalizedValue === "all") {
          return {
            ...state,
            filteredProducts: state.products,
          };
        }
        return {
          ...state,
          filteredProducts: state.products.filter(
            (product) =>
              normalizeCategory(product.category?.name || "") ===
              normalizedValue
          ),
        };
      }

      // Filtering by subcategory (with parent category)
      if (payload.type === "subcategory") {
        const { sub, category } = payload.value;
        const normalizedSub = normalizeCategory(sub);
        const normalizedCat = normalizeCategory(category);

        return {
          ...state,
          filteredProducts: state.products.filter(
            (product) =>
              normalizeCategory(product.subcategory?.name || "") ===
                normalizedSub &&
              normalizeCategory(product.category?.name || "") === normalizedCat
          ),
        };
      }

      return state;
    }

    case SET_PRODUCTS_BY_SECTION:
      return {
        ...state,
        flashSales: action.payload.flashSales, // store flash sales
        bestSelling: action.payload.bestSelling, // store best selling
      };

    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload, // Updates the current page
      };

    case SET_PRODUCTS_PER_PAGE:
      return {
        ...state,
        productsPerPage: action.payload,
      };

    default:
      return state; // Returns the existing state if action type is unknown
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

// New selectors for distributed product sections
export const selectFlashSales = (state: RootState) =>
  state.productsSlice.flashSales;
export const selectBestSelling = (state: RootState) =>
  state.productsSlice.bestSelling;

export default productsReducer;
