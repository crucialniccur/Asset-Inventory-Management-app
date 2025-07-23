import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await api.get('/assets', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch assets');
    }
  }
);

export const createAsset = createAsyncThunk(
  'assets/createAsset',
  async (assetData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await api.post('/assets', assetData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create asset');
    }
  }
);

export const updateAsset = createAsyncThunk(
  'assets/updateAsset',
  async ({ assetId, assetData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await api.put(`/assets/${assetId}`, assetData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update asset');
    }
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/deleteAsset',
  async (assetId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await api.delete(`/assets/${assetId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return assetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete asset');
    }
  }
);

const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    assets: [],
    categories: [],
    isLoading: false,
    error: null,
    filters: {
      category: 'all',
      status: 'all',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assets
      .addCase(fetchAssets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create asset
      .addCase(createAsset.fulfilled, (state, action) => {
        state.assets.unshift(action.payload);
      })
      // Update asset
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.assets.findIndex(asset => asset.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
      })
      // Delete asset
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter(asset => asset.id !== action.payload);
      });
  },
});

export const { setFilters, clearError } = assetsSlice.actions;
export default assetsSlice.reducer;