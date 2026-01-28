import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './slices/roomsSlice';
import securityReducer from './slices/securitySlice';
import energyReducer from './slices/energySlice';
import mediaReducer from './slices/mediaSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    security: securityReducer,
    energy: energyReducer,
    media: mediaReducer,
    theme: themeReducer,
  },
});