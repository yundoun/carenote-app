import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NursingService, type MedicationRecordListItem, type PositionChangeRecordListItem, type AppointmentListItem, type CareScheduleListItem } from '@/services/nursing.service';

export interface MedicationRecord {
  id: string;
  residentId: string;
  residentName: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'MISSED' | 'REFUSED';
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface PositionChangeRecord {
  id: string;
  residentId: string;
  residentName: string;
  changeTime: string;
  fromPosition: 'SUPINE' | 'LEFT_LATERAL' | 'RIGHT_LATERAL' | 'PRONE' | 'SITTING';
  toPosition: 'SUPINE' | 'LEFT_LATERAL' | 'RIGHT_LATERAL' | 'PRONE' | 'SITTING';
  skinCondition: 'NORMAL' | 'REDNESS' | 'PRESSURE_SORE' | 'WOUND';
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface CareActivity {
  id: string;
  type: 'BATHING' | 'FEEDING' | 'MOBILITY' | 'TOILETING' | 'EXERCISE' | 'OTHER';
  residentId: string;
  residentName: string;
  scheduledTime?: string;
  actualTime: string;
  duration?: number; // 분 단위
  status: 'COMPLETED' | 'PARTIAL' | 'REFUSED' | 'CANCELLED';
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Appointment {
  id: string;
  residentId: string;
  residentName: string;
  type: 'HOSPITAL' | 'FAMILY_VISIT' | 'THERAPY' | 'OTHER';
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  duration?: number;
  location?: string;
  hospital?: string;
  department?: string;
  purpose?: string;
  accompaniedBy?: string;
  transportation?: string;
  visitors?: string[];
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

export interface NursingNote {
  id: string;
  residentId: string;
  residentName: string;
  noteType: 'DAILY_OBSERVATION' | 'INCIDENT' | 'BEHAVIOR' | 'MEDICAL' | 'FAMILY_COMMUNICATION';
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  tags: string[];
  attachments?: Array<{
    type: 'PHOTO' | 'DOCUMENT';
    url: string;
    name: string;
  }>;
  recordedBy: string;
  recordedAt: string;
}

export interface NursingState {
  medicationRecords: MedicationRecord[];
  positionChangeRecords: PositionChangeRecord[];
  careActivities: CareActivity[];
  appointments: Appointment[];
  nursingNotes: NursingNote[];
  selectedResident: string | null;
  selectedDate: string;
  filterType: 'all' | 'medication' | 'position' | 'care' | 'appointments' | 'notes';
  isRecording: boolean;
  currentRecord: any | null;
  isLoading: boolean;
  error: string | null;
}

// API 비동기 액션들
export const fetchMedicationRecords = createAsyncThunk(
  'nursing/fetchMedicationRecords',
  async (params?: {
    residentId?: string;
    caregiverId?: string;
    date?: string;
    status?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await NursingService.getMedicationRecords(params);
    return response.data;
  }
);

export const createMedicationRecord = createAsyncThunk(
  'nursing/createMedicationRecord',
  async (recordData: {
    resident_id: string;
    caregiver_id: string;
    medication_name: string;
    dosage?: string;
    scheduled_time?: string;
    actual_time?: string;
    status: string;
    notes?: string;
  }) => {
    const response = await NursingService.createMedicationRecord({
      ...recordData,
      recorded_at: new Date().toISOString(),
    });
    return response.data;
  }
);

export const fetchPositionChangeRecords = createAsyncThunk(
  'nursing/fetchPositionChangeRecords',
  async (params?: {
    residentId?: string;
    caregiverId?: string;
    date?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await NursingService.getPositionChangeRecords(params);
    return response.data;
  }
);

export const createPositionChangeRecord = createAsyncThunk(
  'nursing/createPositionChangeRecord',
  async (recordData: {
    resident_id: string;
    caregiver_id: string;
    change_time: string;
    from_position?: string;
    to_position?: string;
    skin_condition?: string;
    notes?: string;
  }) => {
    const response = await NursingService.createPositionChangeRecord(recordData);
    return response.data;
  }
);

export const fetchAppointments = createAsyncThunk(
  'nursing/fetchAppointments',
  async (params?: {
    residentId?: string;
    type?: string;
    date?: string;
    status?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await NursingService.getAppointments(params);
    return response.data;
  }
);

export const fetchCareSchedules = createAsyncThunk(
  'nursing/fetchCareSchedules',
  async (params?: {
    residentId?: string;
    caregiverId?: string;
    date?: string;
    type?: string;
    status?: string;
    priority?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await NursingService.getCareSchedules(params);
    return response.data;
  }
);

export const updateCareScheduleStatus = createAsyncThunk(
  'nursing/updateCareScheduleStatus',
  async ({ scheduleId, status, notes }: { scheduleId: string; status: string; notes?: string }) => {
    const response = await NursingService.updateCareScheduleStatus(scheduleId, status, notes);
    return response.data;
  }
);

// API 응답을 Redux 타입으로 변환하는 함수
function transformApiMedicationRecord(apiRecord: MedicationRecordListItem): MedicationRecord {
  return {
    id: apiRecord.id,
    residentId: apiRecord.resident_id || '',
    residentName: apiRecord.resident_name || '',
    medicationName: apiRecord.medication_name,
    dosage: apiRecord.dosage || '',
    scheduledTime: apiRecord.scheduled_time || '',
    actualTime: apiRecord.actual_time || '',
    status: (apiRecord.status as 'SCHEDULED' | 'COMPLETED' | 'MISSED' | 'REFUSED') || 'SCHEDULED',
    notes: apiRecord.notes || '',
    recordedBy: apiRecord.caregiver_name || '',
    recordedAt: apiRecord.recorded_at || '',
  };
}

function transformApiPositionRecord(apiRecord: PositionChangeRecordListItem): PositionChangeRecord {
  return {
    id: apiRecord.id,
    residentId: apiRecord.resident_id || '',
    residentName: apiRecord.resident_name || '',
    changeTime: apiRecord.change_time,
    fromPosition: (apiRecord.from_position as 'SUPINE' | 'LEFT_LATERAL' | 'RIGHT_LATERAL' | 'PRONE' | 'SITTING') || 'SUPINE',
    toPosition: (apiRecord.to_position as 'SUPINE' | 'LEFT_LATERAL' | 'RIGHT_LATERAL' | 'PRONE' | 'SITTING') || 'SUPINE',
    skinCondition: (apiRecord.skin_condition as 'NORMAL' | 'REDNESS' | 'PRESSURE_SORE' | 'WOUND') || 'NORMAL',
    notes: apiRecord.notes || '',
    recordedBy: apiRecord.caregiver_name || '',
    recordedAt: apiRecord.created_at || '',
  };
}

function transformApiAppointment(apiAppointment: AppointmentListItem): Appointment {
  return {
    id: apiAppointment.id,
    residentId: apiAppointment.resident_id || '',
    residentName: apiAppointment.resident_name || '',
    type: (apiAppointment.type as 'HOSPITAL' | 'FAMILY_VISIT' | 'THERAPY' | 'OTHER') || 'OTHER',
    title: apiAppointment.title || '',
    scheduledDate: apiAppointment.scheduled_date,
    scheduledTime: apiAppointment.scheduled_time || '',
    duration: apiAppointment.duration_minutes,
    location: apiAppointment.location,
    hospital: apiAppointment.hospital,
    department: apiAppointment.department,
    purpose: apiAppointment.purpose,
    accompaniedBy: apiAppointment.accompanied_by,
    transportation: apiAppointment.transportation,
    visitors: apiAppointment.visitors,
    status: (apiAppointment.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') || 'SCHEDULED',
    notes: apiAppointment.notes,
  };
}

const mockMedicationRecords: MedicationRecord[] = [
  {
    id: 'med-001',
    residentId: 'resident-001',
    residentName: '김철수',
    medicationName: '도네페질',
    dosage: '5mg',
    scheduledTime: '08:00',
    actualTime: '08:15',
    status: 'COMPLETED',
    notes: '정상 복용',
    recordedBy: '홍길동',
    recordedAt: '2025-05-29T08:15:00Z',
  },
  {
    id: 'med-002',
    residentId: 'resident-002',
    residentName: '김영희',
    medicationName: '혈압약',
    dosage: '10mg',
    scheduledTime: '08:00',
    status: 'SCHEDULED',
    recordedBy: '홍길동',
    recordedAt: '2025-05-29T07:00:00Z',
  },
];

const mockPositionRecords: PositionChangeRecord[] = [
  {
    id: 'pos-001',
    residentId: 'resident-001',
    residentName: '김철수',
    changeTime: '2025-05-29T10:00:00Z',
    fromPosition: 'SUPINE',
    toPosition: 'LEFT_LATERAL',
    skinCondition: 'NORMAL',
    notes: '정기 체위변경',
    recordedBy: '홍길동',
    recordedAt: '2025-05-29T10:00:00Z',
  },
];

const mockCareActivities: CareActivity[] = [
  {
    id: 'care-001',
    type: 'BATHING',
    residentId: 'resident-001',
    residentName: '김철수',
    scheduledTime: '09:00',
    actualTime: '2025-05-29T09:15:00Z',
    duration: 30,
    status: 'COMPLETED',
    notes: '전신 목욕 완료',
    recordedBy: '홍길동',
    recordedAt: '2025-05-29T09:45:00Z',
  },
];

const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    residentId: 'resident-001',
    residentName: '김철수',
    type: 'HOSPITAL',
    title: '신경과 정기 진료',
    scheduledDate: '2025-05-30',
    scheduledTime: '14:00',
    duration: 60,
    hospital: '서울대병원',
    department: '신경과',
    purpose: '정기 진료 및 MRI 검사',
    accompaniedBy: '김영희(딸)',
    transportation: '가족 차량',
    status: 'SCHEDULED',
  },
];

const mockNursingNotes: NursingNote[] = [
  {
    id: 'note-001',
    residentId: 'resident-001',
    residentName: '김철수',
    noteType: 'DAILY_OBSERVATION',
    title: '일상 관찰 기록',
    content: '오늘 컨디션 양호, 식욕 정상, 수면 패턴 안정적',
    priority: 'MEDIUM',
    tags: ['일상관찰', '컨디션양호'],
    recordedBy: '홍길동',
    recordedAt: '2025-05-29T16:00:00Z',
  },
];

const initialState: NursingState = {
  medicationRecords: [],
  positionChangeRecords: [],
  careActivities: [],
  appointments: [],
  nursingNotes: [],
  selectedResident: null,
  selectedDate: new Date().toISOString().split('T')[0],
  filterType: 'all',
  isRecording: false,
  currentRecord: null,
  isLoading: false,
  error: null,
};

const nursingSlice = createSlice({
  name: 'nursing',
  initialState,
  reducers: {
    setSelectedResident: (state, action: PayloadAction<string | null>) => {
      state.selectedResident = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setFilterType: (state, action: PayloadAction<NursingState['filterType']>) => {
      state.filterType = action.payload;
    },
    addMedicationRecord: (state, action: PayloadAction<Omit<MedicationRecord, 'id' | 'recordedAt'>>) => {
      const newRecord: MedicationRecord = {
        id: `med-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.medicationRecords.unshift(newRecord);
    },
    updateMedicationRecord: (state, action: PayloadAction<{
      id: string;
      updates: Partial<MedicationRecord>;
    }>) => {
      const { id, updates } = action.payload;
      const recordIndex = state.medicationRecords.findIndex(r => r.id === id);
      if (recordIndex !== -1) {
        state.medicationRecords[recordIndex] = {
          ...state.medicationRecords[recordIndex],
          ...updates,
        };
      }
    },
    addPositionChangeRecord: (state, action: PayloadAction<Omit<PositionChangeRecord, 'id' | 'recordedAt'>>) => {
      const newRecord: PositionChangeRecord = {
        id: `pos-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.positionChangeRecords.unshift(newRecord);
    },
    addCareActivity: (state, action: PayloadAction<Omit<CareActivity, 'id' | 'recordedAt'>>) => {
      const newActivity: CareActivity = {
        id: `care-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.careActivities.unshift(newActivity);
    },
    addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id'>>) => {
      const newAppointment: Appointment = {
        id: `appt-${Date.now()}`,
        ...action.payload,
      };
      state.appointments.push(newAppointment);
    },
    updateAppointment: (state, action: PayloadAction<{
      id: string;
      updates: Partial<Appointment>;
    }>) => {
      const { id, updates } = action.payload;
      const appointmentIndex = state.appointments.findIndex(a => a.id === id);
      if (appointmentIndex !== -1) {
        state.appointments[appointmentIndex] = {
          ...state.appointments[appointmentIndex],
          ...updates,
        };
      }
    },
    addNursingNote: (state, action: PayloadAction<Omit<NursingNote, 'id' | 'recordedAt'>>) => {
      const newNote: NursingNote = {
        id: `note-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.nursingNotes.unshift(newNote);
    },
    startRecording: (state, action: PayloadAction<{
      type: 'medication' | 'position' | 'care' | 'note';
      data?: any;
    }>) => {
      state.isRecording = true;
      state.currentRecord = action.payload;
    },
    cancelRecording: (state) => {
      state.isRecording = false;
      state.currentRecord = null;
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
      // fetchMedicationRecords
      .addCase(fetchMedicationRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicationRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicationRecords = action.payload.content.map(transformApiMedicationRecord);
      })
      .addCase(fetchMedicationRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '투약 기록 조회에 실패했습니다.';
      })
      // createMedicationRecord
      .addCase(createMedicationRecord.fulfilled, (state, action) => {
        const newRecord = transformApiMedicationRecord({
          id: action.payload.id,
          resident_id: action.payload.resident_id,
          caregiver_id: action.payload.caregiver_id,
          medication_name: action.payload.medication_name,
          dosage: action.payload.dosage,
          scheduled_time: action.payload.scheduled_time,
          actual_time: action.payload.actual_time,
          status: action.payload.status,
          notes: action.payload.notes,
          recorded_at: action.payload.recorded_at,
          created_at: action.payload.created_at,
        });
        state.medicationRecords.unshift(newRecord);
      })
      // fetchPositionChangeRecords
      .addCase(fetchPositionChangeRecords.fulfilled, (state, action) => {
        state.positionChangeRecords = action.payload.content.map(transformApiPositionRecord);
      })
      // createPositionChangeRecord
      .addCase(createPositionChangeRecord.fulfilled, (state, action) => {
        const newRecord = transformApiPositionRecord({
          id: action.payload.id,
          resident_id: action.payload.resident_id,
          caregiver_id: action.payload.caregiver_id,
          change_time: action.payload.change_time,
          from_position: action.payload.from_position,
          to_position: action.payload.to_position,
          skin_condition: action.payload.skin_condition,
          notes: action.payload.notes,
          created_at: action.payload.created_at,
        });
        state.positionChangeRecords.unshift(newRecord);
      })
      // fetchAppointments
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload.content.map(transformApiAppointment);
      })
      // fetchCareSchedules
      .addCase(fetchCareSchedules.fulfilled, (state, action) => {
        // CareActivity로 매핑 (또는 새로운 필드 추가)
        state.careActivities = action.payload.content.map(schedule => ({
          id: schedule.id,
          type: (schedule.type as any) || 'OTHER',
          residentId: schedule.resident_id || '',
          residentName: schedule.resident_name || '',
          actualTime: schedule.scheduled_time,
          duration: schedule.duration_minutes,
          status: (schedule.status as any) || 'COMPLETED',
          notes: schedule.notes,
          recordedBy: schedule.caregiver_name || '',
          recordedAt: schedule.created_at || '',
        }));
      });
  },
});

export const {
  setSelectedResident,
  setSelectedDate,
  setFilterType,
  addMedicationRecord,
  updateMedicationRecord,
  addPositionChangeRecord,
  addCareActivity,
  addAppointment,
  updateAppointment,
  addNursingNote,
  startRecording,
  cancelRecording,
  setLoading,
  setError,
} = nursingSlice.actions;

// 비동기 액션들은 이미 위에서 export되었으므로 별도 export 불필요

export default nursingSlice.reducer;