import { useState } from 'react';
import {
  EducationSearch,
  WorkRelatedRecommendations,
  EducationCategories,
  EducationTabs,
  useEducation,
  EducationMaterial,
  EducationCategory,
} from '@/features/education';

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { recommendedMaterials, recentMaterials, categories } = useEducation();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStartLearning = (material: EducationMaterial) => {
    // 학습 시작 로직 구현
    console.log('학습 시작:', material.title);
  };

  const handleCategoryClick = (category: EducationCategory) => {
    // 카테고리 클릭 로직 구현
    console.log('카테고리 선택:', category.label);
  };

  const handleMaterialClick = (material: EducationMaterial) => {
    // 교육 자료 클릭 로직 구현
    console.log('교육 자료 선택:', material.title);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">교육자료</h1>
        <div className="text-right text-sm text-gray-500">
          <p>오늘 학습 권장: 2건</p>
          <p>이번 주 목표: 5건</p>
        </div>
      </div>

      <EducationSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <WorkRelatedRecommendations
        materials={recommendedMaterials}
        onStartLearning={handleStartLearning}
      />

      <EducationCategories
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      <EducationTabs
        recommendedMaterials={recommendedMaterials}
        recentMaterials={recentMaterials}
        onMaterialClick={handleMaterialClick}
      />
    </div>
  );
}
