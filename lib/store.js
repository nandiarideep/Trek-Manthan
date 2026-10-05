import { configureStore } from '@reduxjs/toolkit';
import inquiriesReducer from '@/lib/features/inquiries/inquiriesSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      inquiries: inquiriesReducer,
    },
  });
}