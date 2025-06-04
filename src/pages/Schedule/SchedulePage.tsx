import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSchedule, useTodoList } from '@/features/schedule/hooks';
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

  const {
    todoItems,
    toggleTodo,
    completedTasks,
    totalTasks,
    progressPercentage,
  } = useTodoList(todayShift?.todoList || []);

  const calendarDays = generateCalendarDays;

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">근무 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">오류: {error}</div>
        </div>
      </div>
    );
  }

  // todayShift가 아직 로드되지 않았을 때
  if (!todayShift) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">근무 정보를 준비 중...</div>
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

          {/* 오늘의 할 일 */}
          <TodoList
            todos={todoItems}
            onToggleTodo={toggleTodo}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            progressPercentage={progressPercentage}
          />

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
