import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: null, 
    role: null, 
    isAuthenticated: false 
  },
  reducers: {
    // This function handles updating the state for both user and admin
    setAuth: (state, action) => {
      state.user = action.payload.data;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    }
  }
});

// ✅ EXPORT THE ACTIONS HERE
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;