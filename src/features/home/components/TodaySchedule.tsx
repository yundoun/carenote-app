import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/routes';
import type { ScheduleItem } from '../types/home.types';

interface TodayScheduleProps {
  scheduleItems: ScheduleItem[];
}

export function TodaySchedule({ scheduleItems }: TodayScheduleProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          오늘의 주요 일정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-blue-600">{item.time}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
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