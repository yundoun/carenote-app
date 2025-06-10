import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { useSchedule } from '@/features/schedule/hooks';
import { useAppSelector } from '@/store';
import {
  TodayShiftOverview,
  HandoverNotes,
  TodoList,
  AssignedSeniors,
  WeekView,
  MonthView,
} from '@/features/schedule/components';
import type { ScheduleView } from '@/features/schedule/types/schedule.types';

export function SchedulePage() {
  const [activeView, setActiveView] = useState<ScheduleView>('today');

  const {
    currentDate,
    isFullscreen,
    isLoading,
    error,
    todayShift,
    generateCalendarDays,
    navigateWeek,
    toggleFullscreen,
  } = useSchedule();

  // Redux store에서 직접 todoList 사용
  const { todoList } = useAppSelector((state) => state.schedule);

  const calendarDays = generateCalendarDays;

  // 로딩 중이거나 데이터가 없을 때
  if (isLoading || !todayShift) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">
            근무 정보를 불러오는 중...
          </p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">오류가 발생했습니다</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">근무표</h1>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </span>
      </div>

      <Tabs
        defaultValue="today"
        className="w-full"
        onValueChange={(value) => setActiveView(value as ScheduleView)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="today">오늘 근무</TabsTrigger>
          <TabsTrigger value="week">주간 스케줄</TabsTrigger>
          <TabsTrigger value="month">월간 스케줄</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-0 space-y-6">
          {/* 오늘의 근무 개요 */}
          <TodayShiftOverview shift={todayShift} />

          {/* 인수인계 사항 */}
          <HandoverNotes notes={todayShift.handoverNotes || []} />

          {/* 오늘의 할 일 - Redux store의 todoList 직접 사용 */}
          <TodoList />

          {/* 담당 어르신 요약 */}
          <AssignedSeniors seniors={todayShift.assignedSeniors || []} />
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <WeekView
            currentDate={new Date(currentDate)}
            calendarDays={calendarDays}
            isFullscreen={isFullscreen}
            onNavigateWeek={navigateWeek}
            onToggleFullscreen={toggleFullscreen}
          />
        </TabsContent>

        <TabsContent value="month">
          <MonthView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
