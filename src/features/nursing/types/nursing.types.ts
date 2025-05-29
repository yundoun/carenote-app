export interface MedicationRecord {
  id: string;
  seniorId: string;
  seniorName: string;
  medication: string;
  dosage: string;
  time: string;
  administered: boolean;
  administeredBy?: string;
  notes?: string;
  date: Date;
}

export interface PositionChangeRecord {
  id: string;
  seniorId: string;
  seniorName: string;
  fromPosition: string;
  toPosition: string;
  time: string;
  performedBy: string;
  notes?: string;
  date: Date;
}

export interface AppointmentRecord {
  id: string;
  seniorId: string;
  seniorName: string;
  type: 'hospital' | 'visit' | 'outing' | 'therapy';
  description: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  date: Date;
}

export interface NursingNote {
  id: string;
  seniorId: string;
  seniorName: string;
  category: 'general' | 'medication' | 'behavior' | 'health' | 'family';
  content: string;
  recordedBy: string;
  timestamp: Date;
}

export type RecordType = 'medication' | 'position' | 'appointment' | 'note';
