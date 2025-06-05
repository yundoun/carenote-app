import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SettingsMenu, useMyPageData, MenuItem } from '@/features/my';

export function SettingsPage() {
  const { menuItems, isLoading } = useMyPageData();

  const handleMenuClick = (item: MenuItem) => {
    // 메뉴 클릭 로직 구현
    console.log('메뉴 클릭:', item.label);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">설정을 불러오는 중...</p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
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
