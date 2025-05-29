import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  medicationRecords: mockMedicationRecords,
  positionChangeRecords: mockPositionRecords,
  careActivities: mockCareActivities,
  appointments: mockAppointments,
  nursingNotes: mockNursingNotes,
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

export default nursingSlice.reducer;