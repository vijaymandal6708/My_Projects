import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    lastOrder: null,
  },
  reducers: {
    setLastOrder: (state, action) => {
      state.lastOrder = action.payload;
    },
    clearLastOrder: (state) => {
      state.lastOrder = null;
    }
  },
});

export const { setLastOrder, clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;