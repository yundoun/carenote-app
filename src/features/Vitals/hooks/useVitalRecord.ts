import { useState } from 'react';
import { Senior, VitalSigns } from '../types/vitals.types';

export const useVitalRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null);
  const [newVitals, setNewVitals] = useState<Partial<VitalSigns>>({});

  const openRecordDialog = (senior: Senior) => {
    setSelectedSenior(senior);
    setIsRecording(true);
    setNewVitals({});
  };

  const closeRecordDialog = () => {
    setIsRecording(false);
    setSelectedSenior(null);
    setNewVitals({});
  };

  const saveVitals = async () => {
    if (
      selectedSenior &&
      newVitals.bloodPressure &&
      newVitals.heartRate &&
      newVitals.temperature
    ) {
      // 실제로는 API 호출
      console.log('Saving vitals:', {
        seniorId: selectedSenior.id,
        vitals: {
          ...newVitals,
          timestamp: new Date(),
          recordedBy: '현재 사용자', // 실제로는 로그인한 사용자 정보
        },
      });

      closeRecordDialog();
      return true;
    }
    return false;
  };

  const updateVitals = (updates: Partial<VitalSigns>) => {
    setNewVitals((prev) => ({ ...prev, ...updates }));
  };

  return {
    isRecording,
    selectedSenior,
    newVitals,
    openRecordDialog,
    closeRecordDialog,
    saveVitals,
    updateVitals,
  };
};
