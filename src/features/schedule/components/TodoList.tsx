import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedTodoItem, PriorityLegend } from '@/components/ui/unified-todo-item';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTodoItem } from '@/store/slices/scheduleSlice';

interface TodoListProps {
  // Props는 호환성을 위해 유지하지만 실제로는 Redux store 사용
}

export const TodoList = (props: TodoListProps) => {
  const dispatch = useAppDispatch();
  const { todoList } = useAppSelector((state) => state.schedule);

  // Redux store에서 진행률 계산
  const completedTasks = todoList.filter((todo) => todo.completed).length;
  const totalTasks = todoList.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTodoToggle = (todoId: string) => {
    dispatch(toggleTodoItem(todoId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            오늘의 할 일
          </div>
          <span className="text-sm text-gray-500">
            {completedTasks}/{totalTasks} 완료
          </span>
        </CardTitle>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todoList.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">등록된 할 일이 없습니다</p>
            </div>
          ) : (
            <>
              <PriorityLegend />
              <div className="space-y-2">
                {todoList.map((todo) => (
                  <UnifiedTodoItem
                    key={todo.id}
                    id={todo.id}
                    task={todo.title}
                    completed={todo.completed}
                    priority={todo.priority}
                    estimatedTime="30분" // 기본값, 추후 API에서 제공
                    onToggle={handleTodoToggle}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
