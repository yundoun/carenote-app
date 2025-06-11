import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  VitalsService,
  type VitalStatusInfo,
  type VitalRecord,
  type VitalRecordWithResident,
  type AutoVitalData,
} from '@/services/vitals.service';

export interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  weight?: number;
  bloodSugar?: number;
  oxygenSaturation?: number;
  timestamp: string;
  notes?: string;
  recordedBy: string;
}

export interface VitalAlert {
  id: string;
  seniorId: string;
  seniorName: string;
  type: 'high_bp' | 'low_bp' | 'high_temp' | 'low_temp' | 'irregular_hr' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Senior {
  id: string;
  name: string;
  age: number;
  room: string;
  conditions: string[];
  latestVitals: VitalSigns | null;
  vitalHistory: VitalSigns[];
  alerts: VitalAlert[];
  nextScheduledCheck: string;
}

export interface VitalsState {
  seniors: Senior[];
  urgentAlerts: VitalAlert[];
  selectedSenior: Senior | null;
  isRecording: boolean;
  newVitals: Partial<VitalSigns>;
  filterStatus: 'all' | 'urgent' | 'normal' | 'overdue';
  vitalStatusInfo: VitalStatusInfo | null;
  isLoading: boolean;
  error: string | null;
}

// API 비동기 액션들
export const fetchVitalStatus = createAsyncThunk(
  'vitals/fetchStatus',
  async (params?: { unitId?: string; date?: string }) => {
    const response = await VitalsService.getVitalStatus(
      params?.unitId,
      params?.date
    );
    return response.data;
  }
);

export const createVitalRecord = createAsyncThunk(
  'vitals/createRecord',
  async (vitalData: {
    resident_id: string;
    measured_by: string;
    measured_at: string;
    systolic_bp?: number;
    diastolic_bp?: number;
    heart_rate?: number;
    temperature?: number;
    respiratory_rate?: number;
    blood_oxygen?: number;
    blood_sugar?: number;
    weight?: number;
    notes?: string;
  }) => {
    const response = await VitalsService.createVitalRecord(vitalData);
    return response.data;
  }
);

export const createAutoVitalRecord = createAsyncThunk(
  'vitals/createAutoRecord',
  async (autoData: AutoVitalData) => {
    const response = await VitalsService.createAutoVitalRecord(autoData);
    return response.data;
  }
);

export const fetchResidentVitalHistory = createAsyncThunk(
  'vitals/fetchHistory',
  async (params: {
    residentId: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    const response = await VitalsService.getResidentVitalHistory(
      params.residentId,
      params.startDate,
      params.endDate,
      params.limit
    );
    return { residentId: params.residentId, history: response.data };
  }
);

export const updateVitalRecord = createAsyncThunk(
  'vitals/updateRecord',
  async (params: { recordId: string; updates: Partial<VitalRecord> }) => {
    const response = await VitalsService.updateVitalRecord(
      params.recordId,
      params.updates
    );
    return response.data;
  }
);

export const createSampleVitalData = createAsyncThunk(
  'vitals/createSampleData',
  async () => {
    const response = await VitalsService.createSampleVitalRecords();
    return response.data;
  }
);

export const deleteVitalRecord = createAsyncThunk(
  'vitals/deleteRecord',
  async (recordId: string) => {
    const response = await VitalsService.deleteVitalRecord(recordId);
    return { ...response.data, recordId };
  }
);

export const deleteMultipleVitalRecords = createAsyncThunk(
  'vitals/deleteMultipleRecords',
  async (recordIds: string[]) => {
    const response = await VitalsService.deleteMultipleVitalRecords(recordIds);
    return { ...response.data, recordIds };
  }
);

// API 응답을 Redux 타입으로 변환하는 함수들
function transformApiVitalToRedux(apiRecord: VitalRecordWithResident): VitalSigns {
  return {
    bloodPressureSystolic: apiRecord.systolic_bp || 0,
    bloodPressureDiastolic: apiRecord.diastolic_bp || 0,
    heartRate: apiRecord.heart_rate || 0,
    temperature: apiRecord.temperature || 0,
    weight: apiRecord.weight,
    bloodSugar: apiRecord.blood_sugar,
    oxygenSaturation: apiRecord.blood_oxygen,
    timestamp: apiRecord.measured_at,
    notes: apiRecord.notes || undefined,
    recordedBy: apiRecord.measurer?.name || apiRecord.measured_by,
  };
}

function transformVitalStatusToSeniors(statusInfo: VitalStatusInfo): Senior[] {
  return statusInfo.residents.map((resident) => {
    const lastVitals = resident.last_vitals;
    const latestVitals: VitalSigns | null = lastVitals
      ? {
          bloodPressureSystolic: lastVitals.blood_pressure
            ? parseInt(lastVitals.blood_pressure.split('/')[0])
            : 0,
          bloodPressureDiastolic: lastVitals.blood_pressure
            ? parseInt(lastVitals.blood_pressure.split('/')[1])
            : 0,
          heartRate: lastVitals.heart_rate || 0,
          temperature: lastVitals.temperature || 0,
          timestamp: lastVitals.measured_at || '',
          recordedBy: '간병인',
        }
      : null;

    // 알림 생성 로직
    const alerts: VitalAlert[] = [];
    if (latestVitals) {
      // 혈압 체크
      if (latestVitals.bloodPressureSystolic > 140) {
        alerts.push({
          id: `bp_${resident.id}_${Date.now()}`,
          seniorId: resident.id,
          seniorName: resident.name,
          type: 'high_bp',
          severity: latestVitals.bloodPressureSystolic > 160 ? 'high' : 'medium',
          message: `혈압이 높습니다 (${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic})`,
          timestamp: latestVitals.timestamp,
          acknowledged: false,
        });
      }

      // 체온 체크
      if (latestVitals.temperature > 37.5) {
        alerts.push({
          id: `temp_${resident.id}_${Date.now()}`,
          seniorId: resident.id,
          seniorName: resident.name,
          type: 'high_temp',
          severity: latestVitals.temperature > 38.5 ? 'high' : 'medium',
          message: `체온이 높습니다 (${latestVitals.temperature}°C)`,
          timestamp: latestVitals.timestamp,
          acknowledged: false,
        });
      }

      // 심박수 체크
      if (latestVitals.heartRate > 100 || latestVitals.heartRate < 60) {
        alerts.push({
          id: `hr_${resident.id}_${Date.now()}`,
          seniorId: resident.id,
          seniorName: resident.name,
          type: 'irregular_hr',
          severity: 'medium',
          message: `심박수가 비정상입니다 (${latestVitals.heartRate}bpm)`,
          timestamp: latestVitals.timestamp,
          acknowledged: false,
        });
      }
    }

    // 다음 체크 시간 계산
    const now = new Date();
    const nextHour = now.getHours() < 8 ? 8 : now.getHours() < 14 ? 14 : 20;
    const nextCheck = new Date();
    nextCheck.setHours(nextHour, 0, 0, 0);
    if (nextCheck <= now) {
      nextCheck.setDate(nextCheck.getDate() + 1);
      nextCheck.setHours(8, 0, 0, 0);
    }

    // 바이탈 히스토리 변환
    const vitalHistory: VitalSigns[] = (resident.vital_history || []).map((record: any) => ({
      bloodPressureSystolic: record.systolic_bp || 0,
      bloodPressureDiastolic: record.diastolic_bp || 0,
      heartRate: record.heart_rate || 0,
      temperature: record.temperature || 0,
      weight: record.weight,
      bloodSugar: record.blood_sugar,
      oxygenSaturation: record.blood_oxygen,
      timestamp: record.measured_at,
      notes: record.notes || undefined,
      recordedBy: '간병인',
    }));

    return {
      id: resident.id,
      name: resident.name,
      age: resident.age || 0, // API에서 age 정보 사용
      room: resident.room_number,
      conditions: [], // API에서 조건 정보가 없으므로 빈 배열
      latestVitals,
      vitalHistory,
      alerts,
      nextScheduledCheck: nextCheck.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });
}

const mockSeniors: Senior[] = [
  {
    id: '1',
    name: '김영희',
    age: 78,
    room: '301',
    conditions: ['고혈압', '당뇨'],
    latestVitals: {
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 90,
      heartRate: 75,
      temperature: 36.5,
      bloodSugar: 120,
      timestamp: new Date().toISOString(),
      recordedBy: '김요양',
    },
    vitalHistory: [],
    alerts: [
      {
        id: '1',
        seniorId: '1',
        seniorName: '김영희',
        type: 'high_bp',
        severity: 'medium',
        message: '혈압이 정상 범위를 초과했습니다 (140/90)',
        timestamp: new Date().toISOString(),
        acknowledged: false,
      },
    ],
    nextScheduledCheck: '14:00',
  },
  {
    id: '2',
    name: '홍길동',
    age: 85,
    room: '302',
    conditions: ['치매', '고혈압'],
    latestVitals: {
      bloodPressureSystolic: 130,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      temperature: 36.8,
      timestamp: new Date().toISOString(),
      recordedBy: '김요양',
    },
    vitalHistory: [],
    alerts: [],
    nextScheduledCheck: '16:00',
  },
];

const initialState: VitalsState = {
  seniors: [],
  urgentAlerts: [],
  selectedSenior: null,
  isRecording: false,
  newVitals: {},
  filterStatus: 'all',
  vitalStatusInfo: null,
  isLoading: false,
  error: null,
};

const vitalsSlice = createSlice({
  name: 'vitals',
  initialState,
  reducers: {
    setSelectedSenior: (state, action: PayloadAction<Senior | null>) => {
      state.selectedSenior = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<VitalsState['filterStatus']>) => {
      state.filterStatus = action.payload;
    },
    startRecording: (state, action: PayloadAction<string>) => {
      state.isRecording = true;
      state.selectedSenior = state.seniors.find(s => s.id === action.payload) || null;
      state.newVitals = {};
    },
    updateNewVitals: (state, action: PayloadAction<Partial<VitalSigns>>) => {
      state.newVitals = { ...state.newVitals, ...action.payload };
    },
    saveVitalRecord: (state, action: PayloadAction<{ seniorId: string; vitals: VitalSigns }>) => {
      const { seniorId, vitals } = action.payload;
      const senior = state.seniors.find(s => s.id === seniorId);
      
      if (senior) {
        // 최신 바이탈 업데이트
        senior.latestVitals = vitals;
        // 히스토리에 추가
        senior.vitalHistory.unshift(vitals);
        // 최대 100개 기록만 유지
        if (senior.vitalHistory.length > 100) {
          senior.vitalHistory = senior.vitalHistory.slice(0, 100);
        }
        
        // 알림 생성 로직
        const newAlerts: VitalAlert[] = [];
        
        // 혈압 체크
        if (vitals.bloodPressureSystolic > 140 || vitals.bloodPressureDiastolic > 90) {
          newAlerts.push({
            id: Date.now().toString(),
            seniorId,
            seniorName: senior.name,
            type: 'high_bp',
            severity: vitals.bloodPressureSystolic > 160 ? 'high' : 'medium',
            message: `혈압이 높습니다 (${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic})`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
        }
        
        // 체온 체크
        if (vitals.temperature > 37.5) {
          newAlerts.push({
            id: (Date.now() + 1).toString(),
            seniorId,
            seniorName: senior.name,
            type: 'high_temp',
            severity: vitals.temperature > 38.5 ? 'high' : 'medium',
            message: `체온이 높습니다 (${vitals.temperature}°C)`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
        }
        
        // 심박수 체크
        if (vitals.heartRate > 100 || vitals.heartRate < 60) {
          newAlerts.push({
            id: (Date.now() + 2).toString(),
            seniorId,
            seniorName: senior.name,
            type: 'irregular_hr',
            severity: 'medium',
            message: `심박수가 비정상입니다 (${vitals.heartRate}bpm)`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
        }
        
        senior.alerts.unshift(...newAlerts);
        state.urgentAlerts.unshift(...newAlerts.filter(a => a.severity === 'high'));
      }
      
      state.isRecording = false;
      state.newVitals = {};
    },
    acknowledgeAlert: (state, action: PayloadAction<string>) => {
      const alertId = action.payload;
      
      // 각 시니어의 알림에서 찾아서 acknowledged 상태 변경
      state.seniors.forEach(senior => {
        const alert = senior.alerts.find(a => a.id === alertId);
        if (alert) {
          alert.acknowledged = true;
        }
      });
      
      // urgentAlerts에서 제거
      state.urgentAlerts = state.urgentAlerts.filter(a => a.id !== alertId);
    },
    cancelRecording: (state) => {
      state.isRecording = false;
      state.newVitals = {};
      state.selectedSenior = null;
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
      // fetchVitalStatus
      .addCase(fetchVitalStatus.pending, (state) => {
        console.log('🔄 fetchVitalStatus.pending - 로딩 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVitalStatus.fulfilled, (state, action) => {
        console.log('✅ fetchVitalStatus.fulfilled - 데이터 수신 성공');
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        state.vitalStatusInfo = action.payload;
        state.seniors = transformVitalStatusToSeniors(action.payload);
        state.urgentAlerts = state.seniors.flatMap(s => 
          s.alerts.filter(a => !a.acknowledged && (a.severity === 'high' || a.severity === 'critical'))
        );

        console.log('📋 Store 업데이트 완료:', {
          seniors: state.seniors.length,
          urgentAlerts: state.urgentAlerts.length,
        });
      })
      .addCase(fetchVitalStatus.rejected, (state, action) => {
        console.error('❌ fetchVitalStatus.rejected - 데이터 수신 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '바이탈 현황 조회에 실패했습니다.';
      })

      // createVitalRecord
      .addCase(createVitalRecord.pending, (state) => {
        console.log('🔄 createVitalRecord.pending - 기록 생성 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVitalRecord.fulfilled, (state, action) => {
        console.log('✅ createVitalRecord.fulfilled - 기록 생성 성공');
        console.log('📊 생성된 데이터:', action.payload);

        state.isLoading = false;
        state.isRecording = false;
        state.newVitals = {};
        state.error = null;

        // 생성된 기록을 현재 seniors 데이터에 반영
        // 실제로는 fetchVitalStatus를 다시 호출하는 것이 좋음
      })
      .addCase(createVitalRecord.rejected, (state, action) => {
        console.error('❌ createVitalRecord.rejected - 기록 생성 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '바이탈 기록 생성에 실패했습니다.';
      })

      // createAutoVitalRecord
      .addCase(createAutoVitalRecord.pending, (state) => {
        console.log('🔄 createAutoVitalRecord.pending - 자동 기록 시작');
      })
      .addCase(createAutoVitalRecord.fulfilled, (state, action) => {
        console.log('✅ createAutoVitalRecord.fulfilled - 자동 기록 성공');
        console.log('📊 생성된 데이터:', action.payload);
        state.error = null;
      })
      .addCase(createAutoVitalRecord.rejected, (state, action) => {
        console.error('❌ createAutoVitalRecord.rejected - 자동 기록 실패');
        console.error('오류 정보:', action.error);
        state.error = action.error.message || '자동 바이탈 기록에 실패했습니다.';
      })

      // fetchResidentVitalHistory
      .addCase(fetchResidentVitalHistory.pending, (state) => {
        console.log('🔄 fetchResidentVitalHistory.pending - 히스토리 조회 시작');
        state.isLoading = true;
      })
      .addCase(fetchResidentVitalHistory.fulfilled, (state, action) => {
        console.log('✅ fetchResidentVitalHistory.fulfilled - 히스토리 조회 성공');
        console.log('📊 받은 데이터:', action.payload);

        state.isLoading = false;
        const { residentId, history } = action.payload;
        
        // 해당 거주자의 히스토리 업데이트
        const senior = state.seniors.find(s => s.id === residentId);
        if (senior) {
          senior.vitalHistory = history.map(transformApiVitalToRedux);
        }
      })
      .addCase(fetchResidentVitalHistory.rejected, (state, action) => {
        console.error('❌ fetchResidentVitalHistory.rejected - 히스토리 조회 실패');
        console.error('오류 정보:', action.error);

        state.isLoading = false;
        state.error = action.error.message || '바이탈 히스토리 조회에 실패했습니다.';
      })

      // updateVitalRecord
      .addCase(updateVitalRecord.pending, (state) => {
        console.log('🔄 updateVitalRecord.pending - 기록 업데이트 시작');
      })
      .addCase(updateVitalRecord.fulfilled, (state, action) => {
        console.log('✅ updateVitalRecord.fulfilled - 기록 업데이트 성공');
        console.log('📊 업데이트된 데이터:', action.payload);
        state.error = null;
      })
      .addCase(updateVitalRecord.rejected, (state, action) => {
        console.error('❌ updateVitalRecord.rejected - 기록 업데이트 실패');
        console.error('오류 정보:', action.error);
        state.error = action.error.message || '바이탈 기록 업데이트에 실패했습니다.';
      })

      // createSampleVitalData
      .addCase(createSampleVitalData.pending, (state) => {
        console.log('🔄 createSampleVitalData.pending - 샘플 데이터 생성 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSampleVitalData.fulfilled, (state, action) => {
        console.log('✅ createSampleVitalData.fulfilled - 샘플 데이터 생성 성공');
        console.log('📊 생성된 샘플 데이터:', action.payload.length);
        state.isLoading = false;
        state.error = null;
        // 샘플 데이터 생성 후 다시 조회하도록 유도
      })
      .addCase(createSampleVitalData.rejected, (state, action) => {
        console.error('❌ createSampleVitalData.rejected - 샘플 데이터 생성 실패');
        console.error('오류 정보:', action.error);
        state.isLoading = false;
        state.error = action.error.message || '샘플 바이탈 데이터 생성에 실패했습니다.';
      })

      // deleteVitalRecord
      .addCase(deleteVitalRecord.pending, (state) => {
        console.log('🔄 deleteVitalRecord.pending - 기록 삭제 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVitalRecord.fulfilled, (state, action) => {
        console.log('✅ deleteVitalRecord.fulfilled - 기록 삭제 성공');
        console.log('📊 삭제된 데이터:', action.payload);
        state.isLoading = false;
        state.error = null;
        
        // 삭제된 기록을 seniors의 vitalHistory에서 제거
        const deletedRecordId = action.payload.recordId;
        state.seniors.forEach(senior => {
          senior.vitalHistory = senior.vitalHistory.filter(
            vital => vital.timestamp !== deletedRecordId // 임시로 timestamp로 비교
          );
        });
      })
      .addCase(deleteVitalRecord.rejected, (state, action) => {
        console.error('❌ deleteVitalRecord.rejected - 기록 삭제 실패');
        console.error('오류 정보:', action.error);
        state.isLoading = false;
        state.error = action.error.message || '바이탈 기록 삭제에 실패했습니다.';
      })

      // deleteMultipleVitalRecords
      .addCase(deleteMultipleVitalRecords.pending, (state) => {
        console.log('🔄 deleteMultipleVitalRecords.pending - 일괄 삭제 시작');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMultipleVitalRecords.fulfilled, (state, action) => {
        console.log('✅ deleteMultipleVitalRecords.fulfilled - 일괄 삭제 성공');
        console.log('📊 삭제된 데이터:', action.payload);
        state.isLoading = false;
        state.error = null;
        
        // 삭제된 기록들을 seniors의 vitalHistory에서 제거
        const deletedRecordIds = action.payload.recordIds;
        state.seniors.forEach(senior => {
          senior.vitalHistory = senior.vitalHistory.filter(
            vital => !deletedRecordIds.includes(vital.timestamp) // 임시로 timestamp로 비교
          );
        });
      })
      .addCase(deleteMultipleVitalRecords.rejected, (state, action) => {
        console.error('❌ deleteMultipleVitalRecords.rejected - 일괄 삭제 실패');
        console.error('오류 정보:', action.error);
        state.isLoading = false;
        state.error = action.error.message || '바이탈 기록 일괄 삭제에 실패했습니다.';
      });
  },
});

export const {
  setSelectedSenior,
  setFilterStatus,
  startRecording,
  updateNewVitals,
  saveVitalRecord,
  acknowledgeAlert,
  cancelRecording,
  setLoading,
  setError,
} = vitalsSlice.actions;

// 비동기 액션들은 이미 위에서 정의 및 export되었음

export default vitalsSlice.reducer;