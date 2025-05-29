import { useState } from 'react';
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
    return <div className="container mx-auto p-4">로딩 중...</div>;
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
