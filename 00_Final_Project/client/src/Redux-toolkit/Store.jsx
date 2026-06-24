import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

import myReducer from "./cartSlice";
import authReducer from "./authSlice";
import orderReducer from "./orderSlice"; // 1. Import your new order slice

const persistConfig = {
  key: 'root',
  storage,
  // 2. Add 'order' to the whitelist so order data persists on refresh
  whitelist: ['mycart', 'auth', 'order'], 
};

const rootReducer = combineReducers({
  mycart: myReducer,
  auth: authReducer,
  order: orderReducer, // 3. Register the order reducer here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);