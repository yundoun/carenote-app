import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse, PagedResponse, CareLevel } from './api.types';

export type Resident = Tables<'residents'>;
export type ResidentWithFamily = Resident & {
  family_contacts: Tables<'family_contacts'>[];
  medications: Tables<'medications'>[];
};

export interface ResidentListItem {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  room_number: string | null;
  profile_image: string | null;
  care_level: CareLevel | null;
  main_diagnosis: string | null;
  status: string | null;
}

export interface ResidentDetailResponse {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  room_number: string | null;
  birth_date: string | null;
  profile_image: string | null;
  care_level: CareLevel | null;
  main_diagnosis: string | null;
  sub_diagnosis: string[] | null;
  family_info: {
    primary_contact: {
      name: string;
      relationship: string | null;
      phone_number: string | null;
    };
  };
  care_notes: string[] | null;
  care_requirements: string[] | null;
  medications: Array<{
    name: string;
    dosage: string | null;
    frequency: string | null;
    administration_time: string | null;
  }>;
}

export class ResidentsService {
  // 담당 입주자 목록 조회
  static async getResidentList(params?: {
    caregiverId?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<ResidentListItem>>> {
    try {
      console.log('🔍 ResidentsService.getResidentList 호출됨:', params);

      const { page = 1, size = 20, caregiverId } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      console.log('📄 쿼리 파라미터:', { page, size, from, to, caregiverId });

      let query = supabase
        .from('residents')
        .select(
          'id, name, age, gender, room_number, profile_image, care_level, main_diagnosis, status'
        )
        .eq('status', 'ACTIVE')
        .range(from, to);

      // caregiverId가 있으면 해당 요양보호사가 담당하는 거주자만 필터링
      // 실제로는 staff와 resident 간의 관계 테이블이 필요하지만,
      // 현재는 같은 층/유닛으로 간주
      if (caregiverId) {
        // 추후 구현: 담당자별 필터링 로직
        console.log('👤 caregiverId 필터링:', caregiverId);
      }

      console.log('🚀 Supabase 쿼리 실행 중...');
      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Supabase 쿼리 오류:', error);
        throw error;
      }

      console.log('✅ Supabase 쿼리 성공!');
      console.log('📊 조회된 데이터:', data);
      console.log('🔢 총 개수:', count);

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const result = {
        code: 'SUCCESS',
        message: '입주자 목록 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: (data || []).map((item) => ({
            ...item,
            care_level: item.care_level as CareLevel | null,
          })),
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };

      console.log('📋 최종 반환 데이터:', result);
      return result;
    } catch (error) {
      console.error('💥 ResidentsService.getResidentList 오류:', error);
      throw {
        code: 'RESIDENT_001',
        message: '입주자 목록 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 입주자 상세 정보 조회
  static async getResidentDetail(
    residentId: string
  ): Promise<ApiResponse<ResidentDetailResponse>> {
    try {
      // 거주자 기본 정보 조회
      const { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('*')
        .eq('id', residentId)
        .single();

      if (residentError || !resident) {
        throw new Error('거주자를 찾을 수 없습니다.');
      }

      // 가족 연락처 조회
      const { data: familyContacts, error: familyError } = await supabase
        .from('family_contacts')
        .select('*')
        .eq('resident_id', residentId);

      if (familyError) {
        throw familyError;
      }

      // 약물 정보 조회
      const { data: medications, error: medicationsError } = await supabase
        .from('medications')
        .select('name, dosage, frequency, administration_time')
        .eq('resident_id', residentId);

      if (medicationsError) {
        throw medicationsError;
      }

      // 주 연락처 찾기
      const primaryContact =
        familyContacts?.find((contact) => contact.is_primary) ||
        familyContacts?.[0];

      const response: ResidentDetailResponse = {
        id: resident.id,
        name: resident.name,
        age: resident.age,
        gender: resident.gender,
        room_number: resident.room_number,
        birth_date: resident.birth_date,
        profile_image: resident.profile_image,
        care_level: resident.care_level as CareLevel,
        main_diagnosis: resident.main_diagnosis,
        sub_diagnosis: resident.sub_diagnosis,
        family_info: {
          primary_contact: {
            name: primaryContact?.name || '',
            relationship: primaryContact?.relationship || null,
            phone_number: primaryContact?.phone_number || null,
          },
        },
        care_notes: resident.care_notes,
        care_requirements: resident.care_requirements,
        medications: medications || [],
      };

      return {
        code: 'SUCCESS',
        message: '입주자 상세 정보 조회 성공',
        timestamp: new Date().toISOString(),
        data: response,
      };
    } catch (error) {
      console.error('Error fetching resident detail:', error);
      throw {
        code: 'RESIDENT_002',
        message: '입주자 상세 정보 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
