import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await axios.get('/api/inquiries', {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        signal,
      });

      return Array.isArray(data.inquiries) ? data.inquiries : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to load inquiries'
      );
    }
  },
  {
    condition: (_, { getState }) => getState().inquiries.status !== 'loading',
  }
);

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load inquiries';
      });
  },
});

export default inquiriesSlice.reducer;