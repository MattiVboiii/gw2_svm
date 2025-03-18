import { UnknownAction } from 'redux';
import { RootState } from '.';
import { Product, ProductsState } from '../types';

// initial state
const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  currentPage: 1,
};

// ACTION TYPES
const GET_PRODUCTS = 'GET_PRODUCTS';
const FILTER_PRODUCTS = 'FILTER_PRODUCTS';
const SET_PAGE = 'SET_PAGE';

// ACTION CREATORS
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

// REDUCER
const productsReducer = (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
      };
    case FILTER_PRODUCTS:
      return {
        ...state,
        filteredProducts: state.products.filter(
          (product) => product.category.name === action.payload
        ),
      };
    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload as number,
      };
    default:
      return state;
  }
};

export const selectProducts = (storeState: RootState) =>
  storeState.productsSlice.products;
export const selectFilteredProducts = (storeState: RootState) =>
  storeState.productsSlice.filteredProducts;
export const selectCurrentPage = (storeState: RootState) =>
  storeState.productsSlice.currentPage;

export default productsReducer;
