import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalendarDay } from '../../types/schedule.types';

interface WeekViewProps {
  currentDate: Date;
  calendarDays: CalendarDay[];
  isFullscreen: boolean;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onToggleFullscreen: () => void;
}

export const WeekView = ({
  currentDate,
  calendarDays,
  isFullscreen,
  onNavigateWeek,
  onToggleFullscreen,
}: WeekViewProps) => {
  const getWeekRange = () => {
    const startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + 6
    );

    return {
      start: startOfWeek.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
      }),
      end: endOfWeek.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
      }),
    };
  };

  const weekRange = getWeekRange();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigateWeek('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">
          {weekRange.start} - {weekRange.end}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={`grid grid-cols-7 gap-2 ${
          isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''
        }`}>
        {isFullscreen && (
          <div className="col-span-7 flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">주간 스케줄</h2>
            <Button variant="outline" onClick={onToggleFullscreen}>
              닫기
            </Button>
          </div>
        )}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-4 rounded-lg ${
              day.isToday ? 'bg-primary/10 border border-primary' : 'bg-gray-50'
            } ${isFullscreen ? 'h-32' : 'h-24'}`}>
            <span className="text-sm font-medium">
              {day.date.toLocaleDateString('ko-KR', { weekday: 'short' })}
            </span>
            <span
              className={`text-xl font-bold ${
                day.isToday ? 'text-primary' : ''
              }`}>
              {day.date.getDate()}
            </span>
            {day.hasShift ? (
              <div className="mt-2 text-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    day.shiftType === '주간'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                  {day.shiftType}
                </span>
                {isFullscreen && (
                  <div className="mt-1 text-xs text-gray-500">
                    <p>3층 A유닛</p>
                    <p>09:00-18:00</p>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs mt-2 px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                휴무
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
