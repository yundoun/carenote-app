import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Senior, VitalSigns } from '../types/vitals.types';

interface VitalRecordFormProps {
  senior: Senior;
  vitals: Partial<VitalSigns>;
  onVitalsChange: (vitals: Partial<VitalSigns>) => void;
  onSave: () => void;
}

export const VitalRecordForm = ({
  senior,
  vitals,
  onVitalsChange,
  onSave,
}: VitalRecordFormProps) => {
  const updateBloodPressure = (
    type: 'systolic' | 'diastolic',
    value: string
  ) => {
    onVitalsChange({
      ...vitals,
      bloodPressure: {
        systolic:
          type === 'systolic'
            ? parseInt(value) || 0
            : vitals.bloodPressure?.systolic || 0,
        diastolic:
          type === 'diastolic'
            ? parseInt(value) || 0
            : vitals.bloodPressure?.diastolic || 0,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="systolic">수축기 혈압</Label>
          <Input
            id="systolic"
            type="number"
            placeholder="120"
            value={vitals.bloodPressure?.systolic || ''}
            onChange={(e) => updateBloodPressure('systolic', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="diastolic">이완기 혈압</Label>
          <Input
            id="diastolic"
            type="number"
            placeholder="80"
            value={vitals.bloodPressure?.diastolic || ''}
            onChange={(e) => updateBloodPressure('diastolic', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="heartRate">맥박 (bpm)</Label>
          <Input
            id="heartRate"
            type="number"
            placeholder="72"
            value={vitals.heartRate || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                heartRate: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="temperature">체온 (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="36.5"
            value={vitals.temperature || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                temperature: parseFloat(e.target.value) || 0,
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
            value={vitals.bloodSugar || ''}
            onChange={(e) =>
              onVitalsChange({
                ...vitals,
                bloodSugar: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">특이사항</Label>
        <Textarea
          id="notes"
          placeholder="특이사항이나 관찰 내용을 입력하세요"
          value={vitals.notes || ''}
          onChange={(e) => onVitalsChange({ ...vitals, notes: e.target.value })}
        />
      </div>

      <Button onClick={onSave} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        저장하기
      </Button>
    </div>
  );
};
