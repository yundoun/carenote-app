export interface WorkLocation {
  floor: string;
  unit: string;
  rooms: string[];
  totalRooms: number;
}

export interface Senior {
  id: string;
  name: string;
  room: string;
  age: number;
  conditions: string[];
  careLevel: string;
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

export interface HandoverNote {
  id: string;
  from: string;
  message: string;
  priority: 'urgent' | 'normal';
  timestamp: string;
}

export interface TodayShift {
  date: Date;
  startTime: string;
  endTime: string;
  shiftType: string;
  location: WorkLocation;
  assignedSeniors: Senior[];
  todoList: TodoItem[];
  handoverNotes: HandoverNote[];
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  hasShift: boolean;
  shiftType: string | null;
}

export type ScheduleView = 'today' | 'week' | 'month';
