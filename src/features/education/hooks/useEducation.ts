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
} from '@/store/slices/educationSlice';
import type { EducationMaterial, EducationProgress } from '@/store/slices/educationSlice';

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

  const setCategory = useCallback((category: string | null) => {
    dispatch(setCurrentCategory(category));
  }, [dispatch]);

  const setSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const setFilter = useCallback((filter: typeof filterType) => {
    dispatch(setFilterType(filter));
  }, [dispatch]);

  const setSort = useCallback((sort: typeof sortBy) => {
    dispatch(setSortBy(sort));
  }, [dispatch]);

  const selectMaterial = useCallback((material: EducationMaterial | null) => {
    dispatch(setSelectedMaterial(material));
    if (material) {
      dispatch(incrementViewCount(material.id));
    }
  }, [dispatch]);

  const updateProgress = useCallback((materialId: string, progress: Partial<EducationProgress>) => {
    dispatch(updateMaterialProgress({ materialId, progress }));
  }, [dispatch]);

  const markComplete = useCallback((materialId: string, score?: number) => {
    dispatch(completeMaterial({ materialId, score }));
  }, [dispatch]);

  // 통계 계산
  const totalMaterials = materials.length;
  const completedMaterials = materials.filter(m => m.userProgress?.completed).length;
  const inProgressMaterials = materials.filter(m => 
    m.userProgress && !m.userProgress.completed && m.userProgress.completionRate > 0
  ).length;
  const completionRate = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

  // 추천 자료
  const recommendedMaterials = materials
    .filter(m => !m.userProgress?.completed)
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
  };
}