import type React from 'react';
import { Header } from '../Header';
import { Navigation } from '../Navigation';
import { SideNavigation } from '../SideNavigation';
import { useBottomNavigation } from '@/hooks/useBottomNavigation';
import { useAppSelector } from '@/store';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { shouldShowBottomNav } = useBottomNavigation();
  const { user } = useAppSelector((state) => state.auth);
  
  // 기본값 설정
  const staffInfo = {
    name: user?.name || '사용자',
    role: user?.role || '직원',
    floor: user?.floor || '',
    notificationCount: 2, // TODO: 실제 알림 카운트로 교체
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavigation />
      <div className="flex flex-col flex-1 md:ml-64 lg:ml-72">
        <Header
          staffName={staffInfo.name}
          staffRole={staffInfo.role}
          floor={staffInfo.floor}
          notificationCount={staffInfo.notificationCount}
        />
        <main className="flex-1 w-full max-w-md mx-auto md:max-w-full md:mx-0">
          <div className={`p-4 md:p-6 md:pb-6 ${shouldShowBottomNav ? 'pb-28' : 'pb-6'}`}>
            {children}
          </div>
        </main>
        <Navigation />
      </div>
    </div>
  );
}
