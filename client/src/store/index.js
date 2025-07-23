import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import requestsSlice from './slices/requestsSlice';
import assetsSlice from './slices/assetsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    requests: requestsSlice,
    assets: assetsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});