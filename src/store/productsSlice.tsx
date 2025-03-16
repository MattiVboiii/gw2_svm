import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';
import { RootState } from '.';

export interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  currentPage: 1,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    filterProducts: (state, action: PayloadAction<string>) => {
      state.filteredProducts = state.products.filter((product) =>
        product.category.includes(action.payload)
      );
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { getProducts, filterProducts, setPage } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;
export const selectFilteredProducts = (state: RootState) =>
  state.products.filteredProducts;
export const selectCurrentPage = (state: RootState) =>
  state.products.currentPage;

export default productsSlice.reducer;
