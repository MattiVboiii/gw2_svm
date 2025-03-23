import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; // Add redux-thunk for async actions
import logger from "redux-logger";
import productsSlice from "./productsSlice";

const rootReducer = combineReducers({
  productsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunk, logger)); // Apply thunk and logger

export default store;
