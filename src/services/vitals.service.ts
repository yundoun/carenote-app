import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse, PagedResponse } from './api.types';

// 기본 바이탈 사인 기록 타입
export type VitalRecord = {
  id: string;
  resident_id: string | null;
  measured_at: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature?: number;
  respiratory_rate?: number;
  blood_oxygen?: number;
  blood_sugar?: number;
  weight?: number;
  notes?: string;
  measurer_id: string | null;
  created_at: string;
  updated_at?: string;
};

// 거주자 정보를 포함한 바이탈 기록
export interface VitalRecordWithResident extends VitalRecord {
  resident: {
    id: string;
    name: string;
    room_number: string | null;
    age: number | null;
  } | null;
  measurer: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// 바이탈 체크 현황 정보
export interface VitalStatusInfo {
  unit: string;
  date: string;
  residents: Array<{
    id: string;
    name: string;
    room_number: string;
    age?: number;
    vital_check_status: {
      morning: {
        checked: boolean;
        time?: string;
        checked_by?: string;
      };
      afternoon: {
        checked: boolean;
        time?: string;
        checked_by?: string;
      };
      evening: {
        checked: boolean;
        time?: string;
        checked_by?: string;
      };
    };
    last_vitals?: {
      blood_pressure?: string;
      heart_rate?: number;
      temperature?: number;
      measured_at?: string;
    };
    vital_history?: VitalRecord[];
  }>;
  summary: {
    total_residents: number;
    checked_count: number;
    pending_count: number;
    completion_rate: number;
  };
}

// 바이탈 사인 자동 기록 데이터
export interface AutoVitalData {
  resident_id: string;
  device_id: string;
  measurements: {
    systolic_bp?: number;
    diastolic_bp?: number;
    heart_rate?: number;
    temperature?: number;
    blood_oxygen?: number;
    blood_sugar?: number;
    weight?: number;
  };
  device_type: 'AUTO_BP_MONITOR' | 'THERMOMETER' | 'OXIMETER' | 'SCALE';
  measured_at: string;
}

export class VitalsService {
  // 오늘의 바이탈 체크 현황 조회
  static async getVitalStatus(
    unitId?: string,
    date?: string
  ): Promise<ApiResponse<VitalStatusInfo>> {
    try {
      console.log('🔍 VitalsService.getVitalStatus 호출됨:', { unitId, date });

      const targetDate = date || '2025-06-11';
      const startDateTime = `${targetDate}T00:00:00.000Z`;
      const endDateTime = `${targetDate}T23:59:59.999Z`;

      // 1. 모든 활성 거주자 조회
      let residentsQuery = supabase
        .from('residents')
        .select('id, name, room_number, age')
        .eq('status', 'ACTIVE');

      // unitId가 있으면 해당 유닛의 거주자만 필터링 (추후 구현)
      if (unitId) {
        console.log('👤 unitId 필터링:', unitId);
        // TODO: 유닛별 필터링 로직 구현 필요
      }

      const { data: residents, error: residentsError } = await residentsQuery;

      if (residentsError) {
        throw residentsError;
      }

      console.log('✅ 거주자 목록 조회 완료:', residents?.length);

      // 2. 오늘의 바이탈 기록 조회
      const { data: vitalRecords, error: vitalsError } = await supabase
        .from('vital_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number)
        `
        )
        .gte('measured_at', startDateTime)
        .lte('measured_at', endDateTime);

      // 3. 최근 30일 바이탈 히스토리 조회 (거주자별 최대 10건)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: historyRecords, error: historyError } = await supabase
        .from('vital_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number)
        `
        )
        .gte('measured_at', thirtyDaysAgo.toISOString())
        .order('measured_at', { ascending: false })
        .limit(1000); // 전체 제한

      if (historyError) {
        console.warn('⚠️ 바이탈 히스토리 조회 오류:', historyError);
      }

      if (vitalsError) {
        console.warn(
          '⚠️ 바이탈 기록 조회 오류 (테이블이 없을 수 있음):',
          vitalsError
        );
        // 바이탈 기록 테이블이 없어도 계속 진행
      }

      console.log('📊 오늘의 바이탈 기록:', vitalRecords?.length || 0);
      console.log('📊 히스토리 바이탈 기록:', historyRecords?.length || 0);

      // 4. 거주자별 바이탈 체크 현황 계산
      const residentsWithStatus = (residents || []).map((resident) => {
        const residentVitals = (vitalRecords || []).filter(
          (record: any) => record.resident_id === resident.id
        );

        // 해당 거주자의 히스토리 기록 (최근 10건)
        const residentHistory = (historyRecords || [])
          .filter((record: any) => record.resident_id === resident.id)
          .slice(0, 10);

        // 시간순으로 정렬 (최신순)
        residentVitals.sort(
          (a: any, b: any) =>
            new Date(b.measured_at).getTime() -
            new Date(a.measured_at).getTime()
        );

        // 시간대별 체크 현황 계산 (가장 최근 기록 우선)
        const morningVital = residentVitals.find((record: any) => {
          const hour = new Date(record.measured_at).getHours();
          return hour >= 6 && hour < 12;
        });

        const afternoonVital = residentVitals.find((record: any) => {
          const hour = new Date(record.measured_at).getHours();
          return hour >= 12 && hour < 18;
        });

        const eveningVital = residentVitals.find((record: any) => {
          const hour = new Date(record.measured_at).getHours();
          return hour >= 18 || hour < 6;
        });

        // 최근 바이탈 사인 (가장 최신 기록)
        const lastVital = residentVitals[0];

        return {
          id: resident.id,
          name: resident.name,
          room_number: resident.room_number || '',
          age: resident.age,
          vital_check_status: {
            morning: {
              checked: !!morningVital,
              time: morningVital?.measured_at
                ? new Date(morningVital.measured_at).toLocaleTimeString(
                    'ko-KR',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )
                : undefined,
              checked_by: '간병인', // 임시로 고정값 사용
            },
            afternoon: {
              checked: !!afternoonVital,
              time: afternoonVital?.measured_at
                ? new Date(afternoonVital.measured_at).toLocaleTimeString(
                    'ko-KR',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )
                : undefined,
              checked_by: '간병인', // 임시로 고정값 사용
            },
            evening: {
              checked: !!eveningVital,
              time: eveningVital?.measured_at
                ? new Date(eveningVital.measured_at).toLocaleTimeString(
                    'ko-KR',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )
                : undefined,
              checked_by: '간병인', // 임시로 고정값 사용
            },
          },
          last_vitals: lastVital
            ? {
                blood_pressure:
                  lastVital.systolic_bp && lastVital.diastolic_bp
                    ? `${lastVital.systolic_bp}/${lastVital.diastolic_bp}`
                    : undefined,
                heart_rate: lastVital.heart_rate || undefined,
                temperature: lastVital.temperature || undefined,
                measured_at: lastVital.measured_at,
                notes: lastVital.notes || undefined,
              }
            : undefined,
          vital_history: residentHistory,
        };
      });

      // 4. 통계 계산
      const totalResidents = residentsWithStatus.length;
      const checkedCount = residentsWithStatus.filter((resident) => {
        const status = resident.vital_check_status;
        return (
          status.morning.checked ||
          status.afternoon.checked ||
          status.evening.checked
        );
      }).length;
      const pendingCount = totalResidents - checkedCount;
      const completionRate =
        totalResidents > 0 ? (checkedCount / totalResidents) * 100 : 0;

      const result = {
        code: 'SUCCESS',
        message: '바이탈 체크 현황 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          unit: unitId || '전체',
          date: targetDate,
          residents: residentsWithStatus,
          summary: {
            total_residents: totalResidents,
            checked_count: checkedCount,
            pending_count: pendingCount,
            completion_rate: Math.round(completionRate * 10) / 10,
          },
        },
      };

      console.log('📋 최종 반환 데이터:', result);
      return result;
    } catch (error) {
      console.error('💥 VitalsService.getVitalStatus 오류:', error);
      throw {
        code: 'VITAL_001',
        message: '바이탈 체크 현황 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 바이탈 사인 기록 생성
  static async createVitalRecord(vitalData: {
    resident_id: string;
    measurer_id: string;
    measured_at: string;
    systolic_bp?: number;
    diastolic_bp?: number;
    heart_rate?: number;
    temperature?: number;
    respiratory_rate?: number;
    blood_oxygen?: number;
    blood_sugar?: number;
    weight?: number;
    notes?: string;
  }): Promise<ApiResponse<VitalRecord>> {
    try {
      console.log('➕ VitalsService.createVitalRecord 호출됨:', vitalData);

      // vital_records 테이블이 없으면 먼저 생성
      await this.ensureVitalRecordsTable();

      const { data, error } = await supabase
        .from('vital_records')
        .insert([vitalData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 바이탈 기록 생성 성공:', data);

      return {
        code: 'SUCCESS',
        message: '바이탈 기록 생성 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('💥 VitalsService.createVitalRecord 오류:', error);
      throw {
        code: 'VITAL_002',
        message: '바이탈 기록 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 자동 바이탈 기록 (디바이스 연동)
  static async createAutoVitalRecord(
    autoData: AutoVitalData
  ): Promise<ApiResponse<VitalRecord>> {
    try {
      console.log('🤖 VitalsService.createAutoVitalRecord 호출됨:', autoData);

      const vitalData = {
        resident_id: autoData.resident_id,
        measurer_id: `AUTO_${autoData.device_type}`,
        measured_at: autoData.measured_at,
        systolic_bp: autoData.measurements.systolic_bp,
        diastolic_bp: autoData.measurements.diastolic_bp,
        heart_rate: autoData.measurements.heart_rate,
        temperature: autoData.measurements.temperature,
        blood_oxygen: autoData.measurements.blood_oxygen,
        blood_sugar: autoData.measurements.blood_sugar,
        weight: autoData.measurements.weight,
        notes: `자동 측정 (${autoData.device_type}, Device: ${autoData.device_id})`,
      };

      return await this.createVitalRecord(vitalData);
    } catch (error) {
      console.error('💥 VitalsService.createAutoVitalRecord 오류:', error);
      throw {
        code: 'VITAL_003',
        message: '자동 바이탈 기록 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 거주자별 바이탈 기록 히스토리 조회
  static async getResidentVitalHistory(
    residentId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 50
  ): Promise<ApiResponse<VitalRecordWithResident[]>> {
    try {
      console.log('📊 VitalsService.getResidentVitalHistory 호출됨:', {
        residentId,
        startDate,
        endDate,
        limit,
      });

      let query = supabase
        .from('vital_records')
        .select(
          `
          *,
          resident:residents(id, name, room_number, age),
          measurer:staff_profiles(id, name, role)
        `
        )
        .eq('resident_id', residentId)
        .order('measured_at', { ascending: false })
        .limit(limit);

      if (startDate) {
        query = query.gte('measured_at', `${startDate}T00:00:00.000Z`);
      }

      if (endDate) {
        query = query.lte('measured_at', `${endDate}T23:59:59.999Z`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log('✅ 바이탈 히스토리 조회 성공:', data?.length);

      return {
        code: 'SUCCESS',
        message: '바이탈 히스토리 조회 성공',
        timestamp: new Date().toISOString(),
        data: (data || []) as VitalRecordWithResident[],
      };
    } catch (error) {
      console.error('💥 VitalsService.getResidentVitalHistory 오류:', error);
      throw {
        code: 'VITAL_004',
        message: '바이탈 히스토리 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 바이탈 기록 업데이트
  static async updateVitalRecord(
    recordId: string,
    updates: Partial<VitalRecord>
  ): Promise<ApiResponse<VitalRecord>> {
    try {
      console.log('🔄 VitalsService.updateVitalRecord 호출됨:', {
        recordId,
        updates,
      });

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('vital_records')
        .update(updateData)
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 바이탈 기록 업데이트 성공:', data);

      return {
        code: 'SUCCESS',
        message: '바이탈 기록 업데이트 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('💥 VitalsService.updateVitalRecord 오류:', error);
      throw {
        code: 'VITAL_005',
        message: '바이탈 기록 업데이트 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 바이탈 기록 삭제
  static async deleteVitalRecord(
    recordId: string
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      console.log('🗑️ VitalsService.deleteVitalRecord 호출됨:', { recordId });

      const { data, error } = await supabase
        .from('vital_records')
        .delete()
        .eq('id', recordId)
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ 바이탈 기록 삭제 성공:', data);

      return {
        code: 'SUCCESS',
        message: '바이탈 기록 삭제 성공',
        timestamp: new Date().toISOString(),
        data: data || { id: recordId },
      };
    } catch (error) {
      console.error('💥 VitalsService.deleteVitalRecord 오류:', error);
      throw {
        code: 'VITAL_007',
        message: '바이탈 기록 삭제 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 여러 바이탈 기록 일괄 삭제
  static async deleteMultipleVitalRecords(
    recordIds: string[]
  ): Promise<ApiResponse<{ count: number }>> {
    try {
      console.log('🗑️ VitalsService.deleteMultipleVitalRecords 호출됨:', {
        recordIds,
      });

      const { data, error, count } = await supabase
        .from('vital_records')
        .delete()
        .in('id', recordIds)
        .select('id');

      if (error) {
        throw error;
      }

      console.log('✅ 바이탈 기록 일괄 삭제 성공:', {
        count,
        deletedIds: data?.map((d) => d.id),
      });

      return {
        code: 'SUCCESS',
        message: `바이탈 기록 ${count || recordIds.length}개 삭제 성공`,
        timestamp: new Date().toISOString(),
        data: { count: count || recordIds.length },
      };
    } catch (error) {
      console.error('💥 VitalsService.deleteMultipleVitalRecords 오류:', error);
      throw {
        code: 'VITAL_008',
        message: '바이탈 기록 일괄 삭제 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // vital_records 테이블 존재 확인 및 생성
  private static async ensureVitalRecordsTable(): Promise<void> {
    try {
      // 테이블 존재 확인
      const { error: checkError } = await supabase
        .from('vital_records')
        .select('id')
        .limit(1);

      if (checkError && checkError.code === '42P01') {
        // 테이블이 없으면 생성
        console.log('📋 vital_records 테이블이 없습니다. 생성을 시도합니다...');

        // Supabase에서는 SQL을 직접 실행할 수 없으므로
        // 관리자에게 알림하거나 다른 방법으로 처리해야 합니다.
        console.warn('⚠️ vital_records 테이블을 수동으로 생성해야 합니다.');

        throw new Error(
          'vital_records 테이블이 존재하지 않습니다. 데이터베이스 관리자에게 문의하세요.'
        );
      }
    } catch (error) {
      console.error('💥 테이블 확인 오류:', error);
      throw error;
    }
  }

  // 샘플 데이터 생성 (개발/테스트용)
  static async createSampleVitalRecords(): Promise<ApiResponse<VitalRecord[]>> {
    try {
      console.log('🎯 샘플 바이탈 데이터 생성 시작...');

      // 먼저 거주자 목록 조회
      const { data: residents, error: residentsError } = await supabase
        .from('residents')
        .select('id, name')
        .eq('status', 'ACTIVE')
        .limit(5);

      if (residentsError || !residents || residents.length === 0) {
        throw new Error('활성 거주자가 없습니다.');
      }

      // 직원 목록 조회 (측정자)
      const { data: staff, error: staffError } = await supabase
        .from('staff_profiles')
        .select('id, name')
        .eq('status', 'ACTIVE')
        .limit(3);

      if (staffError || !staff || staff.length === 0) {
        throw new Error('활성 직원이 없습니다.');
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const sampleRecords = [];

      // 각 거주자별로 오늘과 어제의 바이탈 기록 생성
      for (const resident of residents) {
        for (const measureDate of [yesterday, today]) {
          // 오전 측정 (08:00)
          const morningTime = new Date(measureDate);
          morningTime.setHours(8, 0, 0, 0);

          sampleRecords.push({
            resident_id: resident.id,
            measurer_id: staff[Math.floor(Math.random() * staff.length)].id,
            measured_at: morningTime.toISOString(),
            systolic_bp: 110 + Math.floor(Math.random() * 30),
            diastolic_bp: 70 + Math.floor(Math.random() * 20),
            heart_rate: 65 + Math.floor(Math.random() * 20),
            temperature: 36.2 + Math.random() * 0.8,
            respiratory_rate: 16 + Math.floor(Math.random() * 6),
            blood_oxygen: 95 + Math.floor(Math.random() * 5),
            notes: '정상 범위',
          });

          // 오후 측정 (14:00)
          const afternoonTime = new Date(measureDate);
          afternoonTime.setHours(14, 0, 0, 0);

          sampleRecords.push({
            resident_id: resident.id,
            measurer_id: staff[Math.floor(Math.random() * staff.length)].id,
            measured_at: afternoonTime.toISOString(),
            systolic_bp: 115 + Math.floor(Math.random() * 25),
            diastolic_bp: 75 + Math.floor(Math.random() * 15),
            heart_rate: 70 + Math.floor(Math.random() * 15),
            temperature: 36.3 + Math.random() * 0.6,
            blood_oxygen: 96 + Math.floor(Math.random() * 4),
            notes: '안정적',
          });
        }
      }

      await this.ensureVitalRecordsTable();

      const { data, error } = await supabase
        .from('vital_records')
        .insert(sampleRecords)
        .select();

      if (error) {
        throw error;
      }

      console.log('✅ 샘플 바이탈 데이터 생성 완료:', data?.length);

      return {
        code: 'SUCCESS',
        message: `샘플 바이탈 데이터 ${data?.length}개 생성 완료`,
        timestamp: new Date().toISOString(),
        data: data || [],
      };
    } catch (error) {
      console.error('💥 샘플 데이터 생성 오류:', error);
      throw {
        code: 'VITAL_006',
        message: '샘플 바이탈 데이터 생성 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
