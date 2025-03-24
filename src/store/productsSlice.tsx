// src/store/productsSlice.ts

import { AnyAction } from "redux";
import { Product, ProductsState } from "../types";
import api from "../api";
import { Dispatch } from "redux";
import { RootState } from "./index";

// Utility: Normalizes category names into slug format
const normalizeCategory = (cat: string) =>
  cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Initial state
const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  flashSales: [],
  bestSelling: [],
  currentPage: 1,
  productsPerPage: 5,
};

// Action types
const GET_PRODUCTS = "GET_PRODUCTS";
const FILTER_PRODUCTS = "FILTER_PRODUCTS";
const SET_PAGE = "SET_PAGE";
const SET_PRODUCTS_PER_PAGE = "SET_PRODUCTS_PER_PAGE";
const SET_PRODUCTS_BY_SECTION = "SET_PRODUCTS_BY_SECTION";

// Action creators
export const getProducts = (products: Product[]) => ({
  type: GET_PRODUCTS,
  payload: products,
});

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

export const setProductsBySection = (sections: {
  flashSales: Product[];
  bestSelling: Product[];
}) => ({
  type: SET_PRODUCTS_BY_SECTION,
  payload: sections,
});

// Async thunk to fetch products
export const fetchProducts = () => async (dispatch: Dispatch) => {
  try {
    const response = await api.get<Product[]>("/products");

    const shuffled = [...response.data].sort(() => 0.5 - Math.random());
    const flashSales = shuffled.slice(0, 8);
    const flashSaleIds = new Set(flashSales.map((product) => product._id));
    const remainingProducts = shuffled.filter((p) => !flashSaleIds.has(p._id));
    const bestSelling = remainingProducts.slice(0, 8);

    dispatch(getProducts(response.data));
    dispatch(setProductsBySection({ flashSales, bestSelling }));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Reducer (uses AnyAction for compatibility with configureStore)
const productsReducer = (
  state = initialState,
  action: AnyAction
): ProductsState => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
      };

    case FILTER_PRODUCTS: {
      const payload = action.payload;

      if (payload.type === "category") {
        const normalizedValue = normalizeCategory(payload.value);
        if (!normalizedValue || normalizedValue === "all") {
          return { ...state, filteredProducts: state.products };
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
        flashSales: action.payload.flashSales,
        bestSelling: action.payload.bestSelling,
      };

    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case SET_PRODUCTS_PER_PAGE:
      return {
        ...state,
        productsPerPage: action.payload,
      };

    default:
      return state;
  }
};

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectFilteredProducts = (state: RootState) =>
  state.products.filteredProducts;
export const selectCurrentPage = (state: RootState) =>
  state.products.currentPage;
export const selectProductsPerPage = (state: RootState) =>
  state.products.productsPerPage;
export const selectFlashSales = (state: RootState) =>
  state.products.flashSales || [];
export const selectBestSelling = (state: RootState) =>
  state.products.bestSelling;

export default productsReducer;
