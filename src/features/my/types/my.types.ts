export interface UserProfile {
  name: string;
  role: string;
  facility: string;
  joinDate: string;
  profileImage?: string;
  employeeId: string;
}

export interface WorkStats {
  totalShifts: number;
  thisMonth: number;
  completedEducation: number;
  totalEducation: number;
  todayTasksCompleted: number;
  todayTasksTotal: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: string;
}

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}
