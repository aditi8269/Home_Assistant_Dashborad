import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const fetchMedia = createAsyncThunk('media/fetchMedia', async () => {
  const response = await axios.get(`${API}/media`);
  return response.data;
});

export const updateMedia = createAsyncThunk(
  'media/updateMedia',
  async (mediaData) => {
    const response = await axios.put(`${API}/media`, mediaData);
    return response.data;
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    playing: false,
    volume: 50,
    currentMedia: '',
    device: '',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateMedia.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  },
});

export default mediaSlice.reducer;