import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  EducationService,
  type EducationMaterialListItem,
  type EducationCategoryWithMaterials,
} from '@/services/education.service';

export interface EducationCategory {
  id: string;
  name: string;
  subcategories: string[];
}

export interface EducationMaterial {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  type: 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE' | 'QUIZ';
  content: {
    url: string;
    duration?: number; // 초 단위
    subtitles?: string;
    downloadUrl?: string;
  };
  description: string;
  thumbnail?: string;
  viewCount: number;
  learningObjectives: string[];
  relatedMaterials: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
  updatedAt: string;
  userProgress?: {
    completed: boolean;
    lastPosition: number;
    completionRate: number;
    lastViewedAt?: string;
    attempts?: number;
    score?: number;
  };
}

export interface EducationProgress {
  materialId: string;
  userId: string;
  position: number;
  duration: number;
  completed: boolean;
  completionRate: number;
  score?: number;
  attempts: number;
  lastViewedAt: string;
}

export interface EducationState {
  categories: EducationCategory[];
  materials: EducationMaterial[];
  filteredMaterials: EducationMaterial[];
  selectedMaterial: EducationMaterial | null;
  currentCategory: string | null;
  searchQuery: string;
  filterType:
    | 'all'
    | 'video'
    | 'document'
    | 'quiz'
    | 'completed'
    | 'in-progress';
  sortBy: 'recent' | 'popular' | 'title' | 'duration';
  userProgress: Record<string, EducationProgress>;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// API 비동기 액션들
export const fetchEducationCategories = createAsyncThunk(
  'education/fetchCategories',
  async () => {
    const response = await EducationService.getCategories();
    return response.data;
  }
);

export const fetchEducationMaterials = createAsyncThunk(
  'education/fetchMaterials',
  async (params?: {
    categoryId?: string;
    type?: 'VIDEO' | 'DOCUMENT' | 'QUIZ' | 'INTERACTIVE';
    searchQuery?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await EducationService.getMaterials(params);
    return response.data;
  }
);

export const fetchEducationMaterialDetail = createAsyncThunk(
  'education/fetchMaterialDetail',
  async ({ materialId, userId }: { materialId: string; userId?: string }) => {
    const response = await EducationService.getMaterialDetail(
      materialId,
      userId
    );
    return response.data;
  }
);

export const updateLearningProgress = createAsyncThunk(
  'education/updateProgress',
  async ({
    materialId,
    userId,
    progressData,
  }: {
    materialId: string;
    userId: string;
    progressData: {
      lastPosition?: number;
      completionRate?: number;
      completed?: boolean;
    };
  }) => {
    const response = await EducationService.updateLearningProgress(
      materialId,
      userId,
      progressData
    );
    return { materialId, progressData: response.data };
  }
);

export const fetchUserLearningStats = createAsyncThunk(
  'education/fetchUserStats',
  async (userId: string) => {
    const response = await EducationService.getUserLearningStats(userId);
    return response.data;
  }
);

export const fetchRecentMaterials = createAsyncThunk(
  'education/fetchRecentMaterials',
  async ({ userId, limit = 10 }: { userId: string; limit?: number }) => {
    const response = await EducationService.getRecentMaterials(userId, limit);
    return response.data;
  }
);

export const fetchRecommendedMaterials = createAsyncThunk(
  'education/fetchRecommendedMaterials',
  async ({ userId, limit = 10 }: { userId: string; limit?: number }) => {
    const response = await EducationService.getRecommendedMaterials(
      userId,
      limit
    );
    return response.data;
  }
);

// API 응답을 Redux 타입으로 변환하는 함수
function transformApiCategory(
  apiCategory: EducationCategoryWithMaterials
): EducationCategory {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    subcategories: apiCategory.subcategories || [],
  };
}

function transformApiMaterial(
  apiMaterial: EducationMaterialListItem
): EducationMaterial {
  return {
    id: apiMaterial.id,
    title: apiMaterial.title,
    category: apiMaterial.category_name || '',
    subcategory: undefined, // API에서 제공되지 않음
    type:
      (apiMaterial.type as 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE' | 'QUIZ') ||
      'DOCUMENT',
    content: {
      url: apiMaterial.content_url || '',
      duration: apiMaterial.duration || undefined,
    },
    description: apiMaterial.description || '',
    thumbnail: apiMaterial.thumbnail || undefined,
    viewCount: apiMaterial.view_count || 0,
    learningObjectives: apiMaterial.learning_objectives || [],
    relatedMaterials: [], // API에서 제공되지 않음
    difficulty: 'BEGINNER' as const, // API에서 제공되지 않음
    createdAt: apiMaterial.created_at || '',
    updatedAt: apiMaterial.updated_at || '',
    userProgress: apiMaterial.user_progress
      ? {
          completed: apiMaterial.user_progress.completed,
          lastPosition: apiMaterial.user_progress.last_position,
          completionRate: apiMaterial.user_progress.completion_rate,
          lastViewedAt: apiMaterial.user_progress.completed_at || undefined,
        }
      : undefined,
  };
}

const initialState: EducationState = {
  categories: [],
  materials: [],
  filteredMaterials: [],
  selectedMaterial: null,
  currentCategory: null,
  searchQuery: '',
  filterType: 'all',
  sortBy: 'recent',
  userProgress: {},
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  },
};

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
      state.filteredMaterials = filterMaterials(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredMaterials = filterMaterials(state);
    },
    setFilterType: (
      state,
      action: PayloadAction<EducationState['filterType']>
    ) => {
      state.filterType = action.payload;
      state.filteredMaterials = filterMaterials(state);
    },
    setSortBy: (state, action: PayloadAction<EducationState['sortBy']>) => {
      state.sortBy = action.payload;
      state.filteredMaterials = sortMaterials(
        state.filteredMaterials,
        action.payload
      );
    },
    setSelectedMaterial: (
      state,
      action: PayloadAction<EducationMaterial | null>
    ) => {
      state.selectedMaterial = action.payload;
    },
    updateMaterialProgress: (
      state,
      action: PayloadAction<{
        materialId: string;
        progress: Partial<EducationProgress>;
      }>
    ) => {
      const { materialId, progress } = action.payload;
      const material = state.materials.find((m) => m.id === materialId);
      if (material) {
        material.userProgress = {
          ...material.userProgress,
          ...progress,
          lastViewedAt: new Date().toISOString(),
        } as EducationMaterial['userProgress'];
      }
    },
    completeMaterial: (
      state,
      action: PayloadAction<{
        materialId: string;
        score?: number;
      }>
    ) => {
      const { materialId, score } = action.payload;
      const material = state.materials.find((m) => m.id === materialId);
      if (material && material.userProgress) {
        material.userProgress.completed = true;
        material.userProgress.completionRate = 100;
        material.userProgress.lastViewedAt = new Date().toISOString();
        if (score !== undefined) {
          material.userProgress.score = score;
        }
      }
    },
    incrementViewCount: (state, action: PayloadAction<string>) => {
      const material = state.materials.find((m) => m.id === action.payload);
      if (material) {
        material.viewCount += 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEducationCategories
      .addCase(fetchEducationCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEducationCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.map(transformApiCategory);
      })
      .addCase(fetchEducationCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || '교육 카테고리 조회에 실패했습니다.';
      })
      // fetchEducationMaterials
      .addCase(fetchEducationMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEducationMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const transformedMaterials =
          action.payload.content.map(transformApiMaterial);
        state.materials = transformedMaterials;
        state.filteredMaterials = filterMaterials(state);
        state.pagination = {
          page: action.payload.page.number,
          size: action.payload.page.size,
          totalElements: action.payload.page.totalElements,
          totalPages: action.payload.page.totalPages,
        };
      })
      .addCase(fetchEducationMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '교육 자료 조회에 실패했습니다.';
      })
      // fetchEducationMaterialDetail
      .addCase(fetchEducationMaterialDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEducationMaterialDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMaterial = transformApiMaterial(action.payload);
      })
      .addCase(fetchEducationMaterialDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || '교육 자료 상세 조회에 실패했습니다.';
      })
      // updateLearningProgress
      .addCase(updateLearningProgress.fulfilled, (state, action) => {
        const { materialId } = action.payload;
        const material = state.materials.find((m) => m.id === materialId);
        if (material && material.userProgress) {
          // API 응답에 따라 업데이트
          material.userProgress.lastViewedAt = new Date().toISOString();
        }
        if (
          state.selectedMaterial?.id === materialId &&
          state.selectedMaterial.userProgress
        ) {
          state.selectedMaterial.userProgress.lastViewedAt =
            new Date().toISOString();
        }
      })
      // fetchRecentMaterials
      .addCase(fetchRecentMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        // 최근 자료는 별도 상태로 관리할 수 있지만,
        // 현재는 기존 materials에 포함시킴
        const transformedMaterials = action.payload.map(transformApiMaterial);
        // 기존 materials에서 중복 제거하고 추가
        const existingIds = new Set(state.materials.map((m) => m.id));
        const newMaterials = transformedMaterials.filter(
          (m) => !existingIds.has(m.id)
        );
        state.materials = [...newMaterials, ...state.materials];
        state.filteredMaterials = filterMaterials(state);
      })
      .addCase(fetchRecentMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '최근 자료 조회에 실패했습니다.';
      })
      // fetchRecommendedMaterials
      .addCase(fetchRecommendedMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const transformedMaterials = action.payload.map(transformApiMaterial);
        // 기존 materials에서 중복 제거하고 추가
        const existingIds = new Set(state.materials.map((m) => m.id));
        const newMaterials = transformedMaterials.filter(
          (m) => !existingIds.has(m.id)
        );
        state.materials = [...newMaterials, ...state.materials];
        state.filteredMaterials = filterMaterials(state);
      })
      .addCase(fetchRecommendedMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '추천 자료 조회에 실패했습니다.';
      });
  },
});

