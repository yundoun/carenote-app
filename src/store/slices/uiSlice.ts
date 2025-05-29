import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  // 로딩 상태
  globalLoading: boolean;
  pageLoading: boolean;
  
  // 모달 상태
  modals: {
    [key: string]: boolean;
  };
  
  // 알림/토스트
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    timestamp: number;
  }>;
  
  // 네비게이션 상태
  navigation: {
    isMenuOpen: boolean;
    activeTab: string;
  };
  
  // 테마 및 설정
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

const initialState: UIState = {
  globalLoading: false,
  pageLoading: false,
  modals: {},
  notifications: [],
  navigation: {
    isMenuOpen: false,
    activeTab: '/',
  },
  theme: 'light',
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        duration: 5000, // 기본 5초
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.navigation.isMenuOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.navigation.activeTab = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  setPageLoading,
  openModal,
  closeModal,
  toggleModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setMenuOpen,
  setActiveTab,
  toggleTheme,
  setSidebarCollapsed,
} = uiSlice.actions;

export default uiSlice.reducer;