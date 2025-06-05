import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GraduationCap, Bell, BarChart3, Settings } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  fetchHomeDashboardData,
  fetchHomeWelcomeData,
  fetchHomeTodayProgress,
  fetchHomeTodaySchedule,
  fetchHomeUrgentAlerts,
  fetchHomeAssignedResidents,
  fetchHomeHandoverInfo,
  clearHomeError,
  markAlertAsRead,
  updateTaskProgress,
} from '@/store/slices/homeSlice';
import type { HomeData, QuickAccessItem } from '../types/home.types';

export function useHomeData() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    welcomeData,
    todayProgress,
    todaySchedule,
    urgentAlerts,
    assignedResidents,
    handoverInfo,
    isLoading,
    error,
    lastUpdated,
  } = useAppSelector((state) => state.home);

  const hasInitialized = useRef(false);

  // 홈 데이터 초기 로드
  const loadHomeData = useCallback(async () => {
    // 테스트를 위해 근무표 페이지와 동일한 사용자 ID 사용
    const testUserId = '8debc4ef-aa7a-4ddd-ae6b-4982fe89dc7b'; // 김요양 ID
    
    console.log('🏠 홈 데이터 로드 시작:', { 
      originalUserId: user?.id, 
      testUserId, 
      userName: user?.name 
    });
    
    try {
      await dispatch(fetchHomeDashboardData(testUserId)).unwrap();
      console.log('🏠 홈 데이터 로드 성공');
    } catch (error) {
      console.error('🏠 홈 데이터 로드 실패:', error);
    }
  }, [dispatch, user?.id]);

  // 개별 데이터 로드 함수들
  const loadWelcomeData = useCallback(() => {
    if (!user?.id) return;
    dispatch(fetchHomeWelcomeData(user.id));
  }, [dispatch, user?.id]);

  const loadTodayProgress = useCallback(() => {
    if (!user?.id) return;
    dispatch(fetchHomeTodayProgress(user.id));
  }, [dispatch, user?.id]);

  const loadTodaySchedule = useCallback(() => {
    if (!user?.id) return;
    dispatch(fetchHomeTodaySchedule(user.id));
  }, [dispatch, user?.id]);

  const loadUrgentAlerts = useCallback(() => {
    if (!user?.id) return;
    dispatch(fetchHomeUrgentAlerts(user.id));
  }, [dispatch, user?.id]);

  const loadAssignedResidents = useCallback(() => {
    if (!user?.id) return;
    dispatch(fetchHomeAssignedResidents(user.id));
  }, [dispatch, user?.id]);

  const loadHandoverInfo = useCallback(() => {
    if (!user?.id) return;
    dispatch(fetchHomeHandoverInfo(user.id));
  }, [dispatch, user?.id]);

  // 알림 읽음 처리
  const markAlertRead = useCallback((alertId: string) => {
    dispatch(markAlertAsRead(alertId));
  }, [dispatch]);

  // 업무 진행 상태 업데이트
  const updateTask = useCallback((taskId: string, completed: boolean) => {
    dispatch(updateTaskProgress({ taskId, completed }));
  }, [dispatch]);

  // 에러 초기화
  const clearError = useCallback(() => {
    dispatch(clearHomeError());
  }, [dispatch]);

  // 컴포넌트 마운트 시 데이터 로드 (한 번만)
  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    loadHomeData();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 홈 데이터를 기존 타입 형태로 변환
  const homeData = useMemo((): HomeData => {
    return {
      todayProgress: {
        total: todayProgress?.totalTasks || 0,
        completed: todayProgress?.completedTasks || 0,
        percentage: todayProgress?.progressPercentage || 0,
      },
      urgentAnnouncements: urgentAlerts.map(alert => ({
        id: parseInt(alert.id) || Math.random(),
        title: alert.title,
        content: alert.content,
        isUrgent: alert.isUrgent,
      })),
      weeklyGoal: {
        target: 100,
        current: todayProgress?.progressPercentage || 0,
        percentage: todayProgress?.progressPercentage || 0,
      },
      todaySchedule: todaySchedule.slice(0, 3).map(item => ({
        time: item.time,
        title: item.title,
        description: item.description,
      })),
    };
  }, [todayProgress, urgentAlerts, todaySchedule]);

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
    // 기존 호환성을 위한 데이터
    homeData,
    quickAccessItems,
    
    // 새로운 API 연동 데이터
    welcomeData,
    todayProgress,
    todaySchedule,
    urgentAlerts,
    assignedResidents,
    handoverInfo,
    
    // 상태 및 로딩
    isLoading,
    error,
    lastUpdated,
    
    // 액션 함수들
    loadHomeData,
    loadWelcomeData,
    loadTodayProgress,
    loadTodaySchedule,
    loadUrgentAlerts,
    loadAssignedResidents,
    loadHandoverInfo,
    markAlertRead,
    updateTask,
    clearError,
  };
}
