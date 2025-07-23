import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import assetReducer from './slices/assetslice';
import requestReducer from './slices/requestslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
    requests: requestReducer,
  },
});
