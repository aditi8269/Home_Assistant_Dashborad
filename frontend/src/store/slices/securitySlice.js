import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const fetchSecurity = createAsyncThunk('security/fetchSecurity', async () => {
  const response = await axios.get(`${API}/security`);
  return response.data;
});

export const updateSecurity = createAsyncThunk(
  'security/updateSecurity',
  async (securityData) => {
    const response = await axios.put(`${API}/security`, securityData);
    return response.data;
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState: {
    armed: false,
    doorLocked: false,
    motionDetected: false,
    alarmState: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurity.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSecurity.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchSecurity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSecurity.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  },
});

export default securitySlice.reducer;