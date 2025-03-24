// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
