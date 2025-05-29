import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  isLoading: boolean;
  error: string | null;
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
  seniors: mockSeniors,
  urgentAlerts: mockSeniors.flatMap(s => s.alerts.filter(a => !a.acknowledged && a.severity === 'high')),
  selectedSenior: null,
  isRecording: false,
  newVitals: {},
  filterStatus: 'all',
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

export default vitalsSlice.reducer;