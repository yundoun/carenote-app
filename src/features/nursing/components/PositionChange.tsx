import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PositionChangeRecord } from '../types/nursing.types';

interface PositionChangeProps {
  records: PositionChangeRecord[];
}

export function PositionChange({ records }: PositionChangeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          체위 변경 기록
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{record.seniorName}</p>
                  <p className="text-sm text-gray-600">
                    {record.fromPosition} → {record.toPosition}
                  </p>
                  <p className="text-xs text-gray-500">
                    {record.time} | {record.performedBy}
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
