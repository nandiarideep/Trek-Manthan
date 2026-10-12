import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await axios.get('/api/bookings', {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        signal,
      });

      return data.count;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to load bookings'
      );
    }
  },
  {
    condition: (_, { getState }) => getState().bookings.status !== 'loading',
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load bookings';
      });
  },
});

export default bookingsSlice.reducer;