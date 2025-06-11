import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ResidentsService,
  type ResidentListItem,
  type ResidentDetailResponse,
} from '@/services/residents.service';

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

// API 비동기 액션들
export const fetchResidents = createAsyncThunk(
  'residents/fetchResidents',
  async (params?: { caregiverId?: string; page?: number; size?: number }) => {
    const response = await ResidentsService.getResidentList(params);
    return response.data;
  }
);

export const fetchResidentDetail = createAsyncThunk(
  'residents/fetchDetail',
  async (residentId: string) => {
    const response = await ResidentsService.getResidentDetail(residentId);
    return response.data;
  }
);

// API 응답을 Redux 타입으로 변환하는 함수
function transformApiResident(apiResident: ResidentListItem): ResidentDetail {
  return {
    id: apiResident.id,
    name: apiResident.name,
    age: apiResident.age || 0,
    gender: apiResident.gender === 'M' ? 'male' : 'female',
    room: apiResident.room_number || '',
    conditions: apiResident.main_diagnosis ? [apiResident.main_diagnosis] : [],
    warnings: [], // 추후 API에서 제공
    medications: [], // 별도 API 호출로 처리
    careLevel: apiResident.care_level || '',
    emergencyContact: '010-0000-0000 (가족)', // 임시 데이터
    todaySchedule: [
      '09:00 - 아침식사',
      '10:30 - 약물복용',
      '14:00 - 점심식사',
      '15:30 - 재활운동',
      '18:00 - 저녁식사'
    ],
    recentNotes: [
      '혈압 측정 완료 (정상)',
      '식사량 양호',
      '컨디션 양호'
    ],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '36.5°C',
      lastChecked: '2시간 전',
    },
  };
}

function transformApiResidentDetail(
  apiResident: ResidentDetailResponse
): ResidentDetail {
  return {
    id: apiResident.id,
    name: apiResident.name,
    age: apiResident.age || 0,
    gender: apiResident.gender === 'M' ? 'male' : 'female',
    room: apiResident.room_number || '',
    conditions: apiResident.main_diagnosis ? [apiResident.main_diagnosis] : [],
    warnings: [], // 추후 API에서 제공
    medications: apiResident.medications.map(
      (med) => `${med.name} ${med.dosage || ''}`
    ),
    careLevel: apiResident.care_level || '',
    emergencyContact: apiResident.family_info.primary_contact.phone_number
      ? `${apiResident.family_info.primary_contact.phone_number} (${
          apiResident.family_info.primary_contact.relationship || ''
        })`
      : '',
    todaySchedule: [], // 별도 스케줄 API에서 가져옴
    recentNotes: apiResident.care_notes || [],
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      lastChecked: '',
    }, // 별도 vital signs API 필요
  };
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
    todaySchedule: ['10:00 혈압측정', '14:00 물리치료', '18:00 저녁식사 보조'],
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
    todaySchedule: ['11:00 물리치료', '15:00 언어치료', '19:00 저녁약 복용'],
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
  residents: [],
  filteredResidents: [],
  urgentCases: [],
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
      state.filteredResidents = state.residents.filter(
        (resident) =>
          resident.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          resident.room.includes(action.payload)
      );
    },
    setSelectedResident: (
      state,
      action: PayloadAction<ResidentDetail | null>
    ) => {
      state.selectedResident = action.payload;
    },
    updateResident: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<ResidentDetail> }>
    ) => {
      const { id, updates } = action.payload;
      const residentIndex = state.residents.findIndex((r) => r.id === id);
      if (residentIndex !== -1) {
        state.residents[residentIndex] = {
          ...state.residents[residentIndex],
          ...updates,
        };
        // 필터링된 목록도 업데이트
        const filteredIndex = state.filteredResidents.findIndex(
          (r) => r.id === id
        );
        if (filteredIndex !== -1) {
          state.filteredResidents[filteredIndex] =
            state.residents[residentIndex];
        }
        // 선택된 주민이면 업데이트
        if (state.selectedResident?.id === id) {
          state.selectedResident = state.residents[residentIndex];
        }
      }
    },
    addRecentNote: (
      state,
      action: PayloadAction<{ residentId: string; note: string }>
    ) => {
      const { residentId, note } = action.payload;
      const resident = state.residents.find((r) => r.id === residentId);
      if (resident) {
        resident.recentNotes.unshift(note);
        // 최대 5개까지만 유지
        if (resident.recentNotes.length > 5) {
          resident.recentNotes = resident.recentNotes.slice(0, 5);
        }
      }
    },
    updateVitalSigns: (
      state,
      action: PayloadAction<{
        residentId: string;
        vitalSigns: ResidentDetail['vitalSigns'];
      }>
    ) => {
      const { residentId, vitalSigns } = action.payload;
      const resident = state.residents.find((r) => r.id === residentId);
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
  extraReducers: (builder) => {
    builder
      // fetchResidents
      .addCase(fetchResidents.pending, (state) => {
        console.log('🔄 fetchResidents.pending - 로딩 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResidents.fulfilled, (state, action) => {
        console.log('✅ fetchResidents.fulfilled - 데이터 수신 성공');
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        const transformedResidents =
          action.payload.content.map(transformApiResident);
        console.log('🔄 변환된 데이터:', transformedResidents);

        state.residents = transformedResidents;
        state.filteredResidents = transformedResidents.filter(
          (resident) =>
            resident.name
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            resident.room.includes(state.searchQuery)
        );
        state.urgentCases = transformedResidents.filter(
          (r) => r.warnings && r.warnings.length > 0
        );

        console.log('📋 Store 업데이트 완료:');
        console.log('  - 총 residents:', state.residents.length);
        console.log('  - filteredResidents:', state.filteredResidents.length);
        console.log('  - urgentCases:', state.urgentCases.length);
      })
      .addCase(fetchResidents.rejected, (state, action) => {
        console.error('❌ fetchResidents.rejected - 데이터 수신 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '주민 목록 조회에 실패했습니다.';
      })
      // fetchResidentDetail
      .addCase(fetchResidentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResidentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedResident = transformApiResidentDetail(action.payload);
      })
      .addCase(fetchResidentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || '주민 상세 정보 조회에 실패했습니다.';
      });
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

// 비동기 액션들은 이미 위에서 export되었으므로 별도 export 불필요

export default residentsSlice.reducer;
