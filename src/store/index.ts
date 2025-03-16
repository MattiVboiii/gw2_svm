import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import productsSlice from './productsSlice';

const rootReducer = combineReducers({
  productsSlice: productsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
const store = createStore(rootReducer, applyMiddleware(logger));

export default store;
