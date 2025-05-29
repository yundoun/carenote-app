import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import residentsReducer from './slices/residentsSlice';
import vitalsReducer from './slices/vitalsSlice';
import uiReducer from './slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer,
  residents: residentsReducer,
  vitals: vitalsReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;