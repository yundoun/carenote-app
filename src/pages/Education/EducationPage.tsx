import { useState } from 'react';
import { BookOpen, Heart, FileText, Shield } from 'lucide-react';
import {
  EducationSearch,
  WorkRelatedRecommendations,
  EducationCategories,
  EducationTabs,
  useEducation,
  EducationMaterial,
  EducationCategory,
} from '@/features/education';

// Redux store의 EducationMaterial을 features/education의 EducationMaterial로 변환
const convertToFeatureEducationMaterial = (
  storeMaterial: any
): EducationMaterial => {
  return {
    id: storeMaterial.id,
    title: storeMaterial.title,
    type: storeMaterial.type === 'VIDEO' ? 'video' : 'document',
    duration: storeMaterial.content.duration
      ? `${Math.floor(storeMaterial.content.duration / 60)}분`
      : '미정',
    category: storeMaterial.category,
    thumbnail: storeMaterial.thumbnail || '',
    progress: storeMaterial.userProgress?.completionRate || 0,
    difficulty: storeMaterial.difficulty.toLowerCase() as
      | 'beginner'
      | 'intermediate'
      | 'advanced',
    rating: 4.5, // 임시값, 추후 실제 평점 데이터로 변경
    description: storeMaterial.description,
    relatedToWork: storeMaterial.category === '주요업무',
  };
};

// 임시 카테고리 데이터 (추후 Redux store에서 가져올 예정)
const tempCategories: EducationCategory[] = [
  {
    id: 'cat-001',
    label: '주요업무',
    icon: <BookOpen className="h-5 w-5" />,
    count: 12,
  },
  {
    id: 'cat-002',
    label: '케어기술',
    icon: <Heart className="h-5 w-5" />,
    count: 8,
  },
  {
    id: 'cat-003',
    label: '기록지 입력방법',
    icon: <FileText className="h-5 w-5" />,
    count: 6,
  },
  {
    id: 'cat-004',
    label: '안전관리',
    icon: <Shield className="h-5 w-5" />,
    count: 5,
  },
];

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { recommendedMaterials: storeRecommendedMaterials } = useEducation();

  // Redux store의 데이터를 features/education 타입으로 변환
  const recommendedMaterials = storeRecommendedMaterials.map(
    convertToFeatureEducationMaterial
  );

  // TODO: recentMaterials는 추후 useEducation에서 제공될 예정
  const recentMaterials: EducationMaterial[] = [];

  // TODO: 추후 Redux store에서 카테고리 데이터를 가져와 변환할 예정
  const categories = tempCategories;

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
