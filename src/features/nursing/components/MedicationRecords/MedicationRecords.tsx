import { Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MedicationRecord } from '../../types/nursing.types';

interface MedicationRecordsProps {
  records: MedicationRecord[];
}

export function MedicationRecords({ records }: MedicationRecordsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          오늘의 복약 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                record.administered
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
              <div className="flex items-center gap-3">
                <Checkbox checked={record.administered} disabled />
                <div>
                  <p className="font-medium">
                    {record.seniorName} - {record.medication}
                  </p>
                  <p className="text-sm text-gray-500">
                    {record.dosage} | {record.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {record.administered ? (
                  <Badge className="bg-green-100 text-green-800">
                    복용 완료
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800">
                    복용 대기
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
