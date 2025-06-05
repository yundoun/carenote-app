import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/routes/routes';
import { useHomeData } from '../hooks/useHomeData';
import type { ScheduleItem } from '../types/home.types';

interface TodayScheduleProps {
  scheduleItems: ScheduleItem[];
}

export function TodaySchedule({ scheduleItems }: TodayScheduleProps) {
  const navigate = useNavigate();
  const { todaySchedule, updateTask } = useHomeData();

  // API 데이터가 있으면 우선 사용, 없으면 props 사용
  const itemsToShow = todaySchedule.length > 0 ? todaySchedule : scheduleItems;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Users className="h-4 w-4" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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

  const handleTaskComplete = (taskId: string) => {
    updateTask(taskId, true);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          오늘의 주요 일정
          {itemsToShow.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {itemsToShow.length}건
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {itemsToShow.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">등록된 일정이 없습니다</p>
            </div>
          ) : (
            itemsToShow.map((item, index) => {
              const isApiItem = item.id && item.type;
              return (
                <div key={item.id || index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-xs font-semibold text-blue-600 min-w-[45px] text-center">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isApiItem && item.type && getTypeIcon(item.type)}
                      <p className="text-sm font-medium">{item.title}</p>
                      {isApiItem && item.priority && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority === 'high' ? '긴급' : 
                           item.priority === 'medium' ? '보통' : '낮음'}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500">{item.description}</p>
                    )}
                  </div>
                  {isApiItem && item.type === 'task' && item.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleTaskComplete(item.id!)}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                </div>
              );
            })
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