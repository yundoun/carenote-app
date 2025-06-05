import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedTodoItem, PriorityLegend } from '@/components/ui/unified-todo-item';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTodoItem } from '@/store/slices/scheduleSlice';
import { ROUTES } from '@/routes/routes';
import type { ScheduleItem } from '../types/home.types';

interface TodayScheduleProps {
  scheduleItems: ScheduleItem[];
  todaySchedule?: any[];
  updateTask?: (taskId: string, completed: boolean) => void;
}

export function TodaySchedule({ scheduleItems, todaySchedule = [], updateTask }: TodayScheduleProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { todoList } = useAppSelector((state) => state.schedule);

  // Redux store의 할 일 목록 사용
  const todosToShow = todoList;

  const handleTodoToggle = (todoId: string) => {
    dispatch(toggleTodoItem(todoId));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          오늘의 주요 일정
          {todosToShow.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {todosToShow.length}건
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todosToShow.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">등록된 할 일이 없습니다</p>
            </div>
          ) : (
            <>
              <PriorityLegend />
              <div className="space-y-2">
                {todosToShow.map((todo) => (
                  <UnifiedTodoItem
                    key={todo.id}
                    id={todo.id}
                    task={todo.title}
                    completed={todo.completed}
                    priority={todo.priority}
                    estimatedTime="30분" // 기본값, 추후 API에서 제공
                    showTime={true}
                    time={todo.dueTime}
                    onToggle={handleTodoToggle}
                  />
                ))}
              </div>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={() => navigate(ROUTES.SCHEDULE)}
          >
            전체 일정 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}