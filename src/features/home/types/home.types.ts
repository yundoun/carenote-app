export interface TodayProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface UrgentAnnouncement {
  id: number;
  title: string;
  content: string;
  isUrgent: boolean;
}

export interface WeeklyGoal {
  target: number;
  current: number;
  percentage: number;
}

export interface QuickAccessItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  color: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  id?: string;
  type?: 'task' | 'appointment' | 'meeting' | 'shift';
  priority?: 'high' | 'medium' | 'low';
  status?: string;
}

export interface HomeData {
  todayProgress: TodayProgress;
  urgentAnnouncements: UrgentAnnouncement[];
  weeklyGoal: WeeklyGoal;
  todaySchedule: ScheduleItem[];
}