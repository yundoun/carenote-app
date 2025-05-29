import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Senior } from '../../types/vitals.types';

interface UrgentAlertProps {
  urgentCases: Senior[];
  onSelectSenior: (senior: Senior) => void;
}

export const UrgentAlert = ({
  urgentCases,
  onSelectSenior,
}: UrgentAlertProps) => {
  if (urgentCases.length === 0) return null;

  return (
    <Card className="mb-6 border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="font-semibold text-red-800">긴급 주의 필요</h2>
        </div>
        <div className="space-y-2">
          {urgentCases.map((senior) => (
            <div
              key={senior.id}
              className="flex justify-between items-center bg-white p-3 rounded">
              <div>
                <span className="font-medium">
                  {senior.name} ({senior.room}호)
                </span>
                <p className="text-sm text-red-600">
                  혈압: {senior.lastVitals?.bloodPressure.systolic}/
                  {senior.lastVitals?.bloodPressure.diastolic} | 체온:{' '}
                  {senior.lastVitals?.temperature}°C
                </p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onSelectSenior(senior)}>
                확인
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
