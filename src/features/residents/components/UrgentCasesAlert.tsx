import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResidentDetail } from '../types/residents.types';

interface UrgentCasesAlertProps {
  urgentCases: ResidentDetail[];
  onResidentClick: (resident: ResidentDetail) => void;
}

export function UrgentCasesAlert({
  urgentCases,
  onResidentClick,
}: UrgentCasesAlertProps) {
  if (urgentCases.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h2 className="font-semibold text-amber-800">주의 필요</h2>
        </div>
        <div className="space-y-2">
          {urgentCases.map((resident) => (
            <div
              key={resident.id}
              className="flex justify-between items-center">
              <span className="text-sm">
                {resident.name} ({resident.room}호) -{' '}
                {resident.warnings?.join(', ')}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResidentClick(resident)}>
                확인
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
