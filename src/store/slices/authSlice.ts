import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  role: string;
  floor: string;
  department: string;
  email?: string;
  phone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true, // 개발용으로 true 설정
  user: {
    id: '8debc4ef-aa7a-4ddd-ae6b-4982fe89dc7b', // 김요양의 올바른 UUID
    name: '김요양',
    role: '요양보호사',
    floor: '3층',
    department: '간호팀',
    email: 'caregiver@example.com',
    phone: '010-1234-5678',
  },
  token: 'mock-token',
  refreshToken: 'mock-refresh-token',
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
