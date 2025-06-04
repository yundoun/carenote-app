import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse, PagedResponse } from './api.types';

export type CareSchedule = Tables<'care_schedules'>;
export type WorkLocation = Tables<'work_locations'>;

// 케어 스케줄과 거주자 정보를 조인한 타입
export interface CareScheduleWithResident extends CareSchedule {
  resident: {
    id: string;
    name: string;
    room_number: string | null;
    age: number | null;
    care_level: string | null;
  } | null;
  caregiver: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// 오늘의 근무 정보
export interface TodayWorkInfo {
  workLocation: WorkLocation | null;
  assignedSchedules: CareScheduleWithResident[];
  totalSchedules: number;
  completedSchedules: number;
  pendingSchedules: number;
}

// 주간/월간 스케줄 정보
export interface ScheduleByDate {
  date: string;
  schedules: CareScheduleWithResident[];
  totalCount: number;
}

export class ScheduleService {
  // 오늘의 근무 정보 조회
  static async getTodayWorkInfo(
    caregiverId: string,
    date?: string
  ): Promise<ApiResponse<TodayWorkInfo>> {
    try {
      console.log('🔍 ScheduleService.getTodayWorkInfo 호출됨:', {
        caregiverId,
        date,
      });

      const targetDate = date || new Date().toISOString().split('T')[0];

      // 오늘의 근무지 정보 조회
      const { data: workLocation, error: workError } = await supabase
        .from('work_locations')
        .select('*')
        .eq('user_id', caregiverId)
        .eq('work_date', targetDate)
        .single();

      if (workError && workError.code !== 'PGRST116') {
        throw workError;
      }

      // 오늘의 케어 스케줄 조회 (거주자, 케어기버 정보 포함)
      const { data: schedules, error: scheduleError } = await supabase
        .from('care_schedules')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age, care_level),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('caregiver_id', caregiverId)
        .gte('scheduled_time', `${targetDate}T00:00:00.000Z`)
        .lt('scheduled_time', `${targetDate}T23:59:59.999Z`)
        .order('scheduled_time', { ascending: true });

      if (scheduleError) {
        throw scheduleError;
      }

      console.log('✅ 스케줄 데이터 조회 성공:', schedules);

      const schedulesWithResident = (schedules ||
        []) as CareScheduleWithResident[];

      const totalSchedules = schedulesWithResident.length;
      const completedSchedules = schedulesWithResident.filter(
        (s) => s.status === 'COMPLETED'
      ).length;
      const pendingSchedules = schedulesWithResident.filter(
        (s) => s.status === 'PENDING'
      ).length;

      const result = {
        code: 'SUCCESS',
        message: '오늘의 근무 정보 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          workLocation,
          assignedSchedules: schedulesWithResident,
          totalSchedules,
          completedSchedules,
          pendingSchedules,
        },
      };

      console.log('📋 최종 반환 데이터:', result);
      return result;
    } catch (error) {
      console.error('💥 ScheduleService.getTodayWorkInfo 오류:', error);
      throw {
        code: 'SCHEDULE_001',
        message: '오늘의 근무 정보 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 주간 스케줄 조회
  static async getWeeklySchedule(
    caregiverId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ScheduleByDate[]>> {
    try {
      console.log('🔍 ScheduleService.getWeeklySchedule 호출됨:', {
        caregiverId,
        startDate,
        endDate,
      });

      const { data: schedules, error } = await supabase
        .from('care_schedules')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age, care_level),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('caregiver_id', caregiverId)
        .gte('scheduled_time', `${startDate}T00:00:00.000Z`)
        .lte('scheduled_time', `${endDate}T23:59:59.999Z`)
        .order('scheduled_time', { ascending: true });

      if (error) {
        throw error;
      }

      console.log('✅ 주간 스케줄 조회 성공:', schedules);

      // 날짜별로 그룹화
      const schedulesByDate: { [key: string]: CareScheduleWithResident[] } = {};

      (schedules || []).forEach((schedule: CareScheduleWithResident) => {
        const dateKey = schedule.scheduled_time.split('T')[0];
        if (!schedulesByDate[dateKey]) {
          schedulesByDate[dateKey] = [];
        }
        schedulesByDate[dateKey].push(schedule);
      });

      // 날짜별 배열로 변환
      const result = Object.keys(schedulesByDate).map((date) => ({
        date,
        schedules: schedulesByDate[date],
        totalCount: schedulesByDate[date].length,
      }));

      return {
        code: 'SUCCESS',
        message: '주간 스케줄 조회 성공',
        timestamp: new Date().toISOString(),
        data: result,
      };
    } catch (error) {
      console.error('💥 ScheduleService.getWeeklySchedule 오류:', error);
      throw {
        code: 'SCHEDULE_002',
        message: '주간 스케줄 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 케어 스케줄 상태 업데이트
  static async updateScheduleStatus(
    scheduleId: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    notes?: string
  ): Promise<ApiResponse<CareSchedule>> {
    try {
      console.log('🔄 ScheduleService.updateScheduleStatus 호출됨:', {
        scheduleId,
        status,
        notes,
      });

      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('care_schedules')
        .update(updateData)
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 스케줄 상태 업데이트 성공:', data);

      return {
        code: 'SUCCESS',
        message: '스케줄 상태 업데이트 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('💥 ScheduleService.updateScheduleStatus 오류:', error);
      throw {
        code: 'SCHEDULE_003',
        message: '스케줄 상태 업데이트 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 새 케어 스케줄 생성
  static async createSchedule(
    scheduleData: Omit<CareSchedule, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<CareSchedule>> {
    try {
      console.log('➕ ScheduleService.createSchedule 호출됨:', scheduleData);

      const { data, error } = await supabase
        .from('care_schedules')
        .insert([scheduleData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 새 스케줄 생성 성공:', data);

      return {
        code: 'SUCCESS',
        message: '새 스케줄 생성 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('💥 ScheduleService.createSchedule 오류:', error);
      throw {
        code: 'SCHEDULE_004',
        message: '새 스케줄 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
