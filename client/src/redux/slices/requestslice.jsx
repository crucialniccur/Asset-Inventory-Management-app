// src/redux/slices/requestslice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.get('http://localhost:5000/requests', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
});

export const submitRequest = createAsyncThunk('requests/submitRequest', async (data, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.post('http://localhost:5000/requests', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    list: [],
    status: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(submitRequest.fulfilled, (state, action) => {
        state.list.push(action.payload); // update list immediately
        state.status = 'success';
      });
  },
});

export default requestSlice.reducer;
