import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import assetReducer from "./slices/assetSlice";
import requestReducer from "./slices/requestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
    requests: requestReducer,
  },
});
