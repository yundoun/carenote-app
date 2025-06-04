import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse, PagedResponse } from './api.types';

export type MedicationRecord = Tables<'medication_records'>;
export type PositionChangeRecord = Tables<'position_change_records'>;
export type Appointment = Tables<'appointments'>;
export type CareSchedule = Tables<'care_schedules'>;

export interface MedicationRecordListItem {
  id: string;
  resident_id: string | null;
  resident_name?: string;
  caregiver_id: string | null;
  caregiver_name?: string;
  medication_name: string;
  dosage: string | null;
  scheduled_time: string | null;
  actual_time: string | null;
  status: string | null;
  notes: string | null;
  recorded_at: string | null;
  created_at: string | null;
}

export interface PositionChangeRecordListItem {
  id: string;
  resident_id: string | null;
  resident_name?: string;
  caregiver_id: string | null;
  caregiver_name?: string;
  change_time: string;
  from_position: string | null;
  to_position: string | null;
  skin_condition: string | null;
  notes: string | null;
  created_at: string | null;
}

export interface AppointmentListItem {
  id: string;
  resident_id: string | null;
  resident_name?: string;
  type: string | null;
  title: string | null;
  hospital: string | null;
  department: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  purpose: string | null;
  accompanied_by: string | null;
  transportation: string | null;
  visitors: string[] | null;
  location: string | null;
  duration_minutes: number | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareScheduleListItem {
  id: string;
  resident_id: string | null;
  resident_name?: string;
  caregiver_id: string | null;
  caregiver_name?: string;
  type: string | null;
  title: string;
  description: string | null;
  scheduled_time: string;
  duration_minutes: number | null;
  status: string | null;
  priority: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export class NursingService {
  // 투약 기록 조회
  static async getMedicationRecords(params?: {
    residentId?: string;
    caregiverId?: string;
    date?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<MedicationRecordListItem>>> {
    try {
      const { page = 1, size = 20, residentId, caregiverId, date, status } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('medication_records')
        .select(`
          *,
          residents(name),
          staff_profiles(name)
        `, { count: 'exact' })
        .order('recorded_at', { ascending: false })
        .range(from, to);

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      if (caregiverId) {
        query = query.eq('caregiver_id', caregiverId);
      }

      if (date) {
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;
        query = query.gte('recorded_at', startDate).lte('recorded_at', endDate);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const records: MedicationRecordListItem[] = (data || []).map(record => ({
        id: record.id,
        resident_id: record.resident_id,
        resident_name: record.residents?.name,
        caregiver_id: record.caregiver_id,
        caregiver_name: record.staff_profiles?.name,
        medication_name: record.medication_name,
        dosage: record.dosage,
        scheduled_time: record.scheduled_time,
        actual_time: record.actual_time,
        status: record.status,
        notes: record.notes,
        recorded_at: record.recorded_at,
        created_at: record.created_at,
      }));

      return {
        code: 'SUCCESS',
        message: '투약 기록 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: records,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching medication records:', error);
      throw {
        code: 'NURSING_001',
        message: '투약 기록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 투약 기록 생성
  static async createMedicationRecord(
    recordData: Omit<MedicationRecord, 'id' | 'created_at'>
  ): Promise<ApiResponse<MedicationRecord>> {
    try {
      const { data, error } = await supabase
        .from('medication_records')
        .insert(recordData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        code: 'SUCCESS',
        message: '투약 기록 생성 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('Error creating medication record:', error);
      throw {
        code: 'NURSING_002',
        message: '투약 기록 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 체위변경 기록 조회
  static async getPositionChangeRecords(params?: {
    residentId?: string;
    caregiverId?: string;
    date?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<PositionChangeRecordListItem>>> {
    try {
      const { page = 1, size = 20, residentId, caregiverId, date } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('position_change_records')
        .select(`
          *,
          residents(name),
          staff_profiles(name)
        `, { count: 'exact' })
        .order('change_time', { ascending: false })
        .range(from, to);

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      if (caregiverId) {
        query = query.eq('caregiver_id', caregiverId);
      }

      if (date) {
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;
        query = query.gte('change_time', startDate).lte('change_time', endDate);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const records: PositionChangeRecordListItem[] = (data || []).map(record => ({
        id: record.id,
        resident_id: record.resident_id,
        resident_name: record.residents?.name,
        caregiver_id: record.caregiver_id,
        caregiver_name: record.staff_profiles?.name,
        change_time: record.change_time,
        from_position: record.from_position,
        to_position: record.to_position,
        skin_condition: record.skin_condition,
        notes: record.notes,
        created_at: record.created_at,
      }));

      return {
        code: 'SUCCESS',
        message: '체위변경 기록 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: records,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching position change records:', error);
      throw {
        code: 'NURSING_003',
        message: '체위변경 기록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 체위변경 기록 생성
  static async createPositionChangeRecord(
    recordData: Omit<PositionChangeRecord, 'id' | 'created_at'>
  ): Promise<ApiResponse<PositionChangeRecord>> {
    try {
      const { data, error } = await supabase
        .from('position_change_records')
        .insert(recordData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        code: 'SUCCESS',
        message: '체위변경 기록 생성 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('Error creating position change record:', error);
      throw {
        code: 'NURSING_004',
        message: '체위변경 기록 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 약속/일정 조회
  static async getAppointments(params?: {
    residentId?: string;
    type?: string;
    date?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<AppointmentListItem>>> {
    try {
      const { page = 1, size = 20, residentId, type, date, status } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('appointments')
        .select(`
          *,
          residents(name)
        `, { count: 'exact' })
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true })
        .range(from, to);

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      if (type) {
        query = query.eq('type', type);
      }

      if (date) {
        query = query.eq('scheduled_date', date);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const appointments: AppointmentListItem[] = (data || []).map(appointment => ({
        id: appointment.id,
        resident_id: appointment.resident_id,
        resident_name: appointment.residents?.name,
        type: appointment.type,
        title: appointment.title,
        hospital: appointment.hospital,
        department: appointment.department,
        scheduled_date: appointment.scheduled_date,
        scheduled_time: appointment.scheduled_time,
        purpose: appointment.purpose,
        accompanied_by: appointment.accompanied_by,
        transportation: appointment.transportation,
        visitors: appointment.visitors,
        location: appointment.location,
        duration_minutes: appointment.duration_minutes,
        notes: appointment.notes,
        status: appointment.status,
        created_at: appointment.created_at,
        updated_at: appointment.updated_at,
      }));

      return {
        code: 'SUCCESS',
        message: '약속/일정 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: appointments,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw {
        code: 'NURSING_005',
        message: '약속/일정 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 약속/일정 생성
  static async createAppointment(
    appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        code: 'SUCCESS',
        message: '약속/일정 생성 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw {
        code: 'NURSING_006',
        message: '약속/일정 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 케어 스케줄 조회
  static async getCareSchedules(params?: {
    residentId?: string;
    caregiverId?: string;
    date?: string;
    type?: string;
    status?: string;
    priority?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<CareScheduleListItem>>> {
    try {
      const { page = 1, size = 20, residentId, caregiverId, date, type, status, priority } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('care_schedules')
        .select(`
          *,
          residents(name),
          staff_profiles(name)
        `, { count: 'exact' })
        .order('scheduled_time', { ascending: true })
        .range(from, to);

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      if (caregiverId) {
        query = query.eq('caregiver_id', caregiverId);
      }

      if (date) {
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;
        query = query.gte('scheduled_time', startDate).lte('scheduled_time', endDate);
      }

      if (type) {
        query = query.eq('type', type);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (priority) {
        query = query.eq('priority', priority);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const schedules: CareScheduleListItem[] = (data || []).map(schedule => ({
        id: schedule.id,
        resident_id: schedule.resident_id,
        resident_name: schedule.residents?.name,
        caregiver_id: schedule.caregiver_id,
        caregiver_name: schedule.staff_profiles?.name,
        type: schedule.type,
        title: schedule.title,
        description: schedule.description,
        scheduled_time: schedule.scheduled_time,
        duration_minutes: schedule.duration_minutes,
        status: schedule.status,
        priority: schedule.priority,
        notes: schedule.notes,
        created_at: schedule.created_at,
        updated_at: schedule.updated_at,
      }));

      return {
        code: 'SUCCESS',
        message: '케어 스케줄 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: schedules,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching care schedules:', error);
      throw {
        code: 'NURSING_007',
        message: '케어 스케줄 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 케어 스케줄 상태 업데이트
  static async updateCareScheduleStatus(
    scheduleId: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<CareSchedule>> {
    try {
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

      return {
        code: 'SUCCESS',
        message: '케어 스케줄 상태 업데이트 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('Error updating care schedule status:', error);
      throw {
        code: 'NURSING_008',
        message: '케어 스케줄 상태 업데이트 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}