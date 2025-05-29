import { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, Star } from 'lucide-react';
import { EducationMaterial, EducationCategory } from '../types/education.types';

export function useEducation() {
  const [recommendedMaterials, setRecommendedMaterials] = useState<
    EducationMaterial[]
  >([]);
  const [recentMaterials, setRecentMaterials] = useState<EducationMaterial[]>(
    []
  );

  const categories: EducationCategory[] = [
    {
      id: 'main',
      label: '주요업무',
      icon: <Award className="h-5 w-5" />,
      count: 12,
    },
    {
      id: 'care',
      label: '케어기술',
      icon: <BookOpen className="h-5 w-5" />,
      count: 8,
    },
    {
      id: 'record',
      label: '기록입력',
      icon: <Clock className="h-5 w-5" />,
      count: 6,
    },
    {
      id: 'emergency',
      label: '응급처치',
      icon: <Star className="h-5 w-5" />,
      count: 4,
    },
  ];

  useEffect(() => {
    const loadMockData = () => {
      // Mock data for recommended education materials
      setRecommendedMaterials([
        {
          id: '1',
          title: '안전한 이동 돕기 - 낙상 예방법',
          type: 'video',
          duration: '5분',
          category: '케어기술',
          thumbnail: '/placeholder.svg?height=120&width=200',
          difficulty: 'beginner',
          rating: 4.8,
          description:
            '어르신의 안전한 이동을 위한 기본 기술과 낙상 예방 방법을 학습합니다.',
          relatedToWork: true,
        },
        {
          id: '2',
          title: '치매 환자와의 효과적인 소통법',
          type: 'video',
          duration: '8분',
          category: '주요업무',
          thumbnail: '/placeholder.svg?height=120&width=200',
          difficulty: 'intermediate',
          rating: 4.9,
          description:
            '치매 환자와의 대화 시 주의사항과 효과적인 소통 기법을 배웁니다.',
          relatedToWork: true,
        },
        {
          id: '3',
          title: '투약 관리 및 기록 작성법',
          type: 'document',
          duration: '10분',
          category: '기록입력',
          thumbnail: '/placeholder.svg?height=120&width=200',
          difficulty: 'intermediate',
          rating: 4.7,
          description:
            '정확한 투약 관리와 체계적인 기록 작성 방법을 학습합니다.',
          relatedToWork: true,
        },
        {
          id: '4',
          title: '응급상황 대처법 - 심폐소생술',
          type: 'video',
          duration: '15분',
          category: '응급처치',
          thumbnail: '/placeholder.svg?height=120&width=200',
          difficulty: 'advanced',
          rating: 4.9,
          description: '응급상황 발생 시 신속하고 정확한 대처 방법을 익힙니다.',
          relatedToWork: true,
        },
      ]);

      // Mock data for recent materials
      setRecentMaterials([
        {
          id: '5',
          title: '낙상 예방을 위한 환경 점검',
          type: 'document',
          duration: '7분',
          category: '케어기술',
          thumbnail: '/placeholder.svg?height=120&width=200',
          progress: 80,
          difficulty: 'beginner',
          rating: 4.6,
          description:
            '낙상 위험 요소를 사전에 파악하고 예방하는 방법을 학습합니다.',
        },
        {
          id: '6',
          title: '혈압 측정 및 기록 방법',
          type: 'video',
          duration: '12분',
          category: '주요업무',
          thumbnail: '/placeholder.svg?height=120&width=200',
          progress: 45,
          difficulty: 'beginner',
          rating: 4.5,
          description: '정확한 혈압 측정 방법과 기록 작성법을 배웁니다.',
        },
      ]);
    };

    loadMockData();
  }, []);

  return {
    recommendedMaterials,
    recentMaterials,
    categories,
  };
}
