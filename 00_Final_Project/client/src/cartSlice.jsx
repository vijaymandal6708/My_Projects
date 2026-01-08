import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const cartSlice = createSlice({
  name: "mycart",
  initialState: {
    cart: savedCart,
    wishlist: savedWishlist,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.qnty += 1;
      } else {
        state.cart.push({
          id: item.id,
          name: item.name,
          category: item.category?.toLowerCase(),
          price: item.price,
          image: item.image,
          description: item.description,
          qnty: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    increaseQuantity: (state, action) => {
      const item = state.cart.find(
        (cartItem) => cartItem.id === action.payload.id
      );
      if (item) item.qnty += 1;

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    decreaseQuantity: (state, action) => {
      const item = state.cart.find(
        (cartItem) => cartItem.id === action.payload.id
      );
      if (item && item.qnty > 1) item.qnty -= 1;

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.id !== action.payload.id
      );

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    clearCart: (state) => {
      state.cart = [];
    },

    addToWishlist: (state, action) => {
      const exists = state.wishlist.find(
        (item) => item.id === action.payload.id
      );
      if (!exists) {
        state.wishlist.push(action.payload);
        localStorage.setItem(
          "wishlist",
          JSON.stringify(state.wishlist)
        );
      }
    },

    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item.id !== action.payload.id
      );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(state.wishlist)
      );
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
