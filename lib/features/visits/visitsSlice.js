import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchVisits = createAsyncThunk(
  'visits/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await axios.get('/api/visits', {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        signal,
      });

      return data.count;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to load visits'
      );
    }
  },
  {
    condition: (_, { getState }) => getState().visits.status !== 'loading',
  }
);

const visitsSlice = createSlice({
  name: 'visits',
  initialState: {
    count: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.count = action.payload;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load visits';
      });
  },
});

export default visitsSlice.reducer;