import { useAppSelector, useAppDispatch } from '@/store';
import { 
  addTodoItem, 
  toggleTodoItem, 
  updateTodoItem, 
  removeTodoItem,
  addHandoverNote,
  setSelectedDate,
  TodoItem,
  HandoverNote
} from '@/store/slices/scheduleSlice';
import { useCallback } from 'react';

export function useSchedule() {
  const dispatch = useAppDispatch();
  const schedule = useAppSelector((state) => state.schedule);
  
  // Todo 관련 액션들
  const addTodo = useCallback((todo: Omit<TodoItem, 'id'>) => {
    dispatch(addTodoItem(todo));
  }, [dispatch]);
  
  const toggleTodo = useCallback((id: string) => {
    dispatch(toggleTodoItem(id));
  }, [dispatch]);
  
  const updateTodo = useCallback((id: string, updates: Partial<TodoItem>) => {
    dispatch(updateTodoItem({ id, updates }));
  }, [dispatch]);
  
  const removeTodo = useCallback((id: string) => {
    dispatch(removeTodoItem(id));
  }, [dispatch]);
  
  // 인수인계 노트 추가
  const addNote = useCallback((note: Omit<HandoverNote, 'id' | 'timestamp'>) => {
    dispatch(addHandoverNote(note));
  }, [dispatch]);
  
  // 날짜 선택
  const selectDate = useCallback((date: string) => {
    dispatch(setSelectedDate(date));
  }, [dispatch]);
  
  // 계산된 값들
  const completedTodos = schedule.todoList.filter(todo => todo.completed);
  const pendingTodos = schedule.todoList.filter(todo => !todo.completed);
  const completionRate = schedule.todoList.length > 0 
    ? Math.round((completedTodos.length / schedule.todoList.length) * 100) 
    : 0;
  
  const urgentNotes = schedule.handoverNotes.filter(note => note.priority === 'urgent');
  
  return {
    // 상태
    ...schedule,
    
    // 계산된 값들
    completedTodos,
    pendingTodos,
    completionRate,
    urgentNotes,
    
    // 액션들
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    addNote,
    selectDate,
  };
}