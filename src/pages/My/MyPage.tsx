import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  ProfileCard,
  TodayProgress,
  WeeklyGoal,
  WorkStatistics,
  EducationProgress,
  useMyPageData,
} from '@/features/my';

export function MyPage() {
  const { userProfile, workStats, isLoading } = useMyPageData();

  const handleEditProfile = () => {
    // 프로필 편집 로직 구현
    console.log('프로필 편집');
  };

  const handleContinueEducation = () => {
    // 교육 계속하기 로직 구현
    console.log('교육 계속하기');
  };

  if (isLoading || !userProfile || !workStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">마이페이지를 불러오는 중...</p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </span>
      </div>

      <ProfileCard
        userProfile={userProfile}
        onEditProfile={handleEditProfile}
      />

      <TodayProgress workStats={workStats} />

      <WeeklyGoal workStats={workStats} />

      <WorkStatistics workStats={workStats} />

      <EducationProgress
        workStats={workStats}
        onContinueEducation={handleContinueEducation}
      />
    </div>
  );
}
