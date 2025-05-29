import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  todayShift: TodayShift | null;
  weeklySchedule: CalendarDay[];
  todoList: TodoItem[];
  handoverNotes: HandoverNote[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  todayShift: {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'day',
    startTime: '08:00',
    endTime: '16:00',
    assignedSeniors: ['김영희', '홍길동', '이철수'],
    totalSeniors: 3,
  },
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
  isLoading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    addTodoItem: (state, action: PayloadAction<Omit<TodoItem, 'id'>>) => {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.todoList.push(newTodo);
    },
    toggleTodoItem: (state, action: PayloadAction<string>) => {
      const todo = state.todoList.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodoItem: (state, action: PayloadAction<{ id: string; updates: Partial<TodoItem> }>) => {
      const { id, updates } = action.payload;
      const todoIndex = state.todoList.findIndex(item => item.id === id);
      if (todoIndex !== -1) {
        state.todoList[todoIndex] = { ...state.todoList[todoIndex], ...updates };
      }
    },
    removeTodoItem: (state, action: PayloadAction<string>) => {
      state.todoList = state.todoList.filter(item => item.id !== action.payload);
    },
    addHandoverNote: (state, action: PayloadAction<Omit<HandoverNote, 'id' | 'timestamp'>>) => {
      const newNote: HandoverNote = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.handoverNotes.unshift(newNote);
    },
    updateWeeklySchedule: (state, action: PayloadAction<CalendarDay[]>) => {
      state.weeklySchedule = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedDate,
  addTodoItem,
  toggleTodoItem,
  updateTodoItem,
  removeTodoItem,
  addHandoverNote,
  updateWeeklySchedule,
  setLoading,
  setError,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;