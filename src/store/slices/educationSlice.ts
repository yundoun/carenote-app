import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  tags: string[];
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
  filterType: 'all' | 'video' | 'document' | 'quiz' | 'completed' | 'in-progress';
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

const mockCategories: EducationCategory[] = [
  {
    id: 'cat-001',
    name: '주요업무',
    subcategories: ['요일별 업무', '일상업무', '시간대별 업무'],
  },
  {
    id: 'cat-002',
    name: '케어기술',
    subcategories: ['체위변경', '식사보조', '목욕보조', '이동보조'],
  },
  {
    id: 'cat-003',
    name: '기록지 입력방법',
    subcategories: ['간호기록', '투약기록', '활동기록'],
  },
  {
    id: 'cat-004',
    name: '안전관리',
    subcategories: ['낙상예방', '감염관리', '응급처치'],
  },
];

const mockMaterials: EducationMaterial[] = [
  {
    id: 'edu-001',
    title: '체위변경 기본 방법',
    category: '케어기술',
    subcategory: '체위변경',
    type: 'VIDEO',
    content: {
      url: 'https://cdn.carenote.com/videos/edu-001.mp4',
      duration: 600,
      subtitles: 'https://cdn.carenote.com/subtitles/edu-001.vtt',
    },
    description: '체위변경의 기본 원칙과 방법을 설명합니다.',
    thumbnail: 'https://cdn.carenote.com/edu/thumb-001.jpg',
    tags: ['체위변경', '욕창예방', '기본기술'],
    viewCount: 1523,
    learningObjectives: [
      '체위변경의 중요성 이해',
      '올바른 체위변경 방법 습득',
      '욕창 예방 방법 학습',
    ],
    relatedMaterials: ['edu-002', 'edu-003'],
    difficulty: 'BEGINNER',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
    userProgress: {
      completed: false,
      lastPosition: 120,
      completionRate: 20,
      lastViewedAt: '2025-05-28T14:30:00Z',
      attempts: 1,
    },
  },
  {
    id: 'edu-002',
    title: '투약 기록 작성법',
    category: '기록지 입력방법',
    subcategory: '투약기록',
    type: 'DOCUMENT',
    content: {
      url: 'https://cdn.carenote.com/docs/edu-002.pdf',
      downloadUrl: 'https://cdn.carenote.com/downloads/edu-002.pdf',
    },
    description: '정확한 투약 기록 작성 방법을 학습합니다.',
    thumbnail: 'https://cdn.carenote.com/edu/thumb-002.jpg',
    tags: ['투약', '기록작성', '안전'],
    viewCount: 892,
    learningObjectives: [
      '투약 기록의 중요성 이해',
      '정확한 기록 작성 방법 습득',
      '오류 예방 방법 학습',
    ],
    relatedMaterials: ['edu-001'],
    difficulty: 'INTERMEDIATE',
    createdAt: '2025-03-20T00:00:00Z',
    updatedAt: '2025-03-20T00:00:00Z',
    userProgress: {
      completed: true,
      lastPosition: 0,
      completionRate: 100,
      lastViewedAt: '2025-05-25T10:00:00Z',
      attempts: 2,
      score: 85,
    },
  },
];

const initialState: EducationState = {
  categories: mockCategories,
  materials: mockMaterials,
  filteredMaterials: mockMaterials,
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
    totalElements: mockMaterials.length,
    totalPages: 1,
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
    setFilterType: (state, action: PayloadAction<EducationState['filterType']>) => {
      state.filterType = action.payload;
      state.filteredMaterials = filterMaterials(state);
    },
    setSortBy: (state, action: PayloadAction<EducationState['sortBy']>) => {
      state.sortBy = action.payload;
      state.filteredMaterials = sortMaterials(state.filteredMaterials, action.payload);
    },
    setSelectedMaterial: (state, action: PayloadAction<EducationMaterial | null>) => {
      state.selectedMaterial = action.payload;
    },
    updateMaterialProgress: (state, action: PayloadAction<{
      materialId: string;
      progress: Partial<EducationProgress>;
    }>) => {
      const { materialId, progress } = action.payload;
      const material = state.materials.find(m => m.id === materialId);
      if (material) {
        material.userProgress = {
          ...material.userProgress,
          ...progress,
          lastViewedAt: new Date().toISOString(),
        } as EducationMaterial['userProgress'];
      }
    },
    completeMaterial: (state, action: PayloadAction<{
      materialId: string;
      score?: number;
    }>) => {
      const { materialId, score } = action.payload;
      const material = state.materials.find(m => m.id === materialId);
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
      const material = state.materials.find(m => m.id === action.payload);
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
});

// 헬퍼 함수들
function filterMaterials(state: EducationState): EducationMaterial[] {
  let filtered = state.materials;

  // 카테고리 필터링
  if (state.currentCategory) {
    filtered = filtered.filter(m => m.category === state.currentCategory);
  }

  // 타입별 필터링
  switch (state.filterType) {
    case 'video':
      filtered = filtered.filter(m => m.type === 'VIDEO');
      break;
    case 'document':
      filtered = filtered.filter(m => m.type === 'DOCUMENT');
      break;
    case 'quiz':
      filtered = filtered.filter(m => m.type === 'QUIZ');
      break;
    case 'completed':
      filtered = filtered.filter(m => m.userProgress?.completed);
      break;
    case 'in-progress':
      filtered = filtered.filter(m => m.userProgress && !m.userProgress.completed && m.userProgress.completionRate > 0);
      break;
  }

  // 검색어 필터링
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return sortMaterials(filtered, state.sortBy);
}

function sortMaterials(materials: EducationMaterial[], sortBy: EducationState['sortBy']): EducationMaterial[] {
  const sorted = [...materials];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case 'popular':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'duration':
      return sorted.sort((a, b) => (a.content.duration || 0) - (b.content.duration || 0));
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

export default educationSlice.reducer;