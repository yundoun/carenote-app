import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  NursingService,
  type NursingRecordsInfo,
  type MedicationRecordWithResident,
  type PositionChangeRecordWithResident,
  type NursingNoteWithResident,
  type NursingNoteRecord,
} from '@/services/nursing.service';

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
  fromPosition:
    | 'SUPINE'
    | 'LEFT_LATERAL'
    | 'RIGHT_LATERAL'
    | 'PRONE'
    | 'SITTING';
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
  noteType:
    | 'DAILY_OBSERVATION'
    | 'INCIDENT'
    | 'BEHAVIOR'
    | 'MEDICAL'
    | 'FAMILY_COMMUNICATION';
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
  filterType:
    | 'all'
    | 'medication'
    | 'position'
    | 'care'
    | 'appointments'
    | 'notes';
  isRecording: boolean;
  currentRecord: any | null;
  isLoading: boolean;
  error: string | null;
  // 통계 정보
  totalMedications: number;
  completedMedications: number;
  missedMedications: number;
  totalPositionChanges: number;
  totalNursingNotes: number;
}

// 새로운 API 비동기 액션들
export const fetchTodayNursingRecords = createAsyncThunk(
  'nursing/fetchTodayRecords',
  async (params: { caregiverId: string; date?: string }) => {
    const response = await NursingService.getTodayNursingRecords(
      params.caregiverId,
      params.date
    );
    return response.data;
  }
);

export const fetchResidentNursingRecords = createAsyncThunk(
  'nursing/fetchResidentRecords',
  async (params: {
    residentId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await NursingService.getResidentNursingRecords(
      params.residentId,
      params.startDate,
      params.endDate
    );
    return response.data;
  }
);

export const createNewMedicationRecord = createAsyncThunk(
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
      dosage: recordData.dosage || null,
      scheduled_time: recordData.scheduled_time || null,
      actual_time: recordData.actual_time || null,
      notes: recordData.notes || null,
      recorded_at: new Date().toISOString(),
    });
    return response.data;
  }
);

export const createNewPositionChangeRecord = createAsyncThunk(
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
    const response = await NursingService.createPositionChangeRecord({
      ...recordData,
      from_position: recordData.from_position || null,
      to_position: recordData.to_position || null,
      skin_condition: recordData.skin_condition || null,
      notes: recordData.notes || null,
    });
    return response.data;
  }
);

export const updateMedicationRecordStatus = createAsyncThunk(
  'nursing/updateMedicationRecord',
  async (params: { recordId: string; updates: any }) => {
    const response = await NursingService.updateMedicationRecord(
      params.recordId,
      params.updates
    );
    return { ...response.data, recordId: params.recordId };
  }
);

export const createNewNursingNote = createAsyncThunk(
  'nursing/createNursingNote',
  async (noteData: {
    resident_id: string;
    caregiver_id: string;
    note_type:
      | 'DAILY_OBSERVATION'
      | 'INCIDENT'
      | 'BEHAVIOR'
      | 'MEDICAL'
      | 'FAMILY_COMMUNICATION';
    title: string;
    content: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    tags?: string[];
    attachments?: any;
  }) => {
    const response = await NursingService.createNursingNote({
      ...noteData,
      priority: noteData.priority || 'MEDIUM',
      tags: noteData.tags || null,
      attachments: noteData.attachments || null,
    });
    return response.data;
  }
);

export const updateNursingNoteData = createAsyncThunk(
  'nursing/updateNursingNote',
  async (params: { noteId: string; updates: Partial<NursingNoteRecord> }) => {
    const response = await NursingService.updateNursingNote(
      params.noteId,
      params.updates
    );
    return { ...response.data, noteId: params.noteId };
  }
);

// API 응답을 Redux 타입으로 변환하는 함수들
function transformApiMedicationRecord(
  apiRecord: MedicationRecordWithResident
): MedicationRecord {
  return {
    id: apiRecord.id,
    residentId: apiRecord.resident_id!,
    residentName: apiRecord.resident?.name || '',
    medicationName: apiRecord.medication_name,
    dosage: apiRecord.dosage || '',
    scheduledTime: apiRecord.scheduled_time || '',
    actualTime: apiRecord.actual_time || undefined,
    status: apiRecord.status as
      | 'SCHEDULED'
      | 'COMPLETED'
      | 'MISSED'
      | 'REFUSED',
    notes: apiRecord.notes || undefined,
    recordedBy: apiRecord.caregiver?.name || '',
    recordedAt: apiRecord.recorded_at || apiRecord.created_at || '',
  };
}

