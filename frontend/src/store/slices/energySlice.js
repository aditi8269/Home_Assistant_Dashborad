import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const fetchEnergy = createAsyncThunk('energy/fetchEnergy', async () => {
  const response = await axios.get(`${API}/energy`);
  return response.data;
});

const energySlice = createSlice({
  name: 'energy',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnergy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnergy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEnergy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default energySlice.reducer;