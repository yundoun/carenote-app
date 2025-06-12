import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse } from './api.types';

export type WelcomeMessage = Tables<'welcome_messages'>;
export type UserProfile = Tables<'users'>;
export type DailyTask = Tables<'daily_tasks'>;
export type Notification = Tables<'notifications'>;
export type Notice = Tables<'notices'>;

export interface HomeWelcomeData {
  welcomeMessage: string;
  shiftInfo: {
    startTime: string;
    endTime: string;
    unit: string;
  };
  assignedResidents: number;
  pendingTasks: number;
  motivationMessage: string;
}

export interface HomeTodayProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  vitalCheckStatus: {
    morning: number;
    afternoon: number;
    evening: number;
    totalCompleted: number;
    totalRequired: number;
  };
}

export interface HomeScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'shift' | 'appointment' | 'task' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  status: string; // care_schedules 테이블의 status 필드 (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
}

export interface HomeUrgentAlert {
  id: string;
  title: string;
  content: string;
  type: 'vital' | 'medication' | 'emergency' | 'notice';
  isUrgent: boolean;
  createdAt: string;
}

export interface HomeAssignedResident {
  id: string;
  name: string;
  room: string;
  careLevel: number;
  diagnosis: string[];
  profileImage?: string;
  urgentNotes?: string;
}

export interface HomeHandoverInfo {
  id: string;
  residentId: string;
  residentName: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  createdBy: string;
  createdAt: string;
}

export interface HomeDashboardData {
  welcomeData: HomeWelcomeData;
  todayProgress: HomeTodayProgress;
  todaySchedule: HomeScheduleItem[];
  urgentAlerts: HomeUrgentAlert[];
  assignedResidents: HomeAssignedResident[];
  handoverInfo: HomeHandoverInfo[];
}

