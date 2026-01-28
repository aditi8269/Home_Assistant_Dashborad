import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  const response = await axios.get(`${API}/rooms`);
  return response.data;
});

export const updateDevice = createAsyncThunk(
  'rooms/updateDevice',
  async ({ deviceId, update }) => {
    const response = await axios.put(`${API}/devices/${deviceId}`, update);
    return response.data;
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload;
        state.data = state.data.map(room => ({
          ...room,
          devices: room.devices.map(device =>
            device.id === updatedDevice.id ? updatedDevice : device
          ),
        }));
      });
  },
});

export default roomsSlice.reducer;
