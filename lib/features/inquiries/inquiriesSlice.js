import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await fetch('/api/inquiries', {
        cache: 'no-store',
        signal,
      });
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || 'Failed to load inquiries');
      }

      return Array.isArray(result.inquiries) ? result.inquiries : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load inquiries');
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