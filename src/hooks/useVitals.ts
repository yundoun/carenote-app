import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setSelectedSenior,
  setFilterStatus,
  startRecording,
  updateNewVitals,
  saveVitalRecord,
  acknowledgeAlert,
  cancelRecording,
  VitalSigns,
  Senior
} from '@/store/slices/vitalsSlice';

export function useVitals() {
  const dispatch = useAppDispatch();
  const vitals = useAppSelector((state) => state.vitals);
  const currentUser = useAppSelector((state) => state.auth.user);
  
  // 필터링된 시니어 목록
  const filteredSeniors = vitals.seniors.filter(senior => {
    switch (vitals.filterStatus) {
      case 'urgent':
        return senior.alerts.some(alert => !alert.acknowledged && alert.severity === 'high');
      case 'overdue':
        // 간단한 예시: 다음 체크 시간이 현재 시간보다 이전인 경우
        const now = new Date();
        const [checkHour, checkMinute] = senior.nextScheduledCheck.split(':').map(Number);
        const checkTime = new Date();
        checkTime.setHours(checkHour, checkMinute, 0, 0);
        return checkTime < now;
      case 'normal':
        return !senior.alerts.some(alert => !alert.acknowledged);
      default:
        return true;
    }
  });
  
  // 액션들
  const selectSenior = useCallback((senior: Senior | null) => {
    dispatch(setSelectedSenior(senior));
  }, [dispatch]);
  
  const setFilter = useCallback((filter: typeof vitals.filterStatus) => {
    dispatch(setFilterStatus(filter));
  }, [dispatch]);
  
  const startVitalRecording = useCallback((seniorId: string) => {
    dispatch(startRecording(seniorId));
  }, [dispatch]);
  
  const updateVitalsInput = useCallback((vitals: Partial<VitalSigns>) => {
    dispatch(updateNewVitals(vitals));
  }, [dispatch]);
  
  const saveVitals = useCallback((seniorId: string) => {
    if (!currentUser) return;
    
    const completeVitals: VitalSigns = {
      bloodPressureSystolic: vitals.newVitals.bloodPressureSystolic || 0,
      bloodPressureDiastolic: vitals.newVitals.bloodPressureDiastolic || 0,
      heartRate: vitals.newVitals.heartRate || 0,
      temperature: vitals.newVitals.temperature || 0,
      weight: vitals.newVitals.weight,
      bloodSugar: vitals.newVitals.bloodSugar,
      oxygenSaturation: vitals.newVitals.oxygenSaturation,
      notes: vitals.newVitals.notes,
      timestamp: new Date().toISOString(),
      recordedBy: currentUser.name,
    };
    
    dispatch(saveVitalRecord({ seniorId, vitals: completeVitals }));
  }, [dispatch, vitals.newVitals, currentUser]);
  
  const acknowledgeVitalAlert = useCallback((alertId: string) => {
    dispatch(acknowledgeAlert(alertId));
  }, [dispatch]);
  
  const cancelVitalRecording = useCallback(() => {
    dispatch(cancelRecording());
  }, [dispatch]);
  
  // 통계 계산
  const urgentCount = vitals.urgentAlerts.length;
  const totalSeniors = vitals.seniors.length;
  const checkedToday = vitals.seniors.filter(s => {
    if (!s.latestVitals) return false;
    const today = new Date().toDateString();
    const vitalDate = new Date(s.latestVitals.timestamp).toDateString();
    return today === vitalDate;
  }).length;
  
  // urgentCases 계산 - 주의가 필요한 시니어들
  const urgentCases = vitals.seniors.filter(senior => 
    senior.alerts.some(alert => !alert.acknowledged && alert.severity === 'high')
  );

  return {
    // 상태
    ...vitals,
    filteredSeniors,
    seniors: vitals.seniors,
    urgentCases,
    
    // 통계
    urgentCount,
    totalSeniors,
    checkedToday,
    
    // 액션들
    selectSenior,
    setFilter,
    startVitalRecording,
    updateVitalsInput,
    saveVitals,
    acknowledgeVitalAlert,
    cancelVitalRecording,
  };
}