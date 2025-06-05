import { useState, useEffect } from 'react';
import { BookOpen, Heart, FileText, Shield, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  EducationSearch,
  WorkRelatedRecommendations,
  EducationCategories,
  EducationTabs,
  useEducation,
  EducationMaterial,
  EducationCategory,
} from '@/features/education';
import { useAppSelector } from '@/store';

// 카테고리 아이콘 매핑 함수
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case '주요업무':
      return <BookOpen className="h-5 w-5" />;
    case '케어기술':
      return <Heart className="h-5 w-5" />;
    case '기록지 입력방법':
      return <FileText className="h-5 w-5" />;
    case '안전관리':
      return <Shield className="h-5 w-5" />;
    default:
      return <BookOpen className="h-5 w-5" />;
  }
};

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

  // 현재 사용자 정보 (실제로는 auth에서 가져와야 함)
  const userId = 'current-user-id'; // TODO: 실제 사용자 ID로 교체

  const {
    categories: storeCategories,
    recommendedMaterials: storeRecommendedMaterials,
    allMaterials,
    isLoading,
    error,
    loadCategories,
    loadMaterials,
    loadRecentMaterials,
    loadRecommendedMaterials,
  } = useEducation();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCategories();
    loadMaterials({ userId });
    loadRecommendedMaterials(userId, 5);
    loadRecentMaterials(userId, 10);
  }, [
    loadCategories,
    loadMaterials,
    loadRecommendedMaterials,
    loadRecentMaterials,
    userId,
  ]);

  // Redux store의 데이터를 features/education 타입으로 변환
  const recommendedMaterials = storeRecommendedMaterials.map(
    convertToFeatureEducationMaterial
  );

  // 최근 자료도 전체 자료에서 필터링 (실제로는 별도 상태로 관리 가능)
  const recentMaterials = allMaterials
    .filter((m) => m.userProgress?.lastViewedAt)
    .sort((a, b) => {
      const aTime = a.userProgress?.lastViewedAt || '';
      const bTime = b.userProgress?.lastViewedAt || '';
      return bTime.localeCompare(aTime);
    })
    .slice(0, 10)
    .map(convertToFeatureEducationMaterial);

  // API에서 가져온 카테고리 데이터를 변환
  const categories: EducationCategory[] =
    storeCategories.length > 0
      ? storeCategories.map((cat) => ({
          id: cat.id,
          label: cat.name,
          icon: getCategoryIcon(cat.name),
          count: 0, // 실제로는 각 카테고리별 자료 수를 계산해야 함
        }))
      : tempCategories;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // 검색어가 변경되면 필터링된 결과를 다시 로드
    if (query.trim()) {
      loadMaterials({ userId, searchQuery: query });
    } else {
      loadMaterials({ userId });
    }
  };

  const handleStartLearning = (material: EducationMaterial) => {
    // 학습 시작 로직 구현 - 상세 페이지로 이동하거나 학습 모달 표시
    console.log('학습 시작:', material.title);
    // TODO: React Router로 상세 페이지 이동 또는 모달 표시
  };

  const handleCategoryClick = (category: EducationCategory) => {
    // 선택된 카테고리로 자료 필터링
    console.log('카테고리 선택:', category.label);
    loadMaterials({
      userId,
      categoryId: category.id,
      searchQuery: searchQuery || undefined,
    });
  };

  const handleMaterialClick = (material: EducationMaterial) => {
    // 교육 자료 상세 정보 로드 및 표시
    console.log('교육 자료 선택:', material.title);
    // TODO: 상세 정보 모달 표시 또는 상세 페이지로 이동
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">오류가 발생했습니다</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && allMaterials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">교육자료를 불러오는 중...</p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">교육자료</h1>
        <div className="text-right text-sm text-gray-500">
          <p>
            오늘 학습 권장:{' '}
            {
              recommendedMaterials.filter(
                (m) => !m.progress || m.progress < 100
              ).length
            }
            건
          </p>
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
