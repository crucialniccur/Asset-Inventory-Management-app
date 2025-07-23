import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const endpoint = getRequestsEndpoint(auth.user.role);
      
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch requests');
    }
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await api.post('/employee/request', requestData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create request');
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateRequestStatus',
  async ({ requestId, status }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const endpoint = `/procurement/requests/${requestId}/${status}`;
      
      const response = await api.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return { requestId, status, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update request');
    }
  }
);

// Helper function to get the correct endpoint based on user role
const getRequestsEndpoint = (role) => {
  switch (role) {
    case 'Admin':
      return '/admin/requests';
    case 'Finance':
      return '/finance/requests';
    case 'Procurement':
      return '/procurement/requests';
    default:
      return '/employee/requests';
  }
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
      urgency: 'all',
      type: 'all',
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
      // Fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create request
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update request status
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const { requestId, status } = action.payload;
        const requestIndex = state.requests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
          state.requests[requestIndex].status = status;
        }
      });
  },
});

export const { setFilters, clearError } = requestsSlice.actions;
export default requestsSlice.reducer;