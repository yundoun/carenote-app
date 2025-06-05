import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ScheduleService,
  type TodayWorkInfo,
  type ScheduleByDate,
  type CareScheduleWithResident,
} from '@/services/schedule.service';

// API 비동기 액션들
export const fetchTodayWorkInfo = createAsyncThunk(
  'schedule/fetchTodayWorkInfo',
  async (params: { caregiverId: string; date?: string }) => {
    const response = await ScheduleService.getTodayWorkInfo(
      params.caregiverId,
      params.date
    );
    return response.data;
  }
);

export const fetchWeeklySchedule = createAsyncThunk(
  'schedule/fetchWeeklySchedule',
  async (params: {
    caregiverId: string;
    startDate: string;
    endDate: string;
  }) => {
    const response = await ScheduleService.getWeeklySchedule(
      params.caregiverId,
      params.startDate,
      params.endDate
    );
    return response.data;
  }
);

export const updateScheduleStatus = createAsyncThunk(
  'schedule/updateStatus',
  async (params: {
    scheduleId: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
  }) => {
    const response = await ScheduleService.updateScheduleStatus(
      params.scheduleId,
      params.status,
      params.notes
    );
    return {
      ...response.data,
      scheduleId: params.scheduleId,
      status: params.status,
    };
  }
);

export const createNewSchedule = createAsyncThunk(
  'schedule/createSchedule',
  async (scheduleData: any) => {
    const response = await ScheduleService.createSchedule(scheduleData);
    return response.data;
  }
);

// 할 일 완료 상태 업데이트 (서버와 동기화)
export const updateTodoItemStatus = createAsyncThunk(
  'schedule/updateTodoItemStatus',
  async (params: { todoId: string; completed: boolean }) => {
    const { todoId, completed } = params;
    const status = completed ? 'COMPLETED' : 'PENDING';
    
    const response = await ScheduleService.updateScheduleStatus(
      todoId,
      status
    );
    
    return {
      todoId,
      completed,
      ...response.data,
    };
  }
);

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueTime?: string;
  category: 'medicine' | 'care' | 'meal' | 'vital' | 'other';
}

export interface HandoverNote {
  id: string;
  fromShift: string;
  toShift: string;
  content: string;
  priority: 'normal' | 'urgent';
  timestamp: string;
  author: string;
}

export interface TodayShift {
  id: string;
  date: string;
  shiftType: 'day' | 'night' | 'evening';
  startTime: string;
  endTime: string;
  assignedSeniors: string[];
  totalSeniors: number;
}

export interface CalendarDay {
  date: string;
  dayOfWeek: string;
  isToday: boolean;
  shift?: {
    type: 'day' | 'night' | 'evening' | 'off';
    startTime?: string;
    endTime?: string;
  };
  events: Array<{
    id: string;
    title: string;
    time: string;
    type: 'work' | 'education' | 'meeting';
  }>;
}

export interface ScheduleState {
  todayWorkInfo: TodayWorkInfo | null;
  weeklySchedule: ScheduleByDate[];
  todoList: TodoItem[];
  handoverNotes: HandoverNote[];
  selectedDate: string;
  currentDate: string;
  isLoading: boolean;
  error: string | null;
  isFullscreen: boolean;
}

