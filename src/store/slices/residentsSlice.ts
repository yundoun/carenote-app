import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ResidentDetail {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  room: string;
  conditions: string[];
  warnings?: string[];
  medications: string[];
  careLevel: string;
  emergencyContact: string;
  todaySchedule: string[];
  recentNotes: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    lastChecked: string;
  };
}

export interface ResidentsState {
  residents: ResidentDetail[];
  filteredResidents: ResidentDetail[];
  urgentCases: ResidentDetail[];
  selectedResident: ResidentDetail | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const mockResidents: ResidentDetail[] = [
  {
    id: '1',
    name: '홍길동',
    age: 85,
    gender: 'male',
    room: '301',
    conditions: ['치매', '고혈압'],
    warnings: ['낙상주의'],
    medications: ['혈압약 복용'],
    careLevel: '3등급',
    emergencyContact: '010-1234-5678 (아들)',
    todaySchedule: [
      '10:00 혈압측정',
      '14:00 물리치료',
      '18:00 저녁식사 보조',
    ],
    recentNotes: [
      '어제 밤 수면 불안정, 자주 깨어남',
      '식욕 양호, 아침식사 완료',
      '혈압 수치 안정적',
    ],
    vitalSigns: {
      bloodPressure: '130/80',
      heartRate: '72',
      temperature: '36.5°C',
      lastChecked: '09:30',
    },
  },
  {
    id: '2',
    name: '김영희',
    age: 78,
    gender: 'female',
    room: '302',
    conditions: ['당뇨', '관절염'],
    medications: ['당뇨약 복용', '관절염 연고'],
    careLevel: '2등급',
    emergencyContact: '010-2345-6789 (딸)',
    todaySchedule: ['08:00 혈당체크', '12:00 점심식사', '16:00 산책'],
    recentNotes: [
      '혈당 수치 정상 범위',
      '무릎 통증 호소, 연고 발라드림',
      '오늘 기분 좋아 보임',
    ],
    vitalSigns: {
      bloodPressure: '120/75',
      heartRate: '68',
      temperature: '36.3°C',
      lastChecked: '08:15',
    },
  },
  {
    id: '3',
    name: '이철수',
    age: 82,
    gender: 'male',
    room: '303',
    conditions: ['파킨슨병', '고지혈증'],
    warnings: ['보행 보조 필요'],
    medications: ['파킨슨약 복용'],
    careLevel: '1등급',
    emergencyContact: '010-3456-7890 (부인)',
    todaySchedule: [
      '11:00 물리치료',
      '15:00 언어치료',
      '19:00 저녁약 복용',
    ],
    recentNotes: [
      '손떨림 증상 약간 증가',
      '물리치료 적극적으로 참여',
      '식사량 보통',
    ],
    vitalSigns: {
      bloodPressure: '125/82',
      heartRate: '75',
      temperature: '36.4°C',
      lastChecked: '10:00',
    },
  },
];

const initialState: ResidentsState = {
  residents: mockResidents,
  filteredResidents: mockResidents,
  urgentCases: mockResidents.filter(r => r.warnings && r.warnings.length > 0),
  selectedResident: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const residentsSlice = createSlice({
  name: 'residents',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // 검색 필터링
      state.filteredResidents = state.residents.filter(resident =>
        resident.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        resident.room.includes(action.payload)
      );
    },
    setSelectedResident: (state, action: PayloadAction<ResidentDetail | null>) => {
      state.selectedResident = action.payload;
    },
    updateResident: (state, action: PayloadAction<{ id: string; updates: Partial<ResidentDetail> }>) => {
      const { id, updates } = action.payload;
      const residentIndex = state.residents.findIndex(r => r.id === id);
      if (residentIndex !== -1) {
        state.residents[residentIndex] = { ...state.residents[residentIndex], ...updates };
        // 필터링된 목록도 업데이트
        const filteredIndex = state.filteredResidents.findIndex(r => r.id === id);
        if (filteredIndex !== -1) {
          state.filteredResidents[filteredIndex] = state.residents[residentIndex];
        }
        // 선택된 주민이면 업데이트
        if (state.selectedResident?.id === id) {
          state.selectedResident = state.residents[residentIndex];
        }
      }
    },
    addRecentNote: (state, action: PayloadAction<{ residentId: string; note: string }>) => {
      const { residentId, note } = action.payload;
      const resident = state.residents.find(r => r.id === residentId);
      if (resident) {
        resident.recentNotes.unshift(note);
        // 최대 5개까지만 유지
        if (resident.recentNotes.length > 5) {
          resident.recentNotes = resident.recentNotes.slice(0, 5);
        }
      }
    },
    updateVitalSigns: (state, action: PayloadAction<{ 
      residentId: string; 
      vitalSigns: ResidentDetail['vitalSigns'] 
    }>) => {
      const { residentId, vitalSigns } = action.payload;
      const resident = state.residents.find(r => r.id === residentId);
      if (resident) {
        resident.vitalSigns = vitalSigns;
      }
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
  setSearchQuery,
  setSelectedResident,
  updateResident,
  addRecentNote,
  updateVitalSigns,
  setLoading,
  setError,
} = residentsSlice.actions;

export default residentsSlice.reducer;