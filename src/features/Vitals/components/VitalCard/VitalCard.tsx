import { Heart, Activity, Thermometer, Droplets, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VitalRecordForm } from '../VitalRecordForm/VitalRecordForm';
import { useVitalStatus } from '../../hooks';
import type { Senior, VitalSigns } from '../../types/vitals.types';

interface VitalCardProps {
  senior: Senior;
  isRecording: boolean;
  selectedSenior: Senior | null;
  newVitals: Partial<VitalSigns>;
  onOpenRecord: (senior: Senior) => void;
  onSelectSenior: (senior: Senior) => void;
  onVitalsChange: (vitals: Partial<VitalSigns>) => void;
  onSaveVitals: () => void;
  onRecordingChange: () => void;
}

export const VitalCard = ({
  senior,
  isRecording,
  selectedSenior,
  newVitals,
  onOpenRecord,
  onSelectSenior,
  onVitalsChange,
  onSaveVitals,
  onRecordingChange,
}: VitalCardProps) => {
  const { getVitalStatus, getStatusColor } = useVitalStatus();

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold">
              {senior.name} ({senior.age}세)
            </h3>
            <p className="text-gray-500">
              {senior.room}호 | {senior.conditions.join(', ')}
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            {senior.lastVitals && (
              <p>
                마지막 측정:{' '}
                {senior.lastVitals.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>

        {senior.lastVitals ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">혈압</p>
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    getVitalStatus(
                      senior.lastVitals.bloodPressure.systolic,
                      senior.alertThresholds.bloodPressure.min,
                      senior.alertThresholds.bloodPressure.max
                    )
                  )}>
                  {senior.lastVitals.bloodPressure.systolic}/
                  {senior.lastVitals.bloodPressure.diastolic}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">맥박</p>
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    getVitalStatus(
                      senior.lastVitals.heartRate,
                      senior.alertThresholds.heartRate.min,
                      senior.alertThresholds.heartRate.max
                    )
                  )}>
                  {senior.lastVitals.heartRate}bpm
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">체온</p>
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    getVitalStatus(
                      senior.lastVitals.temperature,
                      senior.alertThresholds.temperature.min,
                      senior.alertThresholds.temperature.max
                    )
                  )}>
                  {senior.lastVitals.temperature}°C
                </Badge>
              </div>
            </div>

            {senior.lastVitals.bloodSugar && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">혈당</p>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 border-purple-200">
                    {senior.lastVitals.bloodSugar}mg/dL
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            측정된 바이탈 사인이 없습니다.
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Dialog
            open={isRecording && selectedSenior?.id === senior.id}
            onOpenChange={(open) => {
              if (!open) {
                onRecordingChange();
              }
            }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onOpenRecord(senior)}>
                <Plus className="h-4 w-4 mr-2" />
                바이탈 측정
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{senior.name} 바이탈 사인 기록</DialogTitle>
              </DialogHeader>
              <VitalRecordForm
                senior={senior}
                vitals={newVitals}
                onVitalsChange={onVitalsChange}
                onSave={onSaveVitals}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectSenior(senior)}>
            상세보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
