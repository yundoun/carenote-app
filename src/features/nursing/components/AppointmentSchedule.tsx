import { Calendar, Users, Car, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppointmentRecord } from '../types/nursing.types';

interface AppointmentScheduleProps {
  records: AppointmentRecord[];
}

export function AppointmentSchedule({ records }: AppointmentScheduleProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Calendar className="h-4 w-4" />;
      case 'visit':
        return <Users className="h-4 w-4" />;
      case 'outing':
        return <Car className="h-4 w-4" />;
      case 'therapy':
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hospital':
        return '병원 진료';
      case 'visit':
        return '면회';
      case 'outing':
        return '외출';
      case 'therapy':
        return '치료실 방문';
      default:
        return '일정';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          오늘의 일정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getTypeIcon(record.type)}</div>
                  <div>
                    <p className="font-medium">{record.seniorName}</p>
                    <p className="text-sm text-gray-600">
                      {record.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      예정 시간: {record.scheduledTime}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={getStatusColor(record.status)}>
                    {record.status === 'completed'
                      ? '완료'
                      : record.status === 'cancelled'
                      ? '취소'
                      : '예정'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTypeLabel(record.type)}
                  </p>
                </div>
              </div>
              {record.notes && (
                <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
