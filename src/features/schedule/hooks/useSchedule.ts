import { useState, useMemo } from 'react';
import type {
  TodayShift,
  TodoItem,
  CalendarDay,
} from '../types/schedule.types';

export const useSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock data for today's shift
  const todayShift: TodayShift = {
    date: new Date(),
    startTime: '09:00',
    endTime: '18:00',
    shiftType: '주간',
    location: {
      floor: '3층',
      unit: 'A유닛',
      rooms: ['301', '302', '303', '304', '305', '306', '307'],
      totalRooms: 13,
    },
    assignedSeniors: [
      {
        id: '1',
        name: '홍길동',
        room: '301',
        age: 85,
        conditions: ['치매', '고혈압'],
        careLevel: '3등급',
      },
      {
        id: '2',
        name: '김영희',
        room: '302',
        age: 78,
        conditions: ['당뇨', '관절염'],
        careLevel: '2등급',
      },
      {
        id: '3',
        name: '이철수',
        room: '303',
        age: 82,
        conditions: ['파킨슨병'],
        careLevel: '1등급',
      },
    ],
    todoList: [
      {
        id: '1',
        task: '홍길동님 혈압 측정 (오전 10시)',
        completed: false,
        priority: 'high',
        estimatedTime: '10분',
      },
      {
        id: '2',
        task: '김영희님 혈당 체크 (식후)',
        completed: true,
        priority: 'high',
        estimatedTime: '5분',
      },
      {
        id: '3',
        task: '이철수님 물리치료 보조',
        completed: false,
        priority: 'medium',
        estimatedTime: '30분',
      },
      {
        id: '4',
        task: 'A유닛 청소 및 정리',
        completed: false,
        priority: 'low',
        estimatedTime: '45분',
      },
      {
        id: '5',
        task: '간호 기록 작성',
        completed: false,
        priority: 'medium',
        estimatedTime: '20분',
      },
    ],
    handoverNotes: [
      {
        id: '1',
        from: '박간호사',
        message: '홍길동님 어제 밤 수면 불안정. 오늘 컨디션 체크 필요',
        priority: 'urgent',
        timestamp: '08:30',
      },
      {
        id: '2',
        from: '최간호사',
        message: '김영희님 식욕 좋아짐. 당분간 식사량 모니터링 계속',
        priority: 'normal',
        timestamp: '08:25',
      },
    ],
  };

  const generateCalendarDays = useMemo((): CalendarDay[] => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isToday = date.toDateString() === new Date().toDateString();
      const hasShift = Math.random() > 0.3;
      const shiftType = hasShift
        ? Math.random() > 0.5
          ? '주간'
          : '야간'
        : null;

      days.push({
        date,
        isToday,
        hasShift,
        shiftType,
      });
    }

    return days;
  }, [currentDate]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return {
    currentDate,
    setCurrentDate,
    isFullscreen,
    todayShift,
    generateCalendarDays,
    navigateWeek,
    toggleFullscreen,
  };
};
