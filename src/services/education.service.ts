import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse, PagedResponse } from './api.types';

export type EducationMaterial = Tables<'education_materials'>;
export type EducationCategory = Tables<'education_categories'>;
export type UserLearningProgress = Tables<'user_learning_progress'>;

export interface EducationMaterialListItem {
  id: string;
  title: string;
  category_id: string | null;
  category_name?: string;
  type: string | null;
  content_url: string | null;
  thumbnail: string | null;
  duration: number | null;
  description: string | null;
  learning_objectives: string[] | null;
  tags: string[] | null;
  view_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  user_progress?: {
    last_position: number;
    completion_rate: number;
    completed: boolean;
    completed_at: string | null;
  };
}

export interface EducationCategoryWithMaterials {
  id: string;
  name: string;
  subcategories: string[] | null;
  created_at: string | null;
  material_count: number;
}

export class EducationService {
  // 교육 카테고리 목록 조회
  static async getCategories(): Promise<
    ApiResponse<EducationCategoryWithMaterials[]>
  > {
    try {
      const { data, error } = await supabase.from('education_categories')
        .select(`
          id,
          name,
          subcategories,
          created_at,
          education_materials(count)
        `);

      if (error) {
        throw error;
      }

      const categories: EducationCategoryWithMaterials[] = (data || []).map(
        (category) => ({
          id: category.id,
          name: category.name,
          subcategories: category.subcategories,
          created_at: category.created_at,
          material_count: Array.isArray(category.education_materials)
            ? category.education_materials.length
            : 0,
        })
      );

      return {
        code: 'SUCCESS',
        message: '교육 카테고리 조회 성공',
        timestamp: new Date().toISOString(),
        data: categories,
      };
    } catch (error) {
      console.error('Error fetching education categories:', error);
      throw {
        code: 'EDUCATION_001',
        message: '교육 카테고리 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 교육 자료 목록 조회
  static async getMaterials(params?: {
    categoryId?: string;
    type?: 'VIDEO' | 'DOCUMENT' | 'QUIZ' | 'INTERACTIVE';
    searchQuery?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<EducationMaterialListItem>>> {
    try {
      const {
        page = 1,
        size = 20,
        categoryId,
        type,
        searchQuery,
      } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('education_materials')
        .select(
          `
          id,
          title,
          category_id,
          type,
          content_url,
          thumbnail,
          duration,
          description,
          learning_objectives,
          tags,
          view_count,
          created_at,
          updated_at,
          education_categories(name)
        `,
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(from, to);

      // 카테고리 필터
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      // 타입 필터
      if (type) {
        query = query.eq('type', type);
      }

      // 검색어 필터
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }


      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const materials: EducationMaterialListItem[] = (data || []).map(
        (item) => ({
          id: item.id,
          title: item.title,
          category_id: item.category_id,
          category_name: item.education_categories?.name,
          type: item.type,
          content_url: item.content_url,
          thumbnail: item.thumbnail,
          duration: item.duration,
          description: item.description,
          learning_objectives: item.learning_objectives,
          tags: item.tags,
          view_count: item.view_count,
          created_at: item.created_at,
          updated_at: item.updated_at,
          user_progress: undefined,
        })
      );

      return {
        code: 'SUCCESS',
        message: '교육 자료 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: materials,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching education materials:', error);
      throw {
        code: 'EDUCATION_002',
        message: '교육 자료 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 교육 자료 상세 조회
  static async getMaterialDetail(
    materialId: string,
    userId?: string
  ): Promise<ApiResponse<EducationMaterialListItem>> {
    try {
      const { data, error } = await supabase
        .from('education_materials')
        .select(
          `
          *,
          education_categories(name),
          ${
            userId
              ? `user_learning_progress!left(
            last_position,
            completion_rate,
            completed,
            completed_at
          )`
              : ''
          }
        `
        )
        .eq('id', materialId)
        .single();

      if (error || !data) {
        throw new Error('교육 자료를 찾을 수 없습니다.');
      }

      // 조회수 증가
      await supabase
        .from('education_materials')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', materialId);

      const material: EducationMaterialListItem = {
        id: data.id,
        title: data.title,
        category_id: data.category_id,
        category_name: data.education_categories?.name,
        type: data.type,
        content_url: data.content_url,
        thumbnail: data.thumbnail,
        duration: data.duration,
        description: data.description,
        learning_objectives: data.learning_objectives,
        tags: data.tags,
        view_count: (data.view_count || 0) + 1,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_progress: data.user_learning_progress?.[0]
          ? {
              last_position: data.user_learning_progress[0].last_position || 0,
              completion_rate:
                data.user_learning_progress[0].completion_rate || 0,
              completed: data.user_learning_progress[0].completed || false,
              completed_at: data.user_learning_progress[0].completed_at,
            }
          : undefined,
      };

      return {
        code: 'SUCCESS',
        message: '교육 자료 상세 조회 성공',
        timestamp: new Date().toISOString(),
        data: material,
      };
    } catch (error) {
      console.error('Error fetching education material detail:', error);
      throw {
        code: 'EDUCATION_003',
        message: '교육 자료 상세 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 학습 진행률 업데이트
  static async updateLearningProgress(
    materialId: string,
    userId: string,
    progressData: {
      lastPosition?: number;
      completionRate?: number;
      completed?: boolean;
    }
  ): Promise<ApiResponse<UserLearningProgress>> {
    try {
      const updateData: any = {
        material_id: materialId,
        user_id: userId,
        updated_at: new Date().toISOString(),
      };

      if (progressData.lastPosition !== undefined) {
        updateData.last_position = progressData.lastPosition;
      }

      if (progressData.completionRate !== undefined) {
        updateData.completion_rate = progressData.completionRate;
      }

      if (progressData.completed !== undefined) {
        updateData.completed = progressData.completed;
        if (progressData.completed) {
          updateData.completed_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from('user_learning_progress')
        .upsert(updateData, {
          onConflict: 'user_id,material_id',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        code: 'SUCCESS',
        message: '학습 진행률 업데이트 성공',
        timestamp: new Date().toISOString(),
        data,
      };
    } catch (error) {
      console.error('Error updating learning progress:', error);
      throw {
        code: 'EDUCATION_004',
        message: '학습 진행률 업데이트 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 사용자 학습 통계 조회
  static async getUserLearningStats(userId: string): Promise<
    ApiResponse<{
      totalMaterials: number;
      completedMaterials: number;
      inProgressMaterials: number;
      totalLearningTime: number;
      completionRate: number;
    }>
  > {
    try {
      const { data: progressData, error } = await supabase
        .from('user_learning_progress')
        .select(
          `
          completed,
          completion_rate,
          education_materials(duration)
        `
        )
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const stats = {
        totalMaterials: progressData?.length || 0,
        completedMaterials:
          progressData?.filter((p) => p.completed).length || 0,
        inProgressMaterials:
          progressData?.filter(
            (p) => !p.completed && (p.completion_rate || 0) > 0
          ).length || 0,
        totalLearningTime:
          progressData?.reduce((total, p) => {
            const duration = p.education_materials?.duration || 0;
            const rate = (p.completion_rate || 0) / 100;
            return total + duration * rate;
          }, 0) || 0,
        completionRate: progressData?.length
          ? (progressData.filter((p) => p.completed).length /
              progressData.length) *
            100
          : 0,
      };

      return {
        code: 'SUCCESS',
        message: '학습 통계 조회 성공',
        timestamp: new Date().toISOString(),
        data: stats,
      };
    } catch (error) {
      console.error('Error fetching learning stats:', error);
      throw {
        code: 'EDUCATION_005',
        message: '학습 통계 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 최근 학습한 교육 자료 조회
  static async getRecentMaterials(
    userId: string,
    limit = 10
  ): Promise<ApiResponse<EducationMaterialListItem[]>> {
    try {
      // 사용자의 진행률 데이터를 먼저 조회
      const { data: progressData, error: progressError } = await supabase
        .from('user_learning_progress')
        .select(
          'material_id, last_position, completion_rate, completed, completed_at, updated_at'
        )
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (progressError) {
        throw progressError;
      }

      if (!progressData || progressData.length === 0) {
        return {
          code: 'SUCCESS',
          message: '최근 학습 자료 조회 성공',
          timestamp: new Date().toISOString(),
          data: [],
        };
      }

      // 교육 자료 세부 정보를 조회
      const materialIds = progressData.map((p) => p.material_id);
      const { data: materialData, error: materialError } = await supabase
        .from('education_materials')
        .select(
          `
          id,
          title,
          category_id,
          type,
          content_url,
          thumbnail,
          duration,
          description,
          learning_objectives,
          tags,
          view_count,
          created_at,
          updated_at,
          education_categories(name)
        `
        )
        .in('id', materialIds);

      if (materialError) {
        throw materialError;
      }

      // 진행률 데이터와 교육 자료를 매핑
      const progressMap = new Map(progressData.map((p) => [p.material_id, p]));

      const materials: EducationMaterialListItem[] = (materialData || [])
        .map((material) => {
          const progress = progressMap.get(material.id);
          return {
            id: material.id,
            title: material.title,
            category_id: material.category_id,
            category_name: material.education_categories?.name,
            type: material.type,
            content_url: material.content_url,
            thumbnail: material.thumbnail,
            duration: material.duration,
            description: material.description,
            learning_objectives: material.learning_objectives,
            tags: material.tags,
            view_count: material.view_count,
            created_at: material.created_at,
            updated_at: material.updated_at,
            user_progress: progress
              ? {
                  last_position: progress.last_position || 0,
                  completion_rate: progress.completion_rate || 0,
                  completed: progress.completed || false,
                  completed_at: progress.completed_at,
                }
              : undefined,
          };
        })
        .sort((a, b) => {
          // 진행률 업데이트 시간 기준으로 정렬
          const aProgress = progressMap.get(a.id);
          const bProgress = progressMap.get(b.id);
          const aTime = aProgress?.updated_at || '';
          const bTime = bProgress?.updated_at || '';
          return bTime.localeCompare(aTime);
        });

      return {
        code: 'SUCCESS',
        message: '최근 학습 자료 조회 성공',
        timestamp: new Date().toISOString(),
        data: materials,
      };
    } catch (error) {
      console.error('Error fetching recent materials:', error);
      throw {
        code: 'EDUCATION_006',
        message: '최근 학습 자료 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 추천 교육 자료 조회 (사용자의 역할, 완료하지 않은 자료 등을 기반으로)
  static async getRecommendedMaterials(
    userId: string,
    limit = 10
  ): Promise<ApiResponse<EducationMaterialListItem[]>> {
    try {
      // 인기 있는 교육 자료를 조회하고 사용자의 진행률을 별도로 가져옴
      const { data, error } = await supabase
        .from('education_materials')
        .select(
          `
          id,
          title,
          category_id,
          type,
          content_url,
          thumbnail,
          duration,
          description,
          learning_objectives,
          tags,
          view_count,
          created_at,
          updated_at,
          education_categories(name)
        `
        )
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // 각 자료에 대한 사용자 진행률을 별도로 조회
      const materialIds = data?.map((item) => item.id) || [];
      const { data: progressData } = await supabase
        .from('user_learning_progress')
        .select(
          'material_id, last_position, completion_rate, completed, completed_at'
        )
        .eq('user_id', userId)
        .in('material_id', materialIds);

      // 진행률 데이터를 매핑
      const progressMap = new Map(
        progressData?.map((p) => [p.material_id, p]) || []
      );

      const materials: EducationMaterialListItem[] = (data || []).map(
        (item) => {
          const progress = progressMap.get(item.id);
          return {
            id: item.id,
            title: item.title,
            category_id: item.category_id,
            category_name: item.education_categories?.name,
            type: item.type,
            content_url: item.content_url,
            thumbnail: item.thumbnail,
            duration: item.duration,
            description: item.description,
            learning_objectives: item.learning_objectives,
            tags: item.tags,
            view_count: item.view_count,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_progress: progress
              ? {
                  last_position: progress.last_position || 0,
                  completion_rate: progress.completion_rate || 0,
                  completed: progress.completed || false,
                  completed_at: progress.completed_at,
                }
              : undefined,
          };
        }
      );

      return {
        code: 'SUCCESS',
        message: '추천 교육 자료 조회 성공',
        timestamp: new Date().toISOString(),
        data: materials,
      };
    } catch (error) {
      console.error('Error fetching recommended materials:', error);
      throw {
        code: 'EDUCATION_007',
        message: '추천 교육 자료 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
