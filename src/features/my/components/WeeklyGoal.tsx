import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WorkStats } from '../../types/my.types';

interface WeeklyGoalProps {
  workStats: WorkStats;
}

export function WeeklyGoal({ workStats }: WeeklyGoalProps) {
  const weeklyCompletionRate =
    (workStats.weeklyCompleted / workStats.weeklyGoal) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          이번 주 목표 달성
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">주간 업무 목표</span>
          <span className="text-sm font-medium">
            {workStats.weeklyCompleted}/{workStats.weeklyGoal}
          </span>
        </div>
        <Progress value={weeklyCompletionRate} className="h-3 mb-2" />
        <p className="text-xs text-gray-500">
          목표까지 {workStats.weeklyGoal - workStats.weeklyCompleted}개 남음
        </p>
      </CardContent>
    </Card>
  );
}
