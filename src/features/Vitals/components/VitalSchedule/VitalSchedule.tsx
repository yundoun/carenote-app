import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Senior } from '../../types/vitals.types';

interface VitalScheduleProps {
  seniors: Senior[];
}

export const VitalSchedule = ({ seniors }: VitalScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          오늘의 바이탈 측정 일정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {seniors.map((senior, index) => (
            <div
              key={senior.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {senior.name} ({senior.room}호)
                </p>
                <p className="text-sm text-gray-500">
                  다음 측정 예정:{' '}
                  {new Date(
                    Date.now() + (index + 1) * 2 * 60 * 60 * 1000
                  ).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Badge variant="outline">예정</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
