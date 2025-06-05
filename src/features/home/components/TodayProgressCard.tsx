import { CheckCircle2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/store';
import { ROUTES } from '@/routes/routes';
import type { TodayProgress } from '../types/home.types';

interface TodayProgressCardProps {
  progress: TodayProgress;
  todayProgress?: any;
}

export function TodayProgressCard({ progress, todayProgress }: TodayProgressCardProps) {
  const navigate = useNavigate();
  const { todoList } = useAppSelector((state) => state.schedule);

  // Redux store에서 실시간 진행률 계산
  const completedTasks = todoList.filter((todo) => todo.completed).length;
  const totalTasks = todoList.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleClick = () => {
    navigate(ROUTES.MYPAGE);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          오늘 업무 완료 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">업무 진행률</span>
            <span className="text-sm font-semibold">
              {completedTasks}/{totalTasks} 완료
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2" 
          />
          <p className="text-xs text-gray-500 text-center">
            {progressPercentage}% 완료
          </p>
          
          {todayProgress?.vitalCheckStatus && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">바이탈 체크 현황</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-gray-600">오전</div>
                  <div className="font-semibold">{todayProgress.vitalCheckStatus.morning}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">오후</div>
                  <div className="font-semibold">{todayProgress.vitalCheckStatus.afternoon}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">저녁</div>
                  <div className="font-semibold">{todayProgress.vitalCheckStatus.evening}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                총 {todayProgress.vitalCheckStatus.totalCompleted}/
                {todayProgress.vitalCheckStatus.totalRequired} 완료
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
