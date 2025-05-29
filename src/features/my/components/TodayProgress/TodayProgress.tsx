import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WorkStats } from '../../types/my.types';

interface TodayProgressProps {
  workStats: WorkStats;
}

export function TodayProgress({ workStats }: TodayProgressProps) {
  const todayCompletionRate =
    (workStats.todayTasksCompleted / workStats.todayTasksTotal) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            오늘 업무 완료 현황
          </div>
          <span className="text-sm text-gray-500">
            {workStats.todayTasksCompleted}/{workStats.todayTasksTotal}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={todayCompletionRate} className="h-3 mb-2" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {workStats.todayTasksCompleted}개 완료
          </span>
          <span className="font-medium">
            {Math.round(todayCompletionRate)}%
          </span>
        </div>
        {todayCompletionRate === 100 ? (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              🎉 오늘 모든 업무를 완료했습니다!
            </p>
          </div>
        ) : (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              남은 업무:{' '}
              {workStats.todayTasksTotal - workStats.todayTasksCompleted}개
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
