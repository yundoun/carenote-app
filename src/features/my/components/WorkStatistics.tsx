import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WorkStats } from '../../types/my.types';

interface WorkStatisticsProps {
  workStats: WorkStats;
}

export function WorkStatistics({ workStats }: WorkStatisticsProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">근무 통계</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">{workStats.totalShifts}</span>
            <span className="text-sm text-gray-500">총 근무일</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">{workStats.thisMonth}</span>
            <span className="text-sm text-gray-500">이번 달 근무일</span>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
