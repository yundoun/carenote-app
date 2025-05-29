import { useState } from 'react';
import { TodoItem } from '../types/schedule.types';

export const useTodoList = (initialTodos: TodoItem[]) => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>(initialTodos);

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
