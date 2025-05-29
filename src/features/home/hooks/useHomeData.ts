import { useState, useEffect, useMemo } from 'react';
import { GraduationCap, Bell, BarChart3, Settings } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useAppSelector } from '@/store';
import type { HomeData, QuickAccessItem } from '../types/home.types';

export function useHomeData() {
  const { todoList, todayShift } = useAppSelector((state) => state.schedule);
  const { urgentAlerts } = useAppSelector((state) => state.vitals);

  // Redux 데이터를 기반으로 홈 데이터 계산
  const homeData = useMemo((): HomeData => {
    const completedTodos = todoList.filter(todo => todo.completed);
    const progressPercentage = todoList.length > 0 
      ? Math.round((completedTodos.length / todoList.length) * 100) 
      : 0;

    return {
      todayProgress: {
        total: todoList.length,
        completed: completedTodos.length,
        percentage: progressPercentage,
      },
      urgentAnnouncements: urgentAlerts.length > 0 ? [
        {
          id: 1,
          title: `긴급: ${urgentAlerts.length}건의 바이탈 알림`,
          content: '바이탈 사인 확인이 필요한 환자가 있습니다.',
          isUrgent: true,
        },
      ] : [
        {
          id: 1,
          title: '오늘 오후 2시 전체 교육 실시',
          content: '감염 예방 교육이 있습니다.',
          isUrgent: true,
        },
      ],
      weeklyGoal: {
        target: 100,
        current: 75,
        percentage: 75,
      },
      todaySchedule: todoList.slice(0, 3).map(todo => ({
        time: todo.dueTime || '시간 미정',
        title: todo.title,
        description: todo.description || '',
      })),
    };
  }, [todoList, urgentAlerts]);

  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: GraduationCap,
      label: '교육자료',
      path: ROUTES.EDUCATION,
      color: 'bg-blue-500',
    },
    {
      icon: Bell,
      label: '공지사항',
      path: ROUTES.ANNOUNCEMENTS,
      color: 'bg-green-500',
    },
    {
      icon: BarChart3,
      label: '마이페이지',
      path: ROUTES.MYPAGE,
      color: 'bg-purple-500',
    },
    {
      icon: Settings,
      label: '설정',
      path: ROUTES.SETTINGS,
      color: 'bg-gray-500',
    },
  ];

  return {
    homeData,
    quickAccessItems,
  };
}
