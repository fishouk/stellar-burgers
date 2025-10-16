import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

export interface UserOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      });
  }
});

export default userOrdersSlice.reducer;
