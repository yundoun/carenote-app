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
    <div className="p-4 space-y-6">
      {/* 간소화된 사용자 프로필 카드 */}
      <UserProfileCard name="김요양" role="요양보호사" floor="3층" />

      {/* 긴급 공지 알림 */}
      <UrgentAnnouncementAlert announcements={homeData.urgentAnnouncements} />

      {/* 오늘의 주요 일정 */}
      <TodaySchedule scheduleItems={homeData.todaySchedule} />

      {/* 오늘 업무 완료 현황 */}
      <TodayProgressCard progress={homeData.todayProgress} />

      {/* 빠른 접근 그리드 */}
      <QuickAccessGrid items={quickAccessItems} />
    </div>
  );
}