export class HomeService {
  // 환대 메시지 및 기본 정보 조회
  static async getWelcomeData(
    userId: string
  ): Promise<ApiResponse<HomeWelcomeData>> {
    try {
      // 사용자 정보 조회 (staff_profiles 테이블 사용)
      const { data: userInfo, error: userError } = await supabase
        .from('staff_profiles')
        .select('name, role, department, shift_start_time, shift_end_time')
        .eq('id', userId)
        .single();

      if (userError) {
        throw userError;
      }

      // 고정 날짜로 조회 (2025-06-11)
      const today = '2025-06-11';
      const { data: workLocation, error: workError } = await supabase
        .from('work_locations')
        .select('unit, unit_name, resident_count')
        .eq('user_id', userId)
        .eq('work_date', today)
        .single();

      // 오늘의 대기 스케줄 수 조회 (근무표 페이지와 동일한 데이터)
      const { count: taskCount, error: taskError } = await supabase
        .from('care_schedules')
        .select('*', { count: 'exact', head: true })
        .eq('caregiver_id', userId)
        .gte('scheduled_time', `${today}T00:00:00.000Z`)
        .lt('scheduled_time', `${today}T23:59:59.999Z`)
        .eq('status', 'PENDING');

      if (taskError) {
        throw taskError;
      }

      const welcomeData: HomeWelcomeData = {
        welcomeMessage: `안녕하세요, ${userInfo.name}님! 오늘도 화이팅하세요!`,
        shiftInfo: {
          startTime: userInfo.shift_start_time || '09:00',
          endTime: userInfo.shift_end_time || '18:00',
          unit:
            workLocation?.unit_name ||
            workLocation?.unit ||
            userInfo.department ||
            '',
        },
        assignedResidents: workLocation?.resident_count || 0,
        pendingTasks: taskCount || 0,
        motivationMessage: '오늘도 어르신들을 위한 따뜻한 케어를 부탁드립니다.',
      };

      return {
        code: 'SUCCESS',
        message: '환대 정보 조회 성공',
        timestamp: new Date().toISOString(),
        data: welcomeData,
      };
    } catch (error) {
      console.error('Error fetching welcome data:', error);
      throw {
        code: 'HOME_001',
        message: '환대 정보 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 오늘의 진행 상황 조회
  static async getTodayProgress(
    userId: string
  ): Promise<ApiResponse<HomeTodayProgress>> {
    try {
      const today = '2025-06-11';

      // 오늘의 케어 스케줄 진행 상황 (근무표 페이지와 동일한 데이터 사용)
      const { data: schedules, error: scheduleError } = await supabase
        .from('care_schedules')
        .select('status')
        .eq('caregiver_id', userId)
        .gte('scheduled_time', `${today}T00:00:00.000Z`)
        .lt('scheduled_time', `${today}T23:59:59.999Z`);

      if (scheduleError) {
        throw scheduleError;
      }

      const totalTasks = schedules?.length || 0;
      const completedTasks =
        schedules?.filter((schedule) => schedule.status === 'COMPLETED')
          .length || 0;

      // 바이탈 체크 현황 조회 (시간대별)
      const { data: vitalRecords, error: vitalError } = await supabase
        .from('vital_records')
        .select('created_at, measured_at')
        .gte('measured_at', `${today}T00:00:00.000Z`)
        .lt('measured_at', `${today}T23:59:59.999Z`);

      if (vitalError) {
        throw vitalError;
      }

      // 시간대별 바이탈 체크 분류
      const morningChecks =
        vitalRecords?.filter((record) => {
          const hour = new Date(
            record.measured_at || record.created_at
          ).getHours();
          return hour >= 6 && hour < 12;
        }).length || 0;

      const afternoonChecks =
        vitalRecords?.filter((record) => {
          const hour = new Date(
            record.measured_at || record.created_at
          ).getHours();
          return hour >= 12 && hour < 18;
        }).length || 0;

      const eveningChecks =
        vitalRecords?.filter((record) => {
          const hour = new Date(
            record.measured_at || record.created_at
          ).getHours();
          return hour >= 18 || hour < 6;
        }).length || 0;

      // 총 담당 거주자 수를 기준으로 필요한 바이탈 체크 수 계산
      const { count: totalResidents } = await supabase
        .from('care_schedules')
        .select('resident_id', { count: 'exact', head: true })
        .eq('caregiver_id', userId)
        .gte('scheduled_time', `${today}T00:00:00.000Z`)
        .lt('scheduled_time', `${today}T23:59:59.999Z`);

      const progress: HomeTodayProgress = {
        totalTasks,
        completedTasks,
        progressPercentage:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        vitalCheckStatus: {
          morning: morningChecks,
          afternoon: afternoonChecks,
          evening: eveningChecks,
          totalCompleted: vitalRecords?.length || 0,
          totalRequired: (totalResidents || 0) * 3, // 1일 3회 체크 가정
        },
      };

      return {
        code: 'SUCCESS',
        message: '오늘의 진행 상황 조회 성공',
        timestamp: new Date().toISOString(),
        data: progress,
      };
    } catch (error) {
      console.error('Error fetching today progress:', error);
      throw {
        code: 'HOME_002',
        message: '오늘의 진행 상황 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 오늘의 일정 조회 (근무표 페이지와 동일한 데이터 사용)
  static async getTodaySchedule(
    userId: string
  ): Promise<ApiResponse<HomeScheduleItem[]>> {
    try {
      const today = '2025-06-11';

      // 오늘의 케어 스케줄 조회 (근무표 페이지와 동일한 쿼리)
      const { data: schedules, error: scheduleError } = await supabase
        .from('care_schedules')
        .select(
          `
          id,
          scheduled_time,
          title,
          description,
          type,
          status,
          priority,
          duration_minutes,
          notes,
          residents(id, name, room_number)
        `
        )
        .eq('caregiver_id', userId)
        .gte('scheduled_time', `${today}T00:00:00.000Z`)
        .lt('scheduled_time', `${today}T23:59:59.999Z`)
        .order('scheduled_time', { ascending: true });

      if (scheduleError) {
        throw scheduleError;
      }

      console.log('🏠 홈 서비스 - 오늘의 일정 조회 결과:', {
        userId,
        today,
        schedulesCount: schedules?.length || 0,
        schedules,
      });

      const scheduleItems: HomeScheduleItem[] = (schedules || []).map(
        (schedule) => ({
          id: schedule.id,
          time: new Date(schedule.scheduled_time).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: schedule.residents?.name
            ? `${schedule.residents.name} (${
                schedule.residents.room_number || ''
              }) - ${schedule.title}`
            : schedule.title,
          description: schedule.description || schedule.notes || '',
          type: HomeService.mapScheduleType(schedule.type),
          priority: (schedule.priority || 'medium') as
            | 'high'
            | 'medium'
            | 'low',
          status: schedule.status, // care_schedules 테이블의 status 필드 추가
        })
      );

      return {
        code: 'SUCCESS',
        message: '오늘의 일정 조회 성공',
        timestamp: new Date().toISOString(),
        data: scheduleItems,
      };
    } catch (error) {
      console.error('Error fetching today schedule:', error);
      throw {
        code: 'HOME_003',
        message: '오늘의 일정 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 스케줄 타입 매핑 유틸리티
  static mapScheduleType(
    type: string | null
  ): 'task' | 'appointment' | 'meeting' | 'shift' {
    if (!type) return 'task';

    switch (type.toLowerCase()) {
      case 'vital_check':
      case 'medication':
      case 'meal_assistance':
      case 'personal_care':
        return 'task';
      case 'doctor_visit':
      case 'family_visit':
      case 'external_appointment':
        return 'appointment';
      case 'team_meeting':
      case 'care_planning':
        return 'meeting';
      case 'shift_change':
      case 'handover':
        return 'shift';
      default:
        return 'task';
    }
  }

  // 긴급 알림 조회
  static async getUrgentAlerts(
    userId: string
  ): Promise<ApiResponse<HomeUrgentAlert[]>> {
    try {
      // 읽지 않은 알림
      const { data: notifications, error: notificationError } = await supabase
        .from('notifications')
        .select('id, title, content, type, is_urgent, created_at')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notificationError) {
        throw notificationError;
      }

      // 긴급 공지사항
      const { data: notices, error: noticeError } = await supabase
        .from('notices')
        .select('id, title, content, is_urgent, created_at')
        .eq('is_urgent', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (noticeError) {
        throw noticeError;
      }

      const alerts: HomeUrgentAlert[] = [
        // 개인 알림
        ...(notifications || []).map((notification) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          type: notification.type as
            | 'vital'
            | 'medication'
            | 'emergency'
            | 'notice',
          isUrgent: notification.is_urgent || false,
          createdAt: notification.created_at,
        })),
        // 긴급 공지
        ...(notices || []).map((notice) => ({
          id: notice.id,
          title: notice.title,
          content: notice.content,
          type: 'notice' as const,
          isUrgent: notice.is_urgent || false,
          createdAt: notice.created_at,
        })),
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        code: 'SUCCESS',
        message: '긴급 알림 조회 성공',
        timestamp: new Date().toISOString(),
        data: alerts,
      };
    } catch (error) {
      console.error('Error fetching urgent alerts:', error);
      throw {
        code: 'HOME_004',
        message: '긴급 알림 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 담당 입주자 목록 조회 (오늘 케어 스케줄 기준)
  static async getAssignedResidents(
    userId: string
  ): Promise<ApiResponse<HomeAssignedResident[]>> {
    try {
      const today = '2025-06-11';

      // 오늘 스케줄된 거주자들 조회 (중복 제거)
      const { data, error } = await supabase
        .from('care_schedules')
        .select(
          `
          residents(
            id,
            name,
            room_number,
            care_level,
            primary_diagnosis,
            profile_image
          )
        `
        )
        .eq('caregiver_id', userId)
        .gte('scheduled_time', `${today}T00:00:00.000Z`)
        .lt('scheduled_time', `${today}T23:59:59.999Z`)
        .not('residents', 'is', null);

      if (error) {
        throw error;
      }

      // 중복 거주자 제거
      const uniqueResidents = new Map();
      (data || []).forEach((item) => {
        if (item.residents && !uniqueResidents.has(item.residents.id)) {
          uniqueResidents.set(item.residents.id, item.residents);
        }
      });

      const residents: HomeAssignedResident[] = Array.from(
        uniqueResidents.values()
      ).map((resident) => ({
        id: resident.id,
        name: resident.name,
        room: resident.room_number || '',
        careLevel: resident.care_level || 1,
        diagnosis: Array.isArray(resident.primary_diagnosis)
          ? resident.primary_diagnosis
          : resident.primary_diagnosis
          ? [resident.primary_diagnosis as string]
          : [],
        profileImage: resident.profile_image || undefined,
      }));

      return {
        code: 'SUCCESS',
        message: '담당 입주자 목록 조회 성공',
        timestamp: new Date().toISOString(),
        data: residents,
      };
    } catch (error) {
      console.error('Error fetching assigned residents:', error);
      throw {
        code: 'HOME_005',
        message: '담당 입주자 목록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 인수인계 정보 조회
  static async getHandoverInfo(
    userId: string
  ): Promise<ApiResponse<HomeHandoverInfo[]>> {
    try {
      const today = '2025-06-11';

      const { data, error } = await supabase
        .from('handover_notes')
        .select(
          `
          id,
          content,
          priority,
          created_by,
          created_at,
          residents(id, name)
        `
        )
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      const handoverInfo: HomeHandoverInfo[] = (data || []).map((item) => ({
        id: item.id,
        residentId: item.residents?.id || '',
        residentName: item.residents?.name || '',
        content: item.content,
        priority: (item.priority || 'medium') as 'high' | 'medium' | 'low',
        createdBy: item.created_by,
        createdAt: item.created_at,
      }));

      return {
        code: 'SUCCESS',
        message: '인수인계 정보 조회 성공',
        timestamp: new Date().toISOString(),
        data: handoverInfo,
      };
    } catch (error) {
      console.error('Error fetching handover info:', error);
      throw {
        code: 'HOME_006',
        message: '인수인계 정보 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 홈 대시보드 전체 데이터 조회
  static async getDashboardData(
    userId: string
  ): Promise<ApiResponse<HomeDashboardData>> {
    try {
      // 성공하는 것만 먼저 조회
      const scheduleResponse = await this.getTodaySchedule(userId);
      const progressResponse = await this.getTodayProgress(userId);

      // 실패하는 것들은 기본값 제공
      const welcomeData: HomeWelcomeData = {
        welcomeMessage: '안녕하세요! 오늘도 화이팅하세요!',
        shiftInfo: {
          startTime: '09:00',
          endTime: '18:00',
          unit: '3층 A유닛',
        },
        assignedResidents: 0,
        pendingTasks: scheduleResponse.data.length,
        motivationMessage: '오늘도 어르신들을 위한 따뜻한 케어를 부탁드립니다.',
      };

      const dashboardData: HomeDashboardData = {
        welcomeData,
        todayProgress: progressResponse.data,
        todaySchedule: scheduleResponse.data,
        urgentAlerts: [], // 빈 배열로 기본값 설정
        assignedResidents: [], // 빈 배열로 기본값 설정
        handoverInfo: [], // 빈 배열로 기본값 설정
      };

      return {
        code: 'SUCCESS',
        message: '홈 대시보드 데이터 조회 성공',
        timestamp: new Date().toISOString(),
        data: dashboardData,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw {
        code: 'HOME_000',
        message: '홈 대시보드 데이터 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