const initialState: ScheduleState = {
  todayWorkInfo: null,
  weeklySchedule: [],
  todoList: [
    {
      id: '1',
      title: '김영희님 혈압 측정',
      description: '09:00 정기 혈압 체크',
      completed: false,
      priority: 'high',
      dueTime: '09:00',
      category: 'vital',
    },
    {
      id: '2',
      title: '홍길동님 점심 식사 보조',
      completed: true,
      priority: 'medium',
      dueTime: '12:00',
      category: 'meal',
    },
    {
      id: '3',
      title: '오후 교육 참석',
      description: '감염 예방 교육',
      completed: false,
      priority: 'medium',
      dueTime: '14:00',
      category: 'other',
    },
  ],
  handoverNotes: [
    {
      id: '1',
      fromShift: '야간',
      toShift: '주간',
      content: '김영희님 밤새 수면 불안정, 자주 깨어남. 낮에 컨디션 확인 필요',
      priority: 'urgent',
      timestamp: new Date().toISOString(),
      author: '박간호사',
    },
  ],
  selectedDate: new Date().toISOString().split('T')[0],
  currentDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,
  isFullscreen: false,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    navigateWeek: (state, action: PayloadAction<'prev' | 'next'>) => {
      const currentDate = new Date(state.currentDate);
      const newDate = new Date(currentDate);
      newDate.setDate(
        currentDate.getDate() + (action.payload === 'next' ? 7 : -7)
      );
      state.currentDate = newDate.toISOString().split('T')[0];
    },
    clearError: (state) => {
      state.error = null;
    },
    // 로컬에서 스케줄 상태 업데이트 (낙관적 업데이트)
    updateLocalScheduleStatus: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        status: string;
        notes?: string;
      }>
    ) => {
      const { scheduleId, status, notes } = action.payload;

      // 오늘의 스케줄에서 업데이트
      if (state.todayWorkInfo) {
        const schedule = state.todayWorkInfo.assignedSchedules.find(
          (s) => s.id === scheduleId
        );
        if (schedule) {
          schedule.status = status as any;
          if (notes) schedule.notes = notes;

          // 완료/대기 카운트 재계산
          state.todayWorkInfo.completedSchedules =
            state.todayWorkInfo.assignedSchedules.filter(
              (s) => s.status === 'COMPLETED'
            ).length;
          state.todayWorkInfo.pendingSchedules =
            state.todayWorkInfo.assignedSchedules.filter(
              (s) => s.status === 'PENDING'
            ).length;
        }
      }

      // 주간 스케줄에서도 업데이트
      state.weeklySchedule.forEach((daySchedule) => {
        const schedule = daySchedule.schedules.find((s) => s.id === scheduleId);
        if (schedule) {
          schedule.status = status as any;
          if (notes) schedule.notes = notes;
        }
      });
    },
    addTodoItem: (state, action: PayloadAction<Omit<TodoItem, 'id'>>) => {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.todoList.push(newTodo);
    },
    toggleTodoItem: (state, action: PayloadAction<string>) => {
      const todo = state.todoList.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    // 낙관적 업데이트: 로컬에서 먼저 상태 변경
    toggleTodoItemOptimistic: (state, action: PayloadAction<string>) => {
      const todo = state.todoList.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodoItem: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TodoItem> }>
    ) => {
      const { id, updates } = action.payload;
      const todoIndex = state.todoList.findIndex((item) => item.id === id);
      if (todoIndex !== -1) {
        state.todoList[todoIndex] = {
          ...state.todoList[todoIndex],
          ...updates,
        };
      }
    },
    removeTodoItem: (state, action: PayloadAction<string>) => {
      state.todoList = state.todoList.filter(
        (item) => item.id !== action.payload
      );
    },
    // API에서 가져온 스케줄 데이터를 할 일 목록으로 동기화
    syncTodoFromSchedule: (state, action: PayloadAction<any[]>) => {
      const schedules = action.payload;
      
      // 기존 할 일 목록의 로컬 변경사항 보존을 위한 맵 생성
      const existingTodos = new Map(state.todoList.map(todo => [todo.id, todo]));
      
      // API 스케줄 데이터를 TodoItem 형태로 변환
      const newTodoList: TodoItem[] = schedules.map((schedule) => {
        // 우선순위 결정 로직
        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (schedule.priority === 'HIGH' || schedule.type === 'MEDICATION') {
          priority = 'high';
        } else if (schedule.priority === 'LOW') {
          priority = 'low';
        }

        // 카테고리 매핑
        const categoryMap: Record<string, TodoItem['category']> = {
          'MEDICATION': 'medicine',
          'VITAL_CHECK': 'vital',
          'MEAL_ASSISTANCE': 'meal',
          'POSITION_CHANGE': 'care',
          'EXERCISE': 'care',
          'HYGIENE': 'care',
        };

        // 시간 포맷팅 (ISO 8601 → HH:MM)
        const timeFormat = (isoString: string) => {
          try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) {
              return '시간 미정';
            }
            return date.toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            });
          } catch (error) {
            return '시간 미정';
          }
        };

        // 기존 할 일이 있으면 로컬 상태 우선 사용 (서버 동기화 실패 방지)
        const existingTodo = existingTodos.get(schedule.id);
        const serverCompleted = schedule.status === 'COMPLETED';
        
        return {
          id: schedule.id,
          title: schedule.title,
          description: schedule.description,
          // 기존 로컬 상태가 있고 서버 상태와 다르면 로컬 우선
          completed: existingTodo ? existingTodo.completed : serverCompleted,
          priority,
          dueTime: timeFormat(schedule.scheduled_time),
          category: categoryMap[schedule.type] || 'other',
        };
      });

      state.todoList = newTodoList;
    },
    addHandoverNote: (
      state,
      action: PayloadAction<Omit<HandoverNote, 'id' | 'timestamp'>>
    ) => {
      const newNote: HandoverNote = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.handoverNotes.unshift(newNote);
    },
    updateWeeklySchedule: (state, action: PayloadAction<ScheduleByDate[]>) => {
      state.weeklySchedule = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodayWorkInfo
      .addCase(fetchTodayWorkInfo.pending, (state) => {
        console.log('🔄 fetchTodayWorkInfo.pending - 로딩 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayWorkInfo.fulfilled, (state, action) => {
        console.log('✅ fetchTodayWorkInfo.fulfilled - 데이터 수신 성공');
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        state.todayWorkInfo = action.payload;

        console.log('📋 Store 업데이트 완료:', state.todayWorkInfo);
      })
      .addCase(fetchTodayWorkInfo.rejected, (state, action) => {
        console.error('❌ fetchTodayWorkInfo.rejected - 데이터 수신 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error =
          action.error.message || '오늘의 근무 정보 조회에 실패했습니다.';
      })

      // fetchWeeklySchedule
      .addCase(fetchWeeklySchedule.pending, (state) => {
        console.log('🔄 fetchWeeklySchedule.pending - 로딩 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeeklySchedule.fulfilled, (state, action) => {
        console.log('✅ fetchWeeklySchedule.fulfilled - 데이터 수신 성공');
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        state.weeklySchedule = action.payload;

        console.log('📋 주간 스케줄 업데이트 완료:', state.weeklySchedule);
      })
      .addCase(fetchWeeklySchedule.rejected, (state, action) => {
        console.error('❌ fetchWeeklySchedule.rejected - 데이터 수신 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error =
          action.error.message || '주간 스케줄 조회에 실패했습니다.';
      })

      // updateScheduleStatus
      .addCase(updateScheduleStatus.pending, (state) => {
        console.log('🔄 updateScheduleStatus.pending - 업데이트 시작');
      })
      .addCase(updateScheduleStatus.fulfilled, (state, action) => {
        console.log('✅ updateScheduleStatus.fulfilled - 업데이트 성공');
        console.log('📊 업데이트된 데이터:', action.payload);

        // 이미 updateLocalScheduleStatus에서 낙관적 업데이트가 되었으므로
        // 여기서는 추가 처리만 수행
        state.error = null;
      })
      .addCase(updateScheduleStatus.rejected, (state, action) => {
        console.error('❌ updateScheduleStatus.rejected - 업데이트 실패');
        console.error('오류 정보:', action.error);

        state.error =
          action.error.message || '스케줄 상태 업데이트에 실패했습니다.';
        // TODO: 낙관적 업데이트 롤백 로직 추가
      })

      // createNewSchedule
      .addCase(createNewSchedule.pending, (state) => {
        console.log('🔄 createNewSchedule.pending - 생성 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewSchedule.fulfilled, (state, action) => {
        console.log('✅ createNewSchedule.fulfilled - 생성 성공');
        console.log('📊 생성된 데이터:', action.payload);

        state.isLoading = false;
        state.error = null;

        // 새로운 스케줄을 현재 데이터에 추가
        if (state.todayWorkInfo) {
          // 오늘 날짜의 스케줄이면 todayWorkInfo에 추가
          const today = new Date().toISOString().split('T')[0];
          const scheduleDate = action.payload.scheduled_time.split('T')[0];

          if (scheduleDate === today) {
            // 거주자와 케어기버 정보를 포함한 형태로 변환 필요
            // 실제로는 새로 조회하거나 별도 처리 필요
            state.todayWorkInfo.totalSchedules += 1;
            state.todayWorkInfo.pendingSchedules += 1;
          }
        }
      })
      .addCase(createNewSchedule.rejected, (state, action) => {
        console.error('❌ createNewSchedule.rejected - 생성 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '새 스케줄 생성에 실패했습니다.';
      })

      // updateTodoItemStatus
      .addCase(updateTodoItemStatus.pending, (state, action) => {
        console.log('🔄 updateTodoItemStatus.pending - 할 일 상태 업데이트 시작');
        // 낙관적 업데이트는 이미 완료된 상태
      })
      .addCase(updateTodoItemStatus.fulfilled, (state, action) => {
        console.log('✅ updateTodoItemStatus.fulfilled - 서버 동기화 성공');
        console.log('📊 업데이트된 데이터:', action.payload);
        
        // 서버 응답으로 상태 확정 (이미 낙관적 업데이트 완료)
        const { todoId, completed } = action.payload;
        const todo = state.todoList.find((item) => item.id === todoId);
        if (todo) {
          todo.completed = completed;
        }
        
        state.error = null;
      })
      .addCase(updateTodoItemStatus.rejected, (state, action) => {
        console.error('❌ updateTodoItemStatus.rejected - 서버 동기화 실패');
        console.error('오류 정보:', action.error);
        
        // 실패 시 낙관적 업데이트 롤백
        const todoId = action.meta.arg.todoId;
        const todo = state.todoList.find((item) => item.id === todoId);
        if (todo) {
          todo.completed = !todo.completed; // 원래 상태로 되돌림
        }
        
        state.error = action.error.message || '할 일 상태 업데이트에 실패했습니다.';
      });
  },
});

export const {
  setSelectedDate,
  setCurrentDate,
  toggleFullscreen,
  navigateWeek,
  clearError,
  updateLocalScheduleStatus,
  addTodoItem,
  toggleTodoItem,
  toggleTodoItemOptimistic,
  updateTodoItem,
  removeTodoItem,
  syncTodoFromSchedule,
  addHandoverNote,
  updateWeeklySchedule,
  setLoading,
  setError,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
