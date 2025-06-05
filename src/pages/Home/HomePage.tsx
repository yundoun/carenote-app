import {
  UserProfileCard,
  UrgentAnnouncementAlert,
  TodaySchedule,
  TodayProgressCard,
  QuickAccessGrid,
  useHomeData,
} from '@/features/home';
import { useAppSelector } from '@/store';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const { 
    homeData, 
    quickAccessItems, 
    welcomeData, 
    todayProgress, 
    todaySchedule, 
    urgentAlerts, 
    markAlertRead, 
    updateTask,
    isLoading
  } = useHomeData();
  const { user } = useAppSelector((state) => state.auth);

  // 로딩 중일 때 프로그래스바 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">홈 데이터를 불러오는 중...</p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 모바일 레이아웃 */}
      <div className="md:hidden space-y-6">
        <UserProfileCard 
          name={user?.name || '사용자'} 
          role={user?.role || '직원'} 
          floor={user?.floor || ''} 
          welcomeData={welcomeData}
        />
        <UrgentAnnouncementAlert 
          announcements={homeData.urgentAnnouncements} 
          urgentAlerts={urgentAlerts}
          markAlertRead={markAlertRead}
        />
        <TodaySchedule 
          scheduleItems={homeData.todaySchedule} 
          todaySchedule={todaySchedule}
          updateTask={updateTask}
        />
        <TodayProgressCard 
          progress={homeData.todayProgress} 
          todayProgress={todayProgress}
        />
        <QuickAccessGrid items={quickAccessItems} />
      </div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">
        <div className="space-y-6">
          {/* 프로필 카드 - 전체 너비 */}
          <UserProfileCard 
            name={user?.name || '사용자'} 
            role={user?.role || '직원'} 
            floor={user?.floor || ''} 
            welcomeData={welcomeData}
          />

          {/* 긴급 공지 (있을 경우만) */}
          <UrgentAnnouncementAlert
            announcements={homeData.urgentAnnouncements}
            urgentAlerts={urgentAlerts}
            markAlertRead={markAlertRead}
          />

          {/* 메인 콘텐츠 영역 - 3열 그리드 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 왼쪽 열 */}
            <div className="lg:col-span-2 space-y-6">
              <TodaySchedule 
                scheduleItems={homeData.todaySchedule} 
                todaySchedule={todaySchedule}
                updateTask={updateTask}
              />
              <TodayProgressCard 
                progress={homeData.todayProgress} 
                todayProgress={todayProgress}
              />
            </div>

            {/* 오른쪽 열 */}
            <div className="lg:col-span-1 space-y-6">
              <QuickAccessGrid items={quickAccessItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
