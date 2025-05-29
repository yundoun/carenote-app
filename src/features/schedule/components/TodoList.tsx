import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import type { TodoItem } from '../../types/schedule.types';

interface TodoListProps {
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
}

export const TodoList = ({
  todos,
  onToggleTodo,
  completedTasks,
  totalTasks,
  progressPercentage,
}: TodoListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                todo.completed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-200'
              }`}>
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggleTodo(todo.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p
                  className={`${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}>
                  {todo.task}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(todo.priority)}`}>
                    {todo.priority === 'high'
                      ? '높음'
                      : todo.priority === 'medium'
                      ? '보통'
                      : '낮음'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    예상 시간: {todo.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
