import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setCurrentCategory,
  setSearchQuery,
  setFilterType,
  setSortBy,
  setSelectedMaterial,
  updateMaterialProgress,
  completeMaterial,
  incrementViewCount,
  fetchEducationCategories,
  fetchEducationMaterials,
  fetchEducationMaterialDetail,
  fetchRecentMaterials,
  fetchRecommendedMaterials,
  updateLearningProgress,
  fetchUserLearningStats,
} from '@/store/slices/educationSlice';
import type {
  EducationMaterial,
  EducationProgress,
} from '@/store/slices/educationSlice';

export function useEducation() {
  const dispatch = useAppDispatch();
  const {
    categories,
    materials,
    filteredMaterials,
    selectedMaterial,
    currentCategory,
    searchQuery,
    filterType,
    sortBy,
    userProgress,
    isLoading,
    error,
    pagination,
  } = useAppSelector((state) => state.education);

  const setCategory = useCallback(
    (category: string | null) => {
      dispatch(setCurrentCategory(category));
    },
    [dispatch]
  );

  const setSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const setFilter = useCallback(
    (filter: typeof filterType) => {
      dispatch(setFilterType(filter));
    },
    [dispatch]
  );

  const setSort = useCallback(
    (sort: typeof sortBy) => {
      dispatch(setSortBy(sort));
    },
    [dispatch]
  );

  const selectMaterial = useCallback(
    (material: EducationMaterial | null) => {
      dispatch(setSelectedMaterial(material));
      if (material) {
        dispatch(incrementViewCount(material.id));
      }
    },
    [dispatch]
  );

  const updateProgress = useCallback(
    (materialId: string, progress: Partial<EducationProgress>) => {
      dispatch(updateMaterialProgress({ materialId, progress }));
    },
    [dispatch]
  );

  const markComplete = useCallback(
    (materialId: string, score?: number) => {
      dispatch(completeMaterial({ materialId, score }));
    },
    [dispatch]
  );

  // API 호출 메서드들
  const loadCategories = useCallback(() => {
    dispatch(fetchEducationCategories());
  }, [dispatch]);

  const loadMaterials = useCallback(
    (params?: {
      categoryId?: string;
      type?: 'VIDEO' | 'DOCUMENT' | 'QUIZ' | 'INTERACTIVE';
      searchQuery?: string;
      page?: number;
      size?: number;
    }) => {
      dispatch(fetchEducationMaterials(params));
    },
    [dispatch]
  );

  const loadMaterialDetail = useCallback(
    (materialId: string, userId?: string) => {
      dispatch(fetchEducationMaterialDetail({ materialId, userId }));
    },
    [dispatch]
  );

  const loadRecentMaterials = useCallback(
    (limit = 10) => {
      // TODO: 실제 사용자 ID 구현 필요
      // dispatch(fetchRecentMaterials({ userId: 'current-user-id', limit }));
    },
    [dispatch]
  );

  const loadRecommendedMaterials = useCallback(
    (limit = 10) => {
      // TODO: 실제 사용자 ID 구현 필요  
      // dispatch(fetchRecommendedMaterials({ userId: 'current-user-id', limit }));
    },
    [dispatch]
  );

  const saveLearningProgress = useCallback(
    (
      materialId: string,
      userId: string,
      progressData: {
        lastPosition?: number;
        completionRate?: number;
        completed?: boolean;
      }
    ) => {
      dispatch(updateLearningProgress({ materialId, userId, progressData }));
    },
    [dispatch]
  );

  const loadUserStats = useCallback(
    (userId: string) => {
      dispatch(fetchUserLearningStats(userId));
    },
    [dispatch]
  );

  // 통계 계산
  const totalMaterials = materials.length;
  const completedMaterials = materials.filter(
    (m) => m.userProgress?.completed
  ).length;
  const inProgressMaterials = materials.filter(
    (m) =>
      m.userProgress &&
      !m.userProgress.completed &&
      m.userProgress.completionRate > 0
  ).length;
  const completionRate =
    totalMaterials > 0
      ? Math.round((completedMaterials / totalMaterials) * 100)
      : 0;

  // 추천 자료
  const recommendedMaterials = materials
    .filter((m) => !m.userProgress?.completed)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  return {
    categories,
    materials: filteredMaterials,
    allMaterials: materials,
    selectedMaterial,
    currentCategory,
    searchQuery,
    filterType,
    sortBy,
    userProgress,
    isLoading,
    error,
    pagination,
    totalMaterials,
    completedMaterials,
    inProgressMaterials,
    completionRate,
    recommendedMaterials,
    setCategory,
    setSearch,
    setFilter,
    setSort,
    selectMaterial,
    updateProgress,
    markComplete,
    // API 메서드들
    loadCategories,
    loadMaterials,
    loadMaterialDetail,
    loadRecentMaterials,
    loadRecommendedMaterials,
    saveLearningProgress,
    loadUserStats,
  };
}
