import { Activity } from 'lucide-react';

export const VitalHistory = () => {
  return (
    <div className="text-center py-8">
      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">측정 기록</h3>
      <p className="text-gray-500">최근 측정 기록을 확인할 수 있습니다.</p>
      <p className="text-sm text-gray-400 mt-1">상세 기록은 개발 중입니다.</p>
    </div>
  );
};
