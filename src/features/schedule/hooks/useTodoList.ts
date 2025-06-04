import { useState, useEffect, useMemo } from 'react';
import { TodoItem } from '../types/schedule.types';

export const useTodoList = (initialTodos: TodoItem[] | undefined | null) => {
  // initialTodos를 안정적인 값으로 memoize
  const stableTodos = useMemo(() => initialTodos || [], [initialTodos]);

  const [todoItems, setTodoItems] = useState<TodoItem[]>(stableTodos);

  // stableTodos가 실제로 변경되었을 때만 업데이트
  useEffect(() => {
    // 현재 todoItems와 새로운 stableTodos를 비교하여 실제 변경이 있을 때만 업데이트
    const hasChanged =
      JSON.stringify(todoItems) !== JSON.stringify(stableTodos);
    if (hasChanged) {
      setTodoItems(stableTodos);
    }
  }, [stableTodos]); // todoItems는 의존성에서 제거

  const toggleTodo = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedTasks = todoItems.filter((item) => item.completed).length;
  const totalTasks = todoItems.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    todoItems,
    toggleTodo,
    completedTasks,
    totalTasks,
    progressPercentage,
  };
};
