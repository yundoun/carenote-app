import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  HomeService,
  type HomeDashboardData,
  type HomeWelcomeData,
  type HomeTodayProgress,
  type HomeScheduleItem,
  type HomeUrgentAlert,
  type HomeAssignedResident,
  type HomeHandoverInfo,
} from '@/services/home.service';

export interface HomeState {
  welcomeData: HomeWelcomeData | null;
  todayProgress: HomeTodayProgress | null;
  todaySchedule: HomeScheduleItem[];
  urgentAlerts: HomeUrgentAlert[];
  assignedResidents: HomeAssignedResident[];
  handoverInfo: HomeHandoverInfo[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: HomeState = {
  welcomeData: null,
  todayProgress: null,
  todaySchedule: [],
  urgentAlerts: [],
  assignedResidents: [],
  handoverInfo: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// API 비동기 액션들
export const fetchHomeDashboardData = createAsyncThunk(
  'home/fetchDashboardData',
  async (userId: string) => {
    const response = await HomeService.getDashboardData(userId);
    return response.data;
  }
);

export const fetchHomeWelcomeData = createAsyncThunk(
  'home/fetchWelcomeData',
  async (userId: string) => {
    const response = await HomeService.getWelcomeData(userId);
    return response.data;
  }
);

export const fetchHomeTodayProgress = createAsyncThunk(
  'home/fetchTodayProgress',
  async (userId: string) => {
    const response = await HomeService.getTodayProgress(userId);
    return response.data;
  }
);

export const fetchHomeTodaySchedule = createAsyncThunk(
  'home/fetchTodaySchedule',
  async (userId: string) => {
    const response = await HomeService.getTodaySchedule(userId);
    return response.data;
  }
);

export const fetchHomeUrgentAlerts = createAsyncThunk(
  'home/fetchUrgentAlerts',
  async (userId: string) => {
    const response = await HomeService.getUrgentAlerts(userId);
    return response.data;
  }
);

export const fetchHomeAssignedResidents = createAsyncThunk(
  'home/fetchAssignedResidents',
  async (userId: string) => {
    const response = await HomeService.getAssignedResidents(userId);
    return response.data;
  }
);

export const fetchHomeHandoverInfo = createAsyncThunk(
  'home/fetchHandoverInfo',
  async (userId: string) => {
    const response = await HomeService.getHandoverInfo(userId);
    return response.data;
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeData: (state) => {
      state.welcomeData = null;
      state.todayProgress = null;
      state.todaySchedule = [];
      state.urgentAlerts = [];
      state.assignedResidents = [];
      state.handoverInfo = [];
      state.error = null;
      state.lastUpdated = null;
    },
    clearHomeError: (state) => {
      state.error = null;
    },
    markAlertAsRead: (state, action: PayloadAction<string>) => {
      const alertId = action.payload;
      state.urgentAlerts = state.urgentAlerts.filter(alert => alert.id !== alertId);
    },
    updateTaskProgress: (state, action: PayloadAction<{ taskId: string; completed: boolean }>) => {
      const { taskId, completed } = action.payload;
      
      // 일정에서 해당 업무 업데이트
      const scheduleItem = state.todaySchedule.find(item => item.id === taskId);
      if (scheduleItem && scheduleItem.type === 'task') {
        // 필요시 상태 업데이트 로직 추가
      }

      // 진행률 업데이트 (재계산 필요시)
      if (state.todayProgress) {
        if (completed) {
          state.todayProgress.completedTasks += 1;
        } else {
          state.todayProgress.completedTasks = Math.max(0, state.todayProgress.completedTasks - 1);
        }
        
        state.todayProgress.progressPercentage = state.todayProgress.totalTasks > 0
          ? Math.round((state.todayProgress.completedTasks / state.todayProgress.totalTasks) * 100)
          : 0;
      }
    },
    refreshLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // 전체 대시보드 데이터 조회
    builder
      .addCase(fetchHomeDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.welcomeData = action.payload.welcomeData;
        state.todayProgress = action.payload.todayProgress;
        state.todaySchedule = action.payload.todaySchedule;
        state.urgentAlerts = action.payload.urgentAlerts;
        state.assignedResidents = action.payload.assignedResidents;
        state.handoverInfo = action.payload.handoverInfo;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchHomeDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '대시보드 데이터 조회 실패';
      });

    // 환대 데이터 조회
    builder
      .addCase(fetchHomeWelcomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeWelcomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.welcomeData = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeWelcomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '환대 데이터 조회 실패';
      });

    // 오늘의 진행 상황 조회
    builder
      .addCase(fetchHomeTodayProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeTodayProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayProgress = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeTodayProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '진행 상황 조회 실패';
      });

    // 오늘의 일정 조회
    builder
      .addCase(fetchHomeTodaySchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeTodaySchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todaySchedule = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeTodaySchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '일정 조회 실패';
      });

    // 긴급 알림 조회
    builder
      .addCase(fetchHomeUrgentAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeUrgentAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.urgentAlerts = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeUrgentAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '긴급 알림 조회 실패';
      });

    // 담당 입주자 조회
    builder
      .addCase(fetchHomeAssignedResidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeAssignedResidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignedResidents = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeAssignedResidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '담당 입주자 조회 실패';
      });

    // 인수인계 정보 조회
    builder
      .addCase(fetchHomeHandoverInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeHandoverInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.handoverInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeHandoverInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '인수인계 정보 조회 실패';
      });
  },
});

export const {
  clearHomeData,
  clearHomeError,
  markAlertAsRead,
  updateTaskProgress,
  refreshLastUpdated,
} = homeSlice.actions;

export default homeSlice.reducer;