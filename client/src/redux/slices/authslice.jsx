import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';


axios.defaults.headers.post['Content-Type'] = 'application/json';


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const token = res.data.access_token;
      
      // Set the token in headers for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const userRes = await api.get('/auth/me');
      
      return {
        user: userRes.data,
        token: token
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Login failed'
      );
    }
  }
);

// 📝 REGISTER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', credentials);
      return {
        user: res.data,
        token: res.data.access_token || null
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Registration failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization']; 
    },
    setCredentials(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      api.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null; // Some APIs return user on register
        localStorage.setItem('token', action.payload.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;