function transformApiPositionRecord(
  apiRecord: PositionChangeRecordWithResident
): PositionChangeRecord {
  return {
    id: apiRecord.id,
    residentId: apiRecord.resident_id!,
    residentName: apiRecord.resident?.name || '',
    changeTime: apiRecord.change_time,
    fromPosition: (apiRecord.from_position || 'SUPINE') as any,
    toPosition: (apiRecord.to_position || 'SUPINE') as any,
    skinCondition: (apiRecord.skin_condition || 'NORMAL') as any,
    notes: apiRecord.notes || undefined,
    recordedBy: apiRecord.caregiver?.name || '',
    recordedAt: apiRecord.created_at || '',
  };
}

const transformApiNursingNote = (
  apiNote: NursingNoteWithResident
): NursingNote => ({
  id: apiNote.id,
  residentId: apiNote.resident_id || '',
  residentName: apiNote.resident?.name || '알 수 없음',
  noteType: apiNote.note_type as any,
  title: apiNote.title,
  content: apiNote.content,
  priority: apiNote.priority as any,
  tags: apiNote.tags || [],
  attachments: apiNote.attachments,
  recordedBy: apiNote.caregiver?.name || '알 수 없음',
  recordedAt: apiNote.created_at || new Date().toISOString(),
});

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
  totalMedications: 0,
  completedMedications: 0,
  missedMedications: 0,
  totalPositionChanges: 0,
  totalNursingNotes: 0,
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
    setFilterType: (
      state,
      action: PayloadAction<typeof initialState.filterType>
    ) => {
      state.filterType = action.payload;
    },
    startRecording: (
      state,
      action: PayloadAction<{ type: string; data?: any }>
    ) => {
      state.isRecording = true;
      state.currentRecord = {
        type: action.payload.type,
        ...action.payload.data,
      };
    },
    cancelRecording: (state) => {
      state.isRecording = false;
      state.currentRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addMedicationRecord: (
      state,
      action: PayloadAction<Omit<MedicationRecord, 'id' | 'recordedAt'>>
    ) => {
      const newRecord: MedicationRecord = {
        ...action.payload,
        id: Date.now().toString(),
        recordedAt: new Date().toISOString(),
      };
      state.medicationRecords.unshift(newRecord);
      state.totalMedications += 1;
      if (newRecord.status === 'COMPLETED') {
        state.completedMedications += 1;
      } else if (newRecord.status === 'MISSED') {
        state.missedMedications += 1;
      }
    },
    updateMedicationRecord: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<MedicationRecord> }>
    ) => {
      const { id, updates } = action.payload;
      const recordIndex = state.medicationRecords.findIndex((r) => r.id === id);
      if (recordIndex !== -1) {
        const oldStatus = state.medicationRecords[recordIndex].status;
        state.medicationRecords[recordIndex] = {
          ...state.medicationRecords[recordIndex],
          ...updates,
        };

        // 상태 변경에 따른 통계 업데이트
        if (oldStatus !== updates.status) {
          if (oldStatus === 'COMPLETED') state.completedMedications -= 1;
          if (oldStatus === 'MISSED') state.missedMedications -= 1;
          if (updates.status === 'COMPLETED') state.completedMedications += 1;
          if (updates.status === 'MISSED') state.missedMedications += 1;
        }
      }
    },
    addPositionChangeRecord: (
      state,
      action: PayloadAction<Omit<PositionChangeRecord, 'id' | 'recordedAt'>>
    ) => {
      const newRecord: PositionChangeRecord = {
        ...action.payload,
        id: Date.now().toString(),
        recordedAt: new Date().toISOString(),
      };
      state.positionChangeRecords.unshift(newRecord);
      state.totalPositionChanges += 1;
    },
    addCareActivity: (
      state,
      action: PayloadAction<Omit<CareActivity, 'id' | 'recordedAt'>>
    ) => {
      const newActivity: CareActivity = {
        ...action.payload,
        id: Date.now().toString(),
        recordedAt: new Date().toISOString(),
      };
      state.careActivities.unshift(newActivity);
    },
    addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id'>>) => {
      const newAppointment: Appointment = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.appointments.unshift(newAppointment);
    },
    updateAppointment: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Appointment> }>
    ) => {
      const { id, updates } = action.payload;
      const appointmentIndex = state.appointments.findIndex((a) => a.id === id);
      if (appointmentIndex !== -1) {
        state.appointments[appointmentIndex] = {
          ...state.appointments[appointmentIndex],
          ...updates,
        };
      }
    },
    addNursingNote: (
      state,
      action: PayloadAction<Omit<NursingNote, 'id' | 'recordedAt'>>
    ) => {
      const newNote: NursingNote = {
        ...action.payload,
        id: Date.now().toString(),
        recordedAt: new Date().toISOString(),
      };
      state.nursingNotes.unshift(newNote);
      state.totalNursingNotes += 1;
    },
    updateNursingNote: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<NursingNote> }>
    ) => {
      const { id, updates } = action.payload;
      const noteIndex = state.nursingNotes.findIndex((n) => n.id === id);
      if (noteIndex !== -1) {
        state.nursingNotes[noteIndex] = {
          ...state.nursingNotes[noteIndex],
          ...updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodayNursingRecords
      .addCase(fetchTodayNursingRecords.pending, (state) => {
        console.log('🔄 fetchTodayNursingRecords.pending - 로딩 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayNursingRecords.fulfilled, (state, action) => {
        console.log('✅ fetchTodayNursingRecords.fulfilled - 데이터 수신 성공');
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        const data = action.payload;

        state.medicationRecords = data.medicationRecords.map(
          transformApiMedicationRecord
        );
        state.positionChangeRecords = data.positionChangeRecords.map(
          transformApiPositionRecord
        );
        state.nursingNotes = data.nursingNotes.map(transformApiNursingNote);
        state.totalMedications = data.totalMedications;
        state.completedMedications = data.completedMedications;
        state.missedMedications = data.missedMedications;
        state.totalPositionChanges = data.totalPositionChanges;
        state.totalNursingNotes = data.totalNursingNotes;

        console.log('📋 Store 업데이트 완료:', {
          medications: state.medicationRecords.length,
          positions: state.positionChangeRecords.length,
          notes: state.nursingNotes.length,
        });
      })
      .addCase(fetchTodayNursingRecords.rejected, (state, action) => {
        console.error(
          '❌ fetchTodayNursingRecords.rejected - 데이터 수신 실패'
        );
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '간병 기록 조회에 실패했습니다.';
      })

      // fetchResidentNursingRecords
      .addCase(fetchResidentNursingRecords.pending, (state) => {
        console.log('🔄 fetchResidentNursingRecords.pending - 로딩 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResidentNursingRecords.fulfilled, (state, action) => {
        console.log(
          '✅ fetchResidentNursingRecords.fulfilled - 데이터 수신 성공'
        );
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        const data = action.payload;

        state.medicationRecords = data.medicationRecords.map(
          transformApiMedicationRecord
        );
        state.positionChangeRecords = data.positionChangeRecords.map(
          transformApiPositionRecord
        );
        state.nursingNotes = data.nursingNotes.map(transformApiNursingNote);
        state.totalMedications = data.totalMedications;
        state.completedMedications = data.completedMedications;
        state.missedMedications = data.missedMedications;
        state.totalPositionChanges = data.totalPositionChanges;
        state.totalNursingNotes = data.totalNursingNotes;

        console.log('📋 거주자 간병 기록 업데이트 완료');
      })
      .addCase(fetchResidentNursingRecords.rejected, (state, action) => {
        console.error(
          '❌ fetchResidentNursingRecords.rejected - 데이터 수신 실패'
        );
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error =
          action.error.message || '거주자 간병 기록 조회에 실패했습니다.';
      })

      // createNewMedicationRecord
      .addCase(createNewMedicationRecord.pending, (state) => {
        console.log('🔄 createNewMedicationRecord.pending - 생성 시작');
        state.isLoading = true;
      })
      .addCase(createNewMedicationRecord.fulfilled, (state, action) => {
        console.log('✅ createNewMedicationRecord.fulfilled - 생성 성공');
        console.log('📊 생성된 데이터:', action.payload);

        state.isLoading = false;
        state.error = null;
        // TODO: 새로 생성된 기록을 현재 목록에 추가하는 로직
      })
      .addCase(createNewMedicationRecord.rejected, (state, action) => {
        console.error('❌ createNewMedicationRecord.rejected - 생성 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '투약 기록 생성에 실패했습니다.';
      })

      // createNewPositionChangeRecord
      .addCase(createNewPositionChangeRecord.pending, (state) => {
        console.log('🔄 createNewPositionChangeRecord.pending - 생성 시작');
        state.isLoading = true;
      })
      .addCase(createNewPositionChangeRecord.fulfilled, (state, action) => {
        console.log('✅ createNewPositionChangeRecord.fulfilled - 생성 성공');
        console.log('📊 생성된 데이터:', action.payload);

        state.isLoading = false;
        state.error = null;
        // TODO: 새로 생성된 기록을 현재 목록에 추가하는 로직
      })
      .addCase(createNewPositionChangeRecord.rejected, (state, action) => {
        console.error('❌ createNewPositionChangeRecord.rejected - 생성 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error =
          action.error.message || '체위변경 기록 생성에 실패했습니다.';
      })

      // updateMedicationRecordStatus
      .addCase(updateMedicationRecordStatus.pending, (state) => {
        console.log('🔄 updateMedicationRecordStatus.pending - 업데이트 시작');
      })
      .addCase(updateMedicationRecordStatus.fulfilled, (state, action) => {
        console.log(
          '✅ updateMedicationRecordStatus.fulfilled - 업데이트 성공'
        );
        console.log('📊 업데이트된 데이터:', action.payload);

        state.error = null;
        // TODO: 업데이트된 기록을 현재 목록에 반영하는 로직
      })
      .addCase(updateMedicationRecordStatus.rejected, (state, action) => {
        console.error(
          '❌ updateMedicationRecordStatus.rejected - 업데이트 실패'
        );
        console.error('오류 정보:', action.error);

        state.error =
          action.error.message || '투약 기록 업데이트에 실패했습니다.';
      })

      // createNewNursingNote
      .addCase(createNewNursingNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewNursingNote.fulfilled, (state, action) => {
        state.isLoading = false;
        // API에서 반환된 단순 NursingNoteRecord를 Redux NursingNote로 변환
        const newNote: NursingNote = {
          id: action.payload.id,
          residentId: action.payload.resident_id || '',
          residentName: '알 수 없음', // API에서 join 정보가 없으므로 기본값
          noteType: action.payload.note_type as any,
          title: action.payload.title,
          content: action.payload.content,
          priority: action.payload.priority as any,
          tags: action.payload.tags || [],
          attachments: action.payload.attachments,
          recordedBy: '알 수 없음', // API에서 join 정보가 없으므로 기본값
          recordedAt: action.payload.created_at || new Date().toISOString(),
        };
        state.nursingNotes.unshift(newNote);
        state.totalNursingNotes += 1;
      })
      .addCase(createNewNursingNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '간호 기록 생성에 실패했습니다.';
      })

      // updateNursingNoteData
      .addCase(updateNursingNoteData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNursingNoteData.fulfilled, (state, action) => {
        state.isLoading = false;
        // API에서 반환된 단순 NursingNoteRecord를 Redux NursingNote로 변환
        const updatedNote: NursingNote = {
          id: action.payload.id,
          residentId: action.payload.resident_id || '',
          residentName: '알 수 없음', // API에서 join 정보가 없으므로 기본값
          noteType: action.payload.note_type as any,
          title: action.payload.title,
          content: action.payload.content,
          priority: action.payload.priority as any,
          tags: action.payload.tags || [],
          attachments: action.payload.attachments,
          recordedBy: '알 수 없음', // API에서 join 정보가 없으므로 기본값
          recordedAt: action.payload.created_at || new Date().toISOString(),
        };
        const noteIndex = state.nursingNotes.findIndex(
          (n) => n.id === action.payload.noteId
        );
        if (noteIndex !== -1) {
          state.nursingNotes[noteIndex] = updatedNote;
        }
      })
      .addCase(updateNursingNoteData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || '간호 기록 업데이트에 실패했습니다.';
      });
  },
});

export const {
  setSelectedResident,
  setSelectedDate,
  setFilterType,
  startRecording,
  cancelRecording,
  clearError,
  addMedicationRecord,
  updateMedicationRecord,
  addPositionChangeRecord,
  addCareActivity,
  addAppointment,
  updateAppointment,
  addNursingNote,
  updateNursingNote,
} = nursingSlice.actions;

export default nursingSlice.reducer;