// 헬퍼 함수들
function filterMaterials(state: EducationState): EducationMaterial[] {
  let filtered = state.materials;

  // 카테고리 필터링
  if (state.currentCategory) {
    filtered = filtered.filter((m) => m.category === state.currentCategory);
  }

  // 타입별 필터링
  switch (state.filterType) {
    case 'video':
      filtered = filtered.filter((m) => m.type === 'VIDEO');
      break;
    case 'document':
      filtered = filtered.filter((m) => m.type === 'DOCUMENT');
      break;
    case 'quiz':
      filtered = filtered.filter((m) => m.type === 'QUIZ');
      break;
    case 'completed':
      filtered = filtered.filter((m) => m.userProgress?.completed);
      break;
    case 'in-progress':
      filtered = filtered.filter(
        (m) =>
          m.userProgress &&
          !m.userProgress.completed &&
          m.userProgress.completionRate > 0
      );
      break;
  }

  // 검색어 필터링
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
  }

  return sortMaterials(filtered, state.sortBy);
}

function sortMaterials(
  materials: EducationMaterial[],
  sortBy: EducationState['sortBy']
): EducationMaterial[] {
  const sorted = [...materials];

  switch (sortBy) {
    case 'recent':
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'duration':
      return sorted.sort(
        (a, b) => (a.content.duration || 0) - (b.content.duration || 0)
      );
    default:
      return sorted;
  }
}

export const {
  setCurrentCategory,
  setSearchQuery,
  setFilterType,
  setSortBy,
  setSelectedMaterial,
  updateMaterialProgress,
  completeMaterial,
  incrementViewCount,
  setLoading,
  setError,
} = educationSlice.actions;

// 비동기 액션들은 이미 위에서 export되었으므로 별도 export 불필요

export default educationSlice.reducer;
