import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Clock, User, AlertCircle } from 'lucide-react';

interface TodoItemData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueTime?: string;
  category: string;
}

interface UnifiedTodoItemProps {
  id: string;
  task: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  showTime?: boolean;
  time?: string;
  onToggle: (id: string) => void;
  todoData?: TodoItemData; // 상세 정보용 전체 데이터
}

// 우선순위별 색상 체계
const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return {
        backgroundColor: 'bg-red-50',
        borderColor: 'border-red-200',
        accentColor: 'border-l-red-500',
        textColor: 'text-red-900'
      };
    case 'medium':
      return {
        backgroundColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        accentColor: 'border-l-yellow-500',
        textColor: 'text-yellow-900'
      };
    case 'low':
      return {
        backgroundColor: 'bg-green-50',
        borderColor: 'border-green-200',
        accentColor: 'border-l-green-500',
        textColor: 'text-green-900'
      };
    default:
      return {
        backgroundColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        accentColor: 'border-l-gray-500',
        textColor: 'text-gray-900'
      };
  }
};

export function UnifiedTodoItem({
  id,
  task,
  completed,
  priority,
  estimatedTime,
  showTime = false,
  time,
  onToggle,
  todoData
}: UnifiedTodoItemProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const styles = getPriorityStyles(priority);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '보통';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'medicine': return '투약';
      case 'vital': return '바이탈';
      case 'meal': return '식사';
      case 'care': return '케어';
      case 'other': return '기타';
      default: return category;
    }
  };

  return (
    <>
      <div
        className={`flex items-start gap-3 p-3 rounded-lg border-l-4 border ${
          completed
            ? 'bg-gray-50 border-gray-200 border-l-gray-300'
            : `${styles.backgroundColor} ${styles.borderColor} ${styles.accentColor}`
        } transition-colors`}
      >
        <Checkbox
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className="mt-1"
        />
        
        {showTime && time && (
          <div className="text-xs font-semibold text-blue-600 min-w-[45px] text-center mt-1">
            {time}
          </div>
        )}
        
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${
              completed 
                ? 'line-through text-gray-500' 
                : styles.textColor
            }`}
          >
            {task}
          </p>
          
          {estimatedTime && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">
                예상 시간: {estimatedTime}
              </span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsDetailOpen(true)}
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* 상세 정보 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              할 일 상세 정보
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">기본 정보</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">제목:</span>
                  <span className="text-sm font-medium">{todoData?.title || task}</span>
                </div>
                
                {todoData?.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">설명:</span>
                    <span className="text-sm text-right max-w-48">{todoData.description}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">카테고리:</span>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(todoData?.category || 'other')}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">우선순위:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      priority === 'high' ? 'border-red-300 text-red-700 bg-red-50' :
                      priority === 'medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                      'border-green-300 text-green-700 bg-green-50'
                    }`}
                  >
                    {getPriorityLabel(priority)}
                  </Badge>
                </div>
                
                {time && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">예정 시간:</span>
                    <span className="text-sm font-medium">{time}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">완료 상태:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      completed 
                        ? 'border-green-300 text-green-700 bg-green-50' 
                        : 'border-gray-300 text-gray-700 bg-gray-50'
                    }`}
                  >
                    {completed ? '완료' : '미완료'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// 우선순위 범례 컴포넌트
export function PriorityLegend() {
  const priorities = [
    { key: 'high', label: '높음', color: 'border-l-red-500 bg-red-50' },
    { key: 'medium', label: '보통', color: 'border-l-yellow-500 bg-yellow-50' },
    { key: 'low', label: '낮음', color: 'border-l-green-500 bg-green-50' }
  ];

  return (
    <div className="flex items-center gap-4 text-xs text-gray-600 p-2 bg-gray-50 rounded-lg">
      <span className="font-medium">우선순위:</span>
      {priorities.map((priority) => (
        <div key={priority.key} className="flex items-center gap-1">
          <div className={`w-3 h-3 border-l-2 ${priority.color} rounded-sm`} />
          <span>{priority.label}</span>
        </div>
      ))}
    </div>
  );
}