import { Heart, Activity, Thermometer, Droplets, Plus, Clock, AlertTriangle } from 'lucide-react';
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
import { VitalRecordForm } from './VitalRecordForm';
import { useVitals } from '../hooks/useVitals';
import type { Senior, VitalSigns } from '@/store/slices/vitalsSlice';

interface VitalCardProps {
  senior: Senior;
}

export const VitalCard = ({ senior }: VitalCardProps) => {
  const { 
    isRecording, 
    selectedSenior, 
    newVitals, 
    startVitalRecording, 
    selectSenior, 
    updateVitalsInput, 
    saveVitals, 
    cancelVitalRecording,
    isLoading 
  } = useVitals();

  const isSelected = selectedSenior?.id === senior.id;
  
  // 바이탈 사인 상태 체크
  const getVitalStatus = (value: number, normal: { min: number; max: number }) => {
    if (value < normal.min || value > normal.max) return 'abnormal';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abnormal':
        return 'text-red-600 border-red-200 bg-red-50';
      default:
        return 'text-green-600 border-green-200 bg-green-50';
    }
  };

  const handleOpenRecord = () => {
    startVitalRecording(senior.id);
  };

  const handleSelectSenior = () => {
    selectSenior(senior);
  };

  const handleSaveVitals = async () => {
    await saveVitals(senior.id);
  };

  // 다음 체크 시간까지 남은 시간 계산
  const getTimeUntilNextCheck = () => {
    const now = new Date();
    const [hour, minute] = senior.nextScheduledCheck.split(':').map(Number);
    const nextCheck = new Date();
    nextCheck.setHours(hour, minute, 0, 0);
    
    if (nextCheck <= now) {
      nextCheck.setDate(nextCheck.getDate() + 1);
    }
    
    const diff = nextCheck.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const formatLastVitalTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}시간 전`;
    }
    return `${diffMinutes}분 전`;
  };

  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${senior.alerts.length > 0 ? 'border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">
                {senior.name} ({senior.age || '?'}세)
              </h3>
              {senior.alerts.length > 0 && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-gray-500">
              {senior.room}호 {senior.conditions.length > 0 && `| ${senior.conditions.join(', ')}`}
            </p>
            {senior.alerts.length > 0 && (
              <div className="flex gap-1 mt-1">
                {senior.alerts.slice(0, 2).map((alert, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {alert.type === 'high_bp' ? '고혈압' : 
                     alert.type === 'high_temp' ? '발열' :
                     alert.type === 'irregular_hr' ? '심박수이상' : '주의'}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="text-right text-xs text-gray-500">
            {senior.latestVitals && (
              <div>
                <p className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatLastVitalTime(senior.latestVitals.timestamp)}
                </p>
                <p className="text-xs text-blue-600">
                  다음: {getTimeUntilNextCheck()}
                </p>
              </div>
            )}
          </div>
        </div>

        {senior.latestVitals ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">혈압</p>
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    getVitalStatus(
                      senior.latestVitals.bloodPressureSystolic,
                      { min: 90, max: 140 }
                    )
                  )}>
                  {senior.latestVitals.bloodPressureSystolic}/
                  {senior.latestVitals.bloodPressureDiastolic}
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
                      senior.latestVitals.heartRate,
                      { min: 60, max: 100 }
                    )
                  )}>
                  {senior.latestVitals.heartRate}bpm
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
                      senior.latestVitals.temperature,
                      { min: 35.5, max: 37.5 }
                    )
                  )}>
                  {senior.latestVitals.temperature}°C
                </Badge>
              </div>
            </div>

            {senior.latestVitals.bloodSugar && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">혈당</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(
                      getVitalStatus(
                        senior.latestVitals.bloodSugar,
                        { min: 80, max: 140 }
                      )
                    )}>
                    {senior.latestVitals.bloodSugar}mg/dL
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
            open={isRecording && isSelected}
            onOpenChange={(open) => {
              if (!open) {
                cancelVitalRecording();
              }
            }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleOpenRecord}
                disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                바이탈 측정
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{senior.name}님 바이탈 사인 기록</DialogTitle>
              </DialogHeader>
              <VitalRecordForm
                senior={senior}
                vitals={newVitals}
                onVitalsChange={updateVitalsInput}
                onSave={handleSaveVitals}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectSenior}>
            상세보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
