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

// 투약 기록과 거주자 정보를 조인한 타입
export interface MedicationRecordWithResident extends MedicationRecord {
  resident: {
    id: string;
    name: string;
    room_number: string | null;
    age: number | null;
  } | null;
  caregiver: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// 체위변경 기록과 거주자 정보를 조인한 타입
export interface PositionChangeRecordWithResident extends PositionChangeRecord {
  resident: {
    id: string;
    name: string;
    room_number: string | null;
    age: number | null;
  } | null;
  caregiver: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface NursingNoteRecord {
  id: string;
  resident_id: string | null;
  caregiver_id: string | null;
  note_type:
    | 'DAILY_OBSERVATION'
    | 'INCIDENT'
    | 'BEHAVIOR'
    | 'MEDICAL'
    | 'FAMILY_COMMUNICATION'
    | null;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface NursingNoteListItem {
  id: string;
  resident_id: string | null;
  resident_name?: string;
  caregiver_id: string | null;
  caregiver_name?: string;
  note_type: string | null;
  title: string;
  content: string;
  priority: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface NursingNoteWithResident extends NursingNoteRecord {
  resident: {
    id: string;
    name: string;
    room_number: string | null;
    age: number | null;
  } | null;
  caregiver: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// 종합 간병 기록 정보
export interface NursingRecordsInfo {
  medicationRecords: MedicationRecordWithResident[];
  positionChangeRecords: PositionChangeRecordWithResident[];
  nursingNotes: NursingNoteWithResident[];
  totalMedications: number;
  completedMedications: number;
  missedMedications: number;
  totalPositionChanges: number;
  totalNursingNotes: number;
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
      const {
        page = 1,
        size = 20,
        residentId,
        caregiverId,
        date,
        status,
      } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('medication_records')
        .select(
          `
          *,
          residents(name),
          staff_profiles(name)
        `,
          { count: 'exact' }
        )
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

      const records: MedicationRecordListItem[] = (data || []).map(
        (record) => ({
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
        })
      );

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
    recordData: Omit<MedicationRecord, 'id' | 'created_at' | 'recorded_at'> & {
      recorded_at?: string;
    }
  ): Promise<ApiResponse<MedicationRecordWithResident>> {
    try {
      console.log(
        '➕ NursingService.createMedicationRecord 호출됨:',
        recordData
      );

      const insertData = {
        ...recordData,
        recorded_at: recordData.recorded_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('medication_records')
        .insert([insertData])
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 투약 기록 생성 성공:', data);

      return {
        code: 'SUCCESS',
        message: '투약 기록 생성 성공',
        timestamp: new Date().toISOString(),
        data: data as MedicationRecordWithResident,
      };
    } catch (error) {
      console.error('💥 NursingService.createMedicationRecord 오류:', error);
      throw {
        code: 'NURSING_003',
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
      const {
        page = 1,
        size = 20,
        residentId,
        caregiverId,
        date,
      } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('position_change_records')
        .select(
          `
          *,
          residents(name),
          staff_profiles(name)
        `,
          { count: 'exact' }
        )
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

      const records: PositionChangeRecordListItem[] = (data || []).map(
        (record) => ({
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
        })
      );

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

  // 새 체위변경 기록 생성
  static async createPositionChangeRecord(
    recordData: Omit<PositionChangeRecord, 'id' | 'created_at'>
  ): Promise<ApiResponse<PositionChangeRecordWithResident>> {
    try {
      console.log(
        '➕ NursingService.createPositionChangeRecord 호출됨:',
        recordData
      );

      const { data, error } = await supabase
        .from('position_change_records')
        .insert([recordData])
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 체위변경 기록 생성 성공:', data);

      return {
        code: 'SUCCESS',
        message: '체위변경 기록 생성 성공',
        timestamp: new Date().toISOString(),
        data: data as PositionChangeRecordWithResident,
      };
    } catch (error) {
      console.error(
        '💥 NursingService.createPositionChangeRecord 오류:',
        error
      );
      throw {
        code: 'NURSING_004',
        message: '체위변경 기록 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 투약 기록 상태 업데이트
  static async updateMedicationRecord(
    recordId: string,
    updates: Partial<MedicationRecord>
  ): Promise<ApiResponse<MedicationRecord>> {
    try {
      console.log('🔄 NursingService.updateMedicationRecord 호출됨:', {
        recordId,
        updates,
      });

      const { data, error } = await supabase
        .from('medication_records')
        .update(updates)
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 투약 기록 업데이트 성공:', data);

      return {
        code: 'SUCCESS',
        message: '투약 기록 업데이트 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('💥 NursingService.updateMedicationRecord 오류:', error);
      throw {
        code: 'NURSING_005',
        message: '투약 기록 업데이트 실패',
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
      const {
        page = 1,
        size = 20,
        residentId,
        type,
        date,
        status,
      } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('appointments')
        .select(
          `
          *,
          residents(name)
        `,
          { count: 'exact' }
        )
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

      const appointments: AppointmentListItem[] = (data || []).map(
        (appointment) => ({
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
        })
      );

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
      const {
        page = 1,
        size = 20,
        residentId,
        caregiverId,
        date,
        type,
        status,
        priority,
      } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('care_schedules')
        .select(
          `
          *,
          residents(name),
          staff_profiles(name)
        `,
          { count: 'exact' }
        )
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
        query = query
          .gte('scheduled_time', startDate)
          .lte('scheduled_time', endDate);
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

      const schedules: CareScheduleListItem[] = (data || []).map(
        (schedule) => ({
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
        })
      );

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

  // 간호 기록 조회
  static async getNursingNotes(params?: {
    residentId?: string;
    caregiverId?: string;
    noteType?: string;
    priority?: string;
    date?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<NursingNoteListItem>>> {
    try {
      const {
        page = 1,
        size = 20,
        residentId,
        caregiverId,
        noteType,
        priority,
        date,
      } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('nursing_notes')
        .select(
          `
          *,
          residents(name),
          staff_profiles(name)
        `,
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(from, to);

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      if (caregiverId) {
        query = query.eq('caregiver_id', caregiverId);
      }

      if (noteType) {
        query = query.eq('note_type', noteType);
      }

      if (priority) {
        query = query.eq('priority', priority);
      }

      if (date) {
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;
        query = query.gte('created_at', startDate).lte('created_at', endDate);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const notes: NursingNoteListItem[] = (data || []).map((note) => ({
        id: note.id,
        resident_id: note.resident_id,
        resident_name: note.residents?.name,
        caregiver_id: note.caregiver_id,
        caregiver_name: note.staff_profiles?.name,
        note_type: note.note_type,
        title: note.title,
        content: note.content,
        priority: note.priority,
        created_at: note.created_at,
        updated_at: note.updated_at,
      }));

      return {
        code: 'SUCCESS',
        message: '간호 기록 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: notes,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching nursing notes:', error);
      throw {
        code: 'NURSING_009',
        message: '간호 기록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 간호 기록 생성
  static async createNursingNote(
    noteData: Omit<NursingNoteRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<NursingNoteWithResident>> {
    try {
      console.log('➕ NursingService.createNursingNote 호출됨:', noteData);

      const { data, error } = await supabase
        .from('nursing_notes')
        .insert([noteData])
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 간호 기록 생성 성공:', data);

      return {
        code: 'SUCCESS',
        message: '간호 기록 생성 성공',
        timestamp: new Date().toISOString(),
        data: data as NursingNoteWithResident,
      };
    } catch (error) {
      console.error('💥 NursingService.createNursingNote 오류:', error);
      throw {
        code: 'NURSING_010',
        message: '간호 기록 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 간호 기록 업데이트
  static async updateNursingNote(
    noteId: string,
    updates: Partial<NursingNoteRecord>
  ): Promise<ApiResponse<NursingNoteRecord>> {
    try {
      console.log('🔄 NursingService.updateNursingNote 호출됨:', {
        noteId,
        updates,
      });

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('nursing_notes')
        .update(updateData)
        .eq('id', noteId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 간호 기록 업데이트 성공:', data);

      return {
        code: 'SUCCESS',
        message: '간호 기록 업데이트 성공',
        timestamp: new Date().toISOString(),
        data: {
          id: data.id,
          resident_id: data.resident_id,
          caregiver_id: data.caregiver_id,
          note_type: data.note_type as NursingNoteRecord['note_type'],
          title: data.title,
          content: data.content,
          priority: data.priority as NursingNoteRecord['priority'],
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
      };
    } catch (error) {
      console.error('💥 NursingService.updateNursingNote 오류:', error);
      throw {
        code: 'NURSING_011',
        message: '간호 기록 업데이트 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 오늘의 간병 기록 조회
  static async getTodayNursingRecords(
    caregiverId: string,
    date?: string
  ): Promise<ApiResponse<NursingRecordsInfo>> {
    try {
      console.log('🔍 NursingService.getTodayNursingRecords 호출됨:', {
        caregiverId,
        date,
      });

      const targetDate = date || '2025-06-11';

      // 투약 기록 조회
      const { data: medicationRecords, error: medError } = await supabase
        .from('medication_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('caregiver_id', caregiverId)
        .gte('recorded_at', `${targetDate}T00:00:00.000Z`)
        .lt('recorded_at', `${targetDate}T23:59:59.999Z`)
        .order('recorded_at', { ascending: false });

      if (medError) {
        throw medError;
      }

      // 체위변경 기록 조회
      const { data: positionRecords, error: posError } = await supabase
        .from('position_change_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('caregiver_id', caregiverId)
        .gte('change_time', `${targetDate}T00:00:00.000Z`)
        .lt('change_time', `${targetDate}T23:59:59.999Z`)
        .order('change_time', { ascending: false });

      if (posError) {
        throw posError;
      }

      // 간호 기록 조회
      const { data: nursingNotes, error: notesError } = await supabase
        .from('nursing_notes')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('caregiver_id', caregiverId)
        .gte('created_at', `${targetDate}T00:00:00.000Z`)
        .lt('created_at', `${targetDate}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (notesError) {
        throw notesError;
      }

      console.log('✅ 간병 기록 조회 성공:', {
        medicationRecords,
        positionRecords,
        nursingNotes,
      });

      const medicationRecordsWithResident = (medicationRecords ||
        []) as MedicationRecordWithResident[];
      const positionRecordsWithResident = (positionRecords ||
        []) as PositionChangeRecordWithResident[];
      const nursingNotesWithResident = (nursingNotes ||
        []) as NursingNoteWithResident[];

      const totalMedications = medicationRecordsWithResident.length;
      const completedMedications = medicationRecordsWithResident.filter(
        (r) => r.status === 'COMPLETED'
      ).length;
      const missedMedications = medicationRecordsWithResident.filter(
        (r) => r.status === 'MISSED'
      ).length;
      const totalPositionChanges = positionRecordsWithResident.length;
      const totalNursingNotes = nursingNotesWithResident.length;

      const result = {
        code: 'SUCCESS',
        message: '오늘의 간병 기록 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          medicationRecords: medicationRecordsWithResident,
          positionChangeRecords: positionRecordsWithResident,
          nursingNotes: nursingNotesWithResident,
          totalMedications,
          completedMedications,
          missedMedications,
          totalPositionChanges,
          totalNursingNotes,
        },
      };

      console.log('📋 최종 반환 데이터:', result);
      return result;
    } catch (error) {
      console.error('💥 NursingService.getTodayNursingRecords 오류:', error);
      throw {
        code: 'NURSING_001',
        message: '간병 기록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 특정 거주자의 간병 기록 조회
  static async getResidentNursingRecords(
    residentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<NursingRecordsInfo>> {
    try {
      console.log('🔍 NursingService.getResidentNursingRecords 호출됨:', {
        residentId,
        startDate,
        endDate,
      });

      const start = startDate || '2025-06-11';
      const end = endDate || start;

      // 투약 기록 조회
      const { data: medicationRecords, error: medError } = await supabase
        .from('medication_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('resident_id', residentId)
        .gte('recorded_at', `${start}T00:00:00.000Z`)
        .lte('recorded_at', `${end}T23:59:59.999Z`)
        .order('recorded_at', { ascending: false });

      if (medError) {
        throw medError;
      }

      // 체위변경 기록 조회
      const { data: positionRecords, error: posError } = await supabase
        .from('position_change_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('resident_id', residentId)
        .gte('change_time', `${start}T00:00:00.000Z`)
        .lte('change_time', `${end}T23:59:59.999Z`)
        .order('change_time', { ascending: false });

      if (posError) {
        throw posError;
      }

      // 간호 기록 조회
      const { data: nursingNotes, error: notesError } = await supabase
        .from('nursing_notes')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          caregiver:staff_profiles(id, name, role)
        `
        )
        .eq('resident_id', residentId)
        .gte('created_at', `${start}T00:00:00.000Z`)
        .lte('created_at', `${end}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (notesError) {
        throw notesError;
      }

      console.log('✅ 거주자 간병 기록 조회 성공:', {
        medicationRecords,
        positionRecords,
        nursingNotes,
      });

      const medicationRecordsWithResident = (medicationRecords ||
        []) as MedicationRecordWithResident[];
      const positionRecordsWithResident = (positionRecords ||
        []) as PositionChangeRecordWithResident[];
      const nursingNotesWithResident = (nursingNotes ||
        []) as NursingNoteWithResident[];

      const totalMedications = medicationRecordsWithResident.length;
      const completedMedications = medicationRecordsWithResident.filter(
        (r) => r.status === 'COMPLETED'
      ).length;
      const missedMedications = medicationRecordsWithResident.filter(
        (r) => r.status === 'MISSED'
      ).length;
      const totalPositionChanges = positionRecordsWithResident.length;
      const totalNursingNotes = nursingNotesWithResident.length;

      return {
        code: 'SUCCESS',
        message: '거주자 간병 기록 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          medicationRecords: medicationRecordsWithResident,
          positionChangeRecords: positionRecordsWithResident,
          nursingNotes: nursingNotesWithResident,
          totalMedications,
          completedMedications,
          missedMedications,
          totalPositionChanges,
          totalNursingNotes,
        },
      };
    } catch (error) {
      console.error('💥 NursingService.getResidentNursingRecords 오류:', error);
      throw {
        code: 'NURSING_002',
        message: '거주자 간병 기록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
