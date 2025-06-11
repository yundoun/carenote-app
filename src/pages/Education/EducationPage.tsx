import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Heart,
  FileText,
  Shield,
  Loader2,
  Settings,
} from 'lucide-react';
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
import { extractYouTubeVideoId } from '@/lib/utils';

// 카테고리 아이콘 매핑 함수
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case '케어기술':
      return <Heart className="h-5 w-5" />;
    case '안전관리':
      return <Shield className="h-5 w-5" />;
    case '주요업무':
      return <BookOpen className="h-5 w-5" />;
    case '기록지 입력방법':
      return <FileText className="h-5 w-5" />;
    default:
      return <Settings className="h-5 w-5" />;
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
    duration: storeMaterial.content?.duration
      ? `${Math.floor(storeMaterial.content.duration / 60)}분`
      : storeMaterial.duration
      ? `${Math.floor(storeMaterial.duration / 60)}분`
      : '미정',
    category: storeMaterial.category || storeMaterial.category_name,
    thumbnail: storeMaterial.thumbnail || '',
    contentUrl:
      storeMaterial.content?.url ||
      storeMaterial.content_url ||
      storeMaterial.contentUrl,
    progress:
      storeMaterial.userProgress?.completionRate ||
      storeMaterial.user_progress?.completion_rate ||
      0,
    difficulty: (storeMaterial.difficulty || 'beginner').toLowerCase() as
      | 'beginner'
      | 'intermediate'
      | 'advanced',
    description: storeMaterial.description,
    relatedToWork:
      storeMaterial.category === '주요업무' ||
      storeMaterial.category_name === '주요업무',
  };
};

// Redux store에서 가져온 카테고리 기반으로 동적 카테고리 생성 함수
const generateCategoriesFromStore = (
  storeCategories: any[],
  materials: any[]
): EducationCategory[] => {
  const categoryCounts = new Map<string, number>();

  // 모든 materials의 category를 수집하고 카운트
  materials.forEach((material) => {
    const categoryName = material.category_name || material.category;
    if (categoryName) {
      categoryCounts.set(
        categoryName,
        (categoryCounts.get(categoryName) || 0) + 1
      );
    }
  });

  // store 카테고리를 기반으로 모든 카테고리 반환 (중복 제거 및 자료가 없어도 0개로 표시)
  const uniqueCategories = storeCategories.reduce((acc: any[], category: any) => {
    if (!acc.some((existing: any) => existing.name === category.name)) {
      acc.push(category);
    }
    return acc;
  }, [] as any[]);

  const result = uniqueCategories.map((category) => ({
    id: `category-${category.id}`,
    label: category.name,
    icon: getCategoryIcon(category.name),
    count: categoryCounts.get(category.name) || 0,
  }));

  console.log('최종 카테고리 결과:', result);
  return result;
};

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    loadMaterials();
    loadRecommendedMaterials(5);
    loadRecentMaterials(10);
  }, [
    loadCategories,
    loadMaterials,
    loadRecommendedMaterials,
    loadRecentMaterials,
    userId,
  ]);

  // Store 카테고리 기반으로 동적 카테고리 생성
  const categories = useMemo(() => {
    const result = generateCategoriesFromStore(storeCategories, allMaterials);
    return result;
  }, [storeCategories, allMaterials]);

  // 선택된 카테고리가 있을 때는 전체 자료에서 필터링된 결과를 표시
  const getDisplayMaterials = () => {
    if (selectedCategory) {
      // 카테고리가 선택된 경우 해당 카테고리의 모든 자료를 표시
      const categoryMaterials = allMaterials.filter((material) => {
        const categoryName = (material as any).category_name || material.category;
        return categoryName === selectedCategory;
      });

      return categoryMaterials.map(convertToFeatureEducationMaterial);
    } else {
      // 카테고리가 선택되지 않은 경우 기존 추천 자료 사용
      return storeRecommendedMaterials.map(convertToFeatureEducationMaterial);
    }
  };

  const getFilteredRecentMaterials = () => {
    let filtered = allMaterials.filter((m) => m.userProgress?.lastViewedAt);

    if (selectedCategory) {
      filtered = filtered.filter((material) => {
        const categoryName = (material as any).category_name || material.category;
        return categoryName === selectedCategory;
      });
    }
    return filtered
      .sort((a, b) => {
        const aTime = a.userProgress?.lastViewedAt || '';
        const bTime = b.userProgress?.lastViewedAt || '';
        return bTime.localeCompare(aTime);
      })
      .slice(0, 10)
      .map(convertToFeatureEducationMaterial);
  };

  const recommendedMaterials = getDisplayMaterials();
  const recentMaterials = getFilteredRecentMaterials();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // 검색어가 변경되면 필터링된 결과를 다시 로드
    if (query.trim()) {
      loadMaterials({ searchQuery: query });
    } else {
      loadMaterials();
    }
  };

  const handleStartLearning = (material: EducationMaterial) => {
    // 학습 시작 로직 구현 - handleMaterialClick과 동일
    handleMaterialClick(material);
  };

  const handleCategoryClick = (category: EducationCategory) => {
    // 카테고리 기반 필터링
    const categoryName = category.label;
    if (selectedCategory === categoryName) {
      // 이미 선택된 카테고리를 다시 클릭하면 필터 해제
      setSelectedCategory(null);
      console.log('카테고리 필터 해제');
    } else {
      setSelectedCategory(categoryName);
      console.log('카테고리 선택:', categoryName);
      // 해당 카테고리를 가진 자료들 확인
      const materialsWithCategory = allMaterials.filter((m) => {
        const materialCategory = (m as any).category_name || m.category;
        return materialCategory === categoryName;
      });
      console.log(
        `"${categoryName}" 카테고리를 가진 자료 수:`,
        materialsWithCategory.length
      );
      console.log(
        '해당 자료들:',
        materialsWithCategory.map((m) => ({
          title: m.title,
          category: (m as any).category_name || m.category,
        }))
      );
    }
  };

  const handleMaterialClick = (material: EducationMaterial) => {
    // 비디오인 경우 유튜브 플레이어 표시
    if (material.type === 'video' && material.contentUrl) {
      const videoId = extractYouTubeVideoId(material.contentUrl);
      if (videoId) {
        setSelectedVideoId(videoId);
        // 플레이어 영역으로 스크롤
        setTimeout(() => {
          document.getElementById('video-player')?.scrollIntoView({
            behavior: 'smooth',
          });
        }, 100);
      } else {
        // 유튜브 ID 추출 실패 시 새 창으로 열기
        window.open(material.contentUrl, '_blank');
      }
    }
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
          <p className="text-sm text-gray-600 text-center">
            교육자료를 불러오는 중...
          </p>
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
        selectedCategoryId={
          selectedCategory ? `category-${selectedCategory}` : null
        }
        onCategoryClick={handleCategoryClick}
      />

      <EducationTabs
        recommendedMaterials={recommendedMaterials}
        recentMaterials={recentMaterials}
        onMaterialClick={handleMaterialClick}
      />

      {/* 유튜브 비디오 플레이어 */}
      {selectedVideoId && (
        <div
          id="video-player"
          className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">동영상 학습</h3>
            <button
              onClick={() => setSelectedVideoId(null)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold">
              ×
            </button>
          </div>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
