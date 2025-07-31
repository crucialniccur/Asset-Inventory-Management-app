import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import assetsReducer from './slices/assetsSlice';
import requestsReducer from './slices/requestsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetsReducer,
    requests: requestsReducer,
  },
});
export default store;