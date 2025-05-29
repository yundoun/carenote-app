import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TodayProgress } from '../types/home.types';

interface TodayProgressCardProps {
  progress: TodayProgress;
}

export function TodayProgressCard({ progress }: TodayProgressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          오늘 업무 완료 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">진행률</span>
            <span className="text-sm font-semibold">
              {progress.completed}/{progress.total} 완료
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <p className="text-xs text-gray-500 text-center">
            {progress.percentage}% 완료
          </p>
        </div>
      </CardContent>
    </Card>
  );
}