import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface UnifiedTodoItemProps {
  id: string;
  task: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  showTime?: boolean;
  time?: string;
  onToggle: (id: string) => void;
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
  onToggle
}: UnifiedTodoItemProps) {
  const styles = getPriorityStyles(priority);

  return (
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
    </div>
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