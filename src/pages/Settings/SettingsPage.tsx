import { useState } from 'react';
import { SettingsMenu, useMyPageData, MenuItem } from '@/features/my';

export function SettingsPage() {
  const { menuItems, isLoading } = useMyPageData();

  const handleMenuClick = (item: MenuItem) => {
    // 메뉴 클릭 로직 구현
    console.log('메뉴 클릭:', item.label);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">설정</h1>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </span>
      </div>

      <SettingsMenu menuItems={menuItems} onMenuClick={handleMenuClick} />
    </div>
  );
}
