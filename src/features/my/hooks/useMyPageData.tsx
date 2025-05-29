import { useState, useEffect } from 'react';
import { Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import {
  UserProfile,
  WorkStats,
  Achievement,
  MenuItem,
} from '../types/my.types';

export function useMyPageData() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workStats, setWorkStats] = useState<WorkStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const menuItems: MenuItem[] = [
    {
      icon: <Bell className="h-5 w-5" />,
      label: '알림 설정',
      path: '/notifications',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: '설정',
      path: '/settings',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: '도움말',
      path: '/help',
    },
    {
      icon: <LogOut className="h-5 w-5" />,
      label: '로그아웃',
      path: '/logout',
    },
  ];

  useEffect(() => {
    const loadMockData = () => {
      // Mock user profile data
      setUserProfile({
        name: '김간호',
        role: '요양보호사',
        facility: '행복요양원',
        joinDate: '2023년 3월 15일',
        profileImage: '/placeholder.svg?height=100&width=100',
        employeeId: 'EMP2023001',
      });

      // Mock work statistics
      setWorkStats({
        totalShifts: 128,
        thisMonth: 14,
        completedEducation: 8,
        totalEducation: 12,
        todayTasksCompleted: 3,
        todayTasksTotal: 5,
        weeklyGoal: 25,
        weeklyCompleted: 18,
      });

      // Mock achievements
      setAchievements([
        {
          id: '1',
          title: '완벽한 한 주',
          description: '일주일 동안 모든 업무를 완료했습니다',
          earnedDate: '2024-01-15',
          icon: '🏆',
        },
        {
          id: '2',
          title: '교육 마스터',
          description: '필수 교육을 모두 완료했습니다',
          earnedDate: '2024-01-10',
          icon: '📚',
        },
        {
          id: '3',
          title: '케어 전문가',
          description: '100일 연속 근무를 달성했습니다',
          earnedDate: '2024-01-05',
          icon: '💪',
        },
      ]);

      setIsLoading(false);
    };

    // 실제 구현에서는 API 호출로 대체
    setTimeout(loadMockData, 1000);
  }, []);

  return {
    userProfile,
    workStats,
    achievements,
    menuItems,
    isLoading,
  };
}
