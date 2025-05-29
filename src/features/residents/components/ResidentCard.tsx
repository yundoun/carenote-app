import { AlertTriangle, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResidentDetail } from '../../types/residents.types';

interface ResidentCardProps {
  resident: ResidentDetail;
  onDetailClick: () => void;
  showTodaySchedule?: boolean;
}

export function ResidentCard({
  resident,
  onDetailClick,
  showTodaySchedule = false,
}: ResidentCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onDetailClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-muted rounded-full p-3 text-2xl">
            {resident.gender === 'male' ? '👨‍🦳' : '👩‍🦳'}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">
                  {resident.name} ({resident.age}세/
                  {resident.gender === 'male' ? '남' : '여'})
                </h3>
                <p className="text-muted-foreground">
                  {resident.room}호 | {resident.careLevel} |{' '}
                  {resident.conditions.join(', ')}
                </p>
              </div>
              {resident.vitalSigns && (
                <div className="text-right text-xs text-gray-500">
                  <p>혈압: {resident.vitalSigns.bloodPressure}</p>
                  <p>체온: {resident.vitalSigns.temperature}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {resident.warnings?.map((warning, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {warning}
                </Badge>
              ))}

              {resident.medications?.map((medication, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <Pill className="h-3 w-3" />
                  {medication}
                </Badge>
              ))}
            </div>

            {showTodaySchedule && resident.todaySchedule.length > 0 && (
              <div className="mt-3 p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium mb-1">오늘 일정:</p>
                <ul className="text-sm text-gray-600">
                  {resident.todaySchedule.map((schedule, index) => (
                    <li key={index}>• {schedule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
