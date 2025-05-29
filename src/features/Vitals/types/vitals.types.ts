export interface VitalSigns {
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  temperature: number;
  bloodSugar?: number;
  oxygen?: number;
  weight?: number;
  timestamp: Date;
  recordedBy: string;
  notes?: string;
}

export interface VitalThresholds {
  bloodPressure: { min: number; max: number };
  heartRate: { min: number; max: number };
  temperature: { min: number; max: number };
}

export interface Senior {
  id: string;
  name: string;
  room: string;
  age: number;
  conditions: string[];
  lastVitals?: VitalSigns;
  vitalHistory: VitalSigns[];
  alertThresholds: VitalThresholds;
}

export type VitalStatus = 'normal' | 'warning' | 'danger';

export type VitalsView = 'overview' | 'schedule' | 'history';

export interface VitalMeasurement {
  seniorId: string;
  scheduledTime: Date;
  status: 'pending' | 'completed' | 'overdue';
}
