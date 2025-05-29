import { useState, useEffect } from 'react';
import { GraduationCap, Bell, BarChart3, Settings } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import type { HomeData, QuickAccessItem } from '../types/home.types';

export function useHomeData() {
  const [homeData, setHomeData] = useState<HomeData>({
    todayProgress: {
      total: 8,
      completed: 5,
      percentage: 62.5
    },
    urgentAnnouncements: [
      {
        id: 1,
        title: '오늘 오후 2시 전체 교육 실시',
        content: '감염 예방 교육이 있습니다.',
        isUrgent: true
      }
    ],
    weeklyGoal: {
      target: 100,
      current: 75,
      percentage: 75
    },
    todaySchedule: [
      {
        time: '09:00',
        title: '김영희님 바이탈 측정',
        description: '혈압, 맥박, 체온 체크'
      },
      {
        time: '14:00',
        title: '전체 교육 참석',
        description: '감염 예방 교육'
      }
    ]
  });

  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: GraduationCap,
      label: '교육자료',
      path: ROUTES.EDUCATION,
      color: 'bg-blue-500'
    },
    {
      icon: Bell,
      label: '공지사항',
      path: ROUTES.ANNOUNCEMENTS,
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      label: '근무 통계',
      path: ROUTES.MYPAGE,
      color: 'bg-purple-500'
    },
    {
      icon: Settings,
      label: '설정',
      path: ROUTES.SETTINGS,
      color: 'bg-gray-500'
    }
  ];

  // TODO: 실제로는 API에서 데이터를 가져와야 함
  useEffect(() => {
    // API 호출 로직이 들어갈 자리
  }, []);

  return {
    homeData,
    quickAccessItems,
    setHomeData
  };
}