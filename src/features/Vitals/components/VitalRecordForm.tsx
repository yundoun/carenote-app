import { Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Senior, VitalSigns } from '@/store/slices/vitalsSlice';

interface VitalRecordFormProps {
  senior: Senior;
  vitals: Partial<VitalSigns>;
  onVitalsChange: (vitals: Partial<VitalSigns>) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const VitalRecordForm = ({
  senior,
  vitals,
  onVitalsChange,
  onSave,
  isLoading = false,
}: VitalRecordFormProps) => {
  // 혈압 유효성 검사
  const isBloodPressureAbnormal = () => {
    const systolic = vitals.bloodPressureSystolic || 0;
    const diastolic = vitals.bloodPressureDiastolic || 0;
    return systolic > 140 || diastolic > 90 || systolic < 90 || diastolic < 60;
  };

  // 체온 유효성 검사
  const isTemperatureAbnormal = () => {
    const temp = vitals.temperature || 0;
    return temp > 37.5 || temp < 35.5;
  };

  // 심박수 유효성 검사
  const isHeartRateAbnormal = () => {
    const hr = vitals.heartRate || 0;
    return hr > 100 || hr < 60;
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      vitals.bloodPressureSystolic && 
      vitals.bloodPressureDiastolic && 
      vitals.heartRate && 
      vitals.temperature
    );
  };

  return (
    <div className="space-y-4">
      {/* 이상 수치 경고 */}
      {(isBloodPressureAbnormal() || isTemperatureAbnormal() || isHeartRateAbnormal()) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            비정상 범위의 수치가 감지되었습니다. 의료진에게 보고하세요.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="systolic" className={isBloodPressureAbnormal() ? 'text-red-600' : ''}>
            수축기 혈압 (mmHg)
          </Label>
          <Input
            id="systolic"
            type="number"
            placeholder="120"
            min="70"
            max="200"
            value={vitals.bloodPressureSystolic || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                bloodPressureSystolic: parseInt(e.target.value) || 0,
              })
            }
            className={isBloodPressureAbnormal() ? 'border-red-300' : ''}
          />
          <p className="text-xs text-gray-500 mt-1">정상: 90-140</p>
        </div>
        <div>
          <Label htmlFor="diastolic" className={isBloodPressureAbnormal() ? 'text-red-600' : ''}>
            이완기 혈압 (mmHg)
          </Label>
          <Input
            id="diastolic"
            type="number"
            placeholder="80"
            min="40"
            max="120"
            value={vitals.bloodPressureDiastolic || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                bloodPressureDiastolic: parseInt(e.target.value) || 0,
              })
            }
            className={isBloodPressureAbnormal() ? 'border-red-300' : ''}
          />
          <p className="text-xs text-gray-500 mt-1">정상: 60-90</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="heartRate" className={isHeartRateAbnormal() ? 'text-red-600' : ''}>
            맥박 (bpm)
          </Label>
          <Input
            id="heartRate"
            type="number"
            placeholder="72"
            min="40"
            max="150"
            value={vitals.heartRate || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                heartRate: parseInt(e.target.value) || 0,
              })
            }
            className={isHeartRateAbnormal() ? 'border-red-300' : ''}
          />
          <p className="text-xs text-gray-500 mt-1">정상: 60-100</p>
        </div>
        <div>
          <Label htmlFor="temperature" className={isTemperatureAbnormal() ? 'text-red-600' : ''}>
            체온 (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="36.5"
            min="35"
            max="42"
            value={vitals.temperature || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                temperature: parseFloat(e.target.value) || 0,
              })
            }
            className={isTemperatureAbnormal() ? 'border-red-300' : ''}
          />
          <p className="text-xs text-gray-500 mt-1">정상: 35.5-37.5</p>
        </div>
      </div>

      {/* 추가 바이탈 사인 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="oxygenSaturation">산소포화도 (%)</Label>
          <Input
            id="oxygenSaturation"
            type="number"
            placeholder="98"
            min="80"
            max="100"
            value={vitals.oxygenSaturation || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                oxygenSaturation: parseInt(e.target.value) || 0,
              })
            }
          />
          <p className="text-xs text-gray-500 mt-1">정상: 95-100</p>
        </div>
        <div>
          <Label htmlFor="weight">체중 (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="65.0"
            min="20"
            max="200"
            value={vitals.weight || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                weight: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      {senior.conditions.includes('당뇨') && (
        <div>
          <Label htmlFor="bloodSugar">혈당 (mg/dL)</Label>
          <Input
            id="bloodSugar"
            type="number"
            placeholder="100"
            min="50"
            max="400"
            value={vitals.bloodSugar || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                bloodSugar: parseInt(e.target.value) || 0,
              })
            }
          />
          <p className="text-xs text-gray-500 mt-1">정상: 80-140 (식전)</p>
        </div>
      )}

      <div>
        <Label htmlFor="notes">특이사항</Label>
        <Textarea
          id="notes"
          placeholder="특이사항이나 관찰 내용을 입력하세요"
          value={vitals.notes || ''}
          onChange={(e) => onVitalsChange({ ...vitals, notes: e.target.value })}
          rows={3}
        />
      </div>

      <Button 
        onClick={onSave} 
        className="w-full"
        disabled={!isFormValid() || isLoading}
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );
};
