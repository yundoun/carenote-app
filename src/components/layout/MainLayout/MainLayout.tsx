import type React from 'react';
import { Header } from '../Header';
import { Navigation } from '../Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // TODO: 실제로는 사용자 정보를 Redux store나 context에서 가져와야 함
  const staffInfo = {
    name: '김간호',
    role: '요양보호사',
    floor: '3층',
    notificationCount: 2,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        staffName={staffInfo.name}
        staffRole={staffInfo.role}
        floor={staffInfo.floor}
        notificationCount={staffInfo.notificationCount}
      />
      <main className="flex-1 pb-20">{children}</main>
      <Navigation />
    </div>
  );
}
