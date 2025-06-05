import { useState, useEffect } from 'react';
import { Activity, Trash2, Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useVitals } from '../hooks/useVitals';
import type { Senior, VitalSigns } from '@/store/slices/vitalsSlice';

interface VitalHistoryProps {
  selectedResident?: Senior | null;
}

export const VitalHistory = ({ selectedResident }: VitalHistoryProps) => {
  const { 
    seniors, 
    selectSenior, 
    selectedSenior, 
    deleteVitalRecordById, 
    fetchVitalHistory,
    isLoading 
  } = useVitals();
  
  const [selectedResidentId, setSelectedResidentId] = useState<string>('');

  // 선택된 거주자 변경 시 히스토리 조회
  useEffect(() => {
    if (selectedResidentId) {
      fetchVitalHistory(selectedResidentId);
    }
  }, [selectedResidentId, fetchVitalHistory]);

  // props로 받은 selectedResident가 있으면 우선 사용
  const currentResident = selectedResident || selectedSenior || seniors.find(s => s.id === selectedResidentId);
  const vitalHistory = currentResident?.vitalHistory || [];

  const handleResidentChange = (residentId: string) => {
    setSelectedResidentId(residentId);
    const resident = seniors.find(s => s.id === residentId);
    if (resident) {
      selectSenior(resident);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    await deleteVitalRecordById(recordId);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVitalStatus = (vital: VitalSigns) => {
    const warnings = [];
    
    if (vital.bloodPressureSystolic > 140 || vital.bloodPressureDiastolic > 90) {
      warnings.push('고혈압');
    }
    if (vital.temperature > 37.5) {
      warnings.push('발열');
    }
    if (vital.heartRate > 100 || vital.heartRate < 60) {
      warnings.push('심박수이상');
    }

    return warnings;
  };

  const VitalCard = ({ vital, index }: { vital: VitalSigns; index: number }) => {
    const warnings = getVitalStatus(vital);
    const hasWarnings = warnings.length > 0;

    return (
      <Card className={`${hasWarnings ? 'border-red-200 bg-red-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{formatDate(vital.timestamp)}</span>
              {hasWarnings && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{vital.recordedBy}</span>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>기록 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 바이탈 측정 기록을 삭제하시겠습니까? 
                      <br />삭제된 기록은 복구할 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteRecord(vital.timestamp)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {hasWarnings && (
            <div className="flex gap-1 flex-wrap">
              {warnings.map((warning, i) => (
                <Badge key={i} variant="destructive" className="text-xs">
                  {warning}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between">
                <span className="text-gray-600">혈압:</span>
                <span className={hasWarnings && warnings.includes('고혈압') ? 'text-red-600 font-medium' : ''}>
                  {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">맥박:</span>
                <span className={hasWarnings && warnings.includes('심박수이상') ? 'text-red-600 font-medium' : ''}>
                  {vital.heartRate} bpm
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-gray-600">체온:</span>
                <span className={hasWarnings && warnings.includes('발열') ? 'text-red-600 font-medium' : ''}>
                  {vital.temperature}°C
                </span>
              </div>
              {vital.oxygenSaturation && (
                <div className="flex justify-between">
                  <span className="text-gray-600">산소포화도:</span>
                  <span>{vital.oxygenSaturation}%</span>
                </div>
              )}
            </div>
          </div>
          {vital.notes && (
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">특이사항: </span>
              <span>{vital.notes}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* 거주자 선택 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">거주자 선택:</label>
        <Select value={selectedResidentId} onValueChange={handleResidentChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="거주자를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {seniors.map((senior) => (
              <SelectItem key={senior.id} value={senior.id}>
                {senior.name} ({senior.room}호)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 기록 목록 */}
      {!currentResident ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">거주자를 선택하세요</h3>
          <p className="text-gray-500">바이탈 측정 기록을 확인할 거주자를 선택해주세요.</p>
        </div>
      ) : vitalHistory.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">측정 기록이 없습니다</h3>
          <p className="text-gray-500">
            {currentResident.name}님의 바이탈 측정 기록이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {currentResident.name}님의 측정 기록 ({vitalHistory.length}건)
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchVitalHistory(currentResident.id)}
              disabled={isLoading}
            >
              <Calendar className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>
          
          <div className="space-y-3">
            {vitalHistory.map((vital, index) => (
              <VitalCard key={vital.timestamp} vital={vital} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
