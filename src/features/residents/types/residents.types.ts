export interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  lastChecked: string;
}

export interface ResidentDetail {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  room: string;
  conditions: string[];
  warnings?: string[];
  medications?: string[];
  careLevel: string;
  emergencyContact: string;
  todaySchedule: string[];
  recentNotes: string[];
  vitalSigns?: VitalSigns;
}

export type ResidentTabType = 'all' | 'today' | 'urgent';
