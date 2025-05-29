import {
  UserProfileCard,
  UrgentAnnouncementAlert,
  TodaySchedule,
  TodayProgressCard,
  QuickAccessGrid,
  useHomeData,
} from '@/features/home';

export function HomePage() {
  const { homeData, quickAccessItems } = useHomeData();

  return (
    <div className="space-y-6">
      {/* 모바일 레이아웃 */}
      <div className="md:hidden space-y-6">
        <UserProfileCard name="김요양" role="요양보호사" floor="3층" />
        <UrgentAnnouncementAlert announcements={homeData.urgentAnnouncements} />
        <TodaySchedule scheduleItems={homeData.todaySchedule} />
        <TodayProgressCard progress={homeData.todayProgress} />
        <QuickAccessGrid items={quickAccessItems} />
      </div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">
        <div className="space-y-6">
          {/* 프로필 카드 - 전체 너비 */}
          <UserProfileCard name="김요양" role="요양보호사" floor="3층" />

          {/* 긴급 공지 (있을 경우만) */}
          <UrgentAnnouncementAlert
            announcements={homeData.urgentAnnouncements}
          />

          {/* 메인 콘텐츠 영역 - 3열 그리드 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 왼쪽 열 */}
            <div className="lg:col-span-2 space-y-6">
              <TodaySchedule scheduleItems={homeData.todaySchedule} />
              <TodayProgressCard progress={homeData.todayProgress} />
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
