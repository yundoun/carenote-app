import type React from 'react';
import { Header } from '../Header';
import { Navigation } from '../Navigation';
import { SideNavigation } from '../SideNavigation';
import { useBottomNavigation } from '@/hooks/useBottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { shouldShowBottomNav } = useBottomNavigation();
  
  // TODO: 실제로는 사용자 정보를 Redux store나 context에서 가져와야 함
  const staffInfo = {
    name: '김간호',
    role: '요양보호사',
    floor: '3층',
    notificationCount: 2,
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
