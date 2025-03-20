import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import productsSlice from "./productsSlice";
import cartSlice from "./CartSlice";

const rootReducer = combineReducers({
  productsSlice: productsSlice,
  cartSlice: cartSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
const store = createStore(rootReducer, applyMiddleware(logger));

export default store;
