import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "mycart",
  initialState: {
    cart: [],
    wishlist: [],
  },

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.qnty += 1;
      } else {
        state.cart.push({ ...item, qnty: 1 });
      }
      // No need for localStorage.setItem here
    },

    increaseQuantity: (state, action) => {
      const item = state.cart.find((cartItem) => cartItem.id === action.payload.id);
      if (item) item.qnty += 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.cart.find((cartItem) => cartItem.id === action.payload.id);
      if (item && item.qnty > 1) item.qnty -= 1;
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },

    clearCart: (state) => {
      state.cart = [];
    },

    addToWishlist: (state, action) => {
      const exists = state.wishlist.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.wishlist.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;