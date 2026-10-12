import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDestinations = createAsyncThunk(
    'destinations/fetchAll',
    async (_, { rejectWithValue, signal }) => {
        try {
            const { data } = await axios.get('/api/destinations', {
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
                signal,
            });

            return Array.isArray(data.destinations) ? data.destinations : [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to load destinations'
            );
        }
    },
    {
        condition: (_, { getState }) => getState().destinations.status !== 'loading',
    }
);

const destinationsSlice = createSlice({
    name: 'destinations',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDestinations.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDestinations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchDestinations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message || 'Failed to load destinations';
            });
    },
});

export default destinationsSlice.reducer;