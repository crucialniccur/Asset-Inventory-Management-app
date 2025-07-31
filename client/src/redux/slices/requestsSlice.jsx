import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all requests
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch requests');
    }
  }
);

// Fetch single request
export const fetchRequest = createAsyncThunk(
  'requests/fetchRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch request');
    }
  }
);

// Create new request
export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await api.post('/requests', requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create request');
    }
  }
);

// Update request
export const updateRequest = createAsyncThunk(
  'requests/updateRequest',
  async ({ id, requestData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update request');
    }
  }
);

// Approve request
export const approveRequest = createAsyncThunk(
  'requests/approveRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/requests/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to approve request');
    }
  }
);

// Reject request
export const rejectRequest = createAsyncThunk(
  'requests/rejectRequest',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/requests/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reject request');
    }
  }
);

// Delete request
export const deleteRequest = createAsyncThunk(
  'requests/deleteRequest',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/requests/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete request');
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    currentRequest: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single request
      .addCase(fetchRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create request
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update request
      .addCase(updateRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(request => request.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest && state.currentRequest.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve request
      .addCase(approveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(request => request.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest && state.currentRequest.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reject request
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(request => request.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest && state.currentRequest.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete request
      .addCase(deleteRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(request => request.id !== action.payload);
        if (state.currentRequest && state.currentRequest.id === action.payload) {
          state.currentRequest = null;
        }
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentRequest } = requestsSlice.actions;
export default requestsSlice.reducer; 