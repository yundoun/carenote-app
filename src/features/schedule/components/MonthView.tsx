import { Calendar } from 'lucide-react';

export const MonthView = () => {
  return (
    <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center">
        <Calendar className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500">월간 스케줄 보기는 개발 중입니다.</p>
        <p className="text-sm text-gray-400 mt-1">곧 업데이트 예정입니다.</p>
      </div>
    </div>
  );
};
