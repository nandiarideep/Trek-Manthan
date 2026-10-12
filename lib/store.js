import { configureStore } from '@reduxjs/toolkit';
import inquiriesReducer from '@/lib/features/inquiries/inquiriesSlice';
import visitsReducer from '@/lib/features/visits/visitsSlice';
import bookingsReducer from '@/lib/features/bookings/bookingsSlice';
import destinationsReducer from '@/lib/features/destinations/destinationsSlice'; // Placeholder for destinations reducer

export function makeStore() {
  return configureStore({
    reducer: {
      inquiries: inquiriesReducer,
      visits: visitsReducer,
      bookings: bookingsReducer,
      destinations: destinationsReducer,
    },
  });
}