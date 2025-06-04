import { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  fetchTodayWorkInfo,
  fetchWeeklySchedule,
  updateScheduleStatus,
  updateLocalScheduleStatus,
  setCurrentDate,
  toggleFullscreen,
  navigateWeek,
  clearError,
} from '@/store/slices/scheduleSlice';
import type {
  TodayShift,
  TodoItem,
  CalendarDay,
} from '../types/schedule.types';

export const useSchedule = () => {
  const dispatch = useAppDispatch();
  const {
    todayWorkInfo,
    weeklySchedule,
    selectedDate,
    currentDate,
    isLoading,
    error,
    isFullscreen,
  } = useAppSelector((state) => state.schedule);

  // 현재 로그인한 사용자 정보 가져오기
  const currentUser = useAppSelector((state) => state.auth.user);
  const caregiverId = currentUser?.id || '8debc4ef-aa7a-4ddd-ae6b-4982fe89dc7b'; // 김요양 ID로 수정

  // 컴포넌트 마운트 시 오늘의 근무 정보 조회
  useEffect(() => {
    console.log('🔄 useSchedule 초기화 - 오늘의 근무 정보 조회 시작');
    console.log('👤 현재 사용자:', { currentUser, caregiverId });

    // 테스트를 위해 실제 데이터가 있는 날짜 사용
    const testDate = '2025-05-29'; // 실제 데이터가 있는 날짜
    dispatch(fetchTodayWorkInfo({ caregiverId, date: testDate }));
  }, [dispatch, caregiverId]);

  // 주간 스케줄 조회
  const loadWeeklySchedule = (startDate: string, endDate: string) => {
    console.log('📅 주간 스케줄 조회:', { startDate, endDate });
    dispatch(fetchWeeklySchedule({ caregiverId, startDate, endDate }));
  };

  // 스케줄 상태 업데이트
  const updateSchedule = (
    scheduleId: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    notes?: string
  ) => {
    console.log('🔄 스케줄 상태 업데이트:', { scheduleId, status, notes });

    // 낙관적 업데이트
    dispatch(updateLocalScheduleStatus({ scheduleId, status, notes }));

    // 서버 업데이트
    dispatch(updateScheduleStatus({ scheduleId, status, notes }));
  };

  // 주간 네비게이션
  const handleNavigateWeek = (direction: 'prev' | 'next') => {
    dispatch(navigateWeek(direction));

    // 새로운 주간 스케줄 조회
    const currentDateObj = new Date(currentDate); // string에서 Date로 변환
    const newDate = new Date(currentDateObj);
    newDate.setDate(currentDateObj.getDate() + (direction === 'next' ? 7 : -7));

    const startDate = new Date(newDate);
    startDate.setDate(newDate.getDate() - newDate.getDay()); // 일요일로 이동
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // 토요일로 이동

    loadWeeklySchedule(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  };

  // 달력 일자 생성 (기존 로직 유지)
  const generateCalendarDays = useMemo((): CalendarDay[] => {
    const days = [];
    const currentDateObj = new Date(currentDate); // string에서 Date로 변환
    const startDate = new Date(currentDateObj);
    startDate.setDate(currentDateObj.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isToday = date.toDateString() === new Date().toDateString();

      // 주간 스케줄에서 해당 날짜의 스케줄 확인
      const dateString = date.toISOString().split('T')[0];
      const daySchedule = weeklySchedule.find(
        (schedule) => schedule.date === dateString
      );
      const hasShift = daySchedule ? daySchedule.totalCount > 0 : false;
      const shiftType = hasShift ? '주간' : null; // 실제로는 스케줄 타입에 따라 결정

      days.push({
        date,
        isToday,
        hasShift,
        shiftType,
      });
    }

    return days;
  }, [currentDate, weeklySchedule]);

  // todayWorkInfo를 기존 TodayShift 형태로 변환
  const todayShift: TodayShift | null = useMemo(() => {
    if (!todayWorkInfo) return null;

    // 담당 거주자들을 기존 Senior 타입으로 변환
    const assignedSeniors = todayWorkInfo.assignedSchedules
      .map((schedule) => ({
        id: schedule.resident?.id || '',
        name: schedule.resident?.name || '',
        room: schedule.resident?.room_number || '',
        age: schedule.resident?.age || 0,
        conditions: [], // 실제로는 residents 테이블에서 조건 정보를 가져와야 함
        careLevel: schedule.resident?.care_level || '',
      }))
      .filter(
        (senior, index, self) =>
          // 중복 제거
          index === self.findIndex((s) => s.id === senior.id)
      );

    // 담당 병실 번호들을 수집 (중복 제거)
    const assignedRooms = Array.from(
      new Set(
        todayWorkInfo.assignedSchedules
          .map((schedule) => schedule.resident?.room_number)
          .filter((room): room is string => Boolean(room)) // 타입 가드로 string만 허용
      )
    ).sort(); // 정렬

    // 스케줄을 TodoItem으로 변환
    const todoList: TodoItem[] = todayWorkInfo.assignedSchedules.map(
      (schedule) => ({
        id: schedule.id,
        task: `${schedule.resident?.name}님 ${schedule.title} (${new Date(
          schedule.scheduled_time
        ).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })})`,
        completed: schedule.status === 'COMPLETED',
        priority:
          schedule.priority === 'HIGH'
            ? 'high'
            : schedule.priority === 'MEDIUM'
            ? 'medium'
            : 'low',
        estimatedTime: `${schedule.duration_minutes || 15}분`,
      })
    );

    return {
      date: new Date(),
      startTime: '09:00',
      endTime: '18:00',
      shiftType: '주간',
      location: {
        floor: String(todayWorkInfo.workLocation?.floor || '3층'),
        unit: todayWorkInfo.workLocation?.unit || 'A유닛',
        rooms: assignedRooms, // 실제 담당 병실 번호들
        totalRooms: assignedRooms.length, // 실제 담당 병실 수
      },
      assignedSeniors,
      todoList,
      handoverNotes: [], // 별도 테이블에서 가져와야 함
    };
  }, [todayWorkInfo]);

  // 오류 정리
  const clearScheduleError = () => {
    dispatch(clearError());
  };

  return {
    // 상태
    currentDate,
    selectedDate,
    isFullscreen,
    isLoading,
    error,

    // 데이터
    todayShift,
    todayWorkInfo,
    weeklySchedule,
    generateCalendarDays,

    // 액션
    setCurrentDate: (date: Date) =>
      dispatch(setCurrentDate(date.toISOString().split('T')[0])), // Date를 string으로 변환
    toggleFullscreen: () => dispatch(toggleFullscreen()),
    navigateWeek: handleNavigateWeek,
    updateScheduleStatus: updateSchedule,
    loadWeeklySchedule,
    clearError: clearScheduleError,
  };
};
