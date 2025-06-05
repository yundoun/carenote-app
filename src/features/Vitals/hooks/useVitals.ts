import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setSelectedSenior,
  setFilterStatus,
  startRecording,
  updateNewVitals,
  saveVitalRecord,
  acknowledgeAlert,
  cancelRecording,
  fetchVitalStatus,
  createVitalRecord,
  createSampleVitalData,
  deleteVitalRecord,
  deleteMultipleVitalRecords,
  fetchResidentVitalHistory,
  VitalSigns,
  Senior,
} from '@/store/slices/vitalsSlice';

export function useVitals() {
  const dispatch = useAppDispatch();
  const vitals = useAppSelector((state) => state.vitals);
  const currentUser = useAppSelector((state) => state.auth.user);
  const hasInitialized = useRef(false);

  // 컴포넌트 마운트 시 바이탈 현황 데이터 조회 (한 번만)
  useEffect(() => {
    if (hasInitialized.current) return;

    const loadVitalStatus = async () => {
      try {
        console.log('🔄 바이탈 현황 데이터 로딩 시작...');
        hasInitialized.current = true;

        // 먼저 기본 조회 시도
        await dispatch(fetchVitalStatus()).unwrap();
        console.log('✅ 바이탈 현황 데이터 로딩 완료');
      } catch (error) {
        console.error('❌ 바이탈 현황 조회 실패:', error);

        // 데이터가 없으면 샘플 데이터 생성 시도
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = error.message as string;
          if (
            errorMessage.includes('테이블') ||
            errorMessage.includes('table') ||
            errorMessage.includes('42P01')
          ) {
            console.log('📊 테이블이 없어서 샘플 데이터 생성을 시도합니다...');
            try {
              await dispatch(createSampleVitalData()).unwrap();
              console.log('✅ 샘플 데이터 생성 완료, 다시 조회합니다...');

              // 샘플 데이터 생성 후 다시 조회
              await dispatch(fetchVitalStatus()).unwrap();
              console.log('✅ 샘플 데이터 조회 완료');
            } catch (sampleError) {
              console.error('❌ 샘플 데이터 생성 실패:', sampleError);
            }
          }
        }
      }
    };

    loadVitalStatus();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 새로고침 함수
  const refreshVitalStatus = useCallback(async () => {
    try {
      await dispatch(fetchVitalStatus()).unwrap();
    } catch (error) {
      console.error('바이탈 현황 새로고침 실패:', error);
    }
  }, [dispatch]);

  // 필터링된 시니어 목록
  const filteredSeniors = vitals.seniors.filter((senior) => {
    switch (vitals.filterStatus) {
      case 'urgent':
        return senior.alerts.some(
          (alert) => !alert.acknowledged && alert.severity === 'high'
        );
      case 'overdue':
        // 간단한 예시: 다음 체크 시간이 현재 시간보다 이전인 경우
        const now = new Date();
        const [checkHour, checkMinute] = senior.nextScheduledCheck
          .split(':')
          .map(Number);
        const checkTime = new Date();
        checkTime.setHours(checkHour, checkMinute, 0, 0);
        return checkTime < now;
      case 'normal':
        return !senior.alerts.some((alert) => !alert.acknowledged);
      default:
        return true;
    }
  });

  // 액션들
  const selectSenior = useCallback(
    (senior: Senior | null) => {
      dispatch(setSelectedSenior(senior));
    },
    [dispatch]
  );

  const setFilter = useCallback(
    (filter: typeof vitals.filterStatus) => {
      dispatch(setFilterStatus(filter));
    },
    [dispatch]
  );

  const startVitalRecording = useCallback(
    (seniorId: string) => {
      dispatch(startRecording(seniorId));
    },
    [dispatch]
  );

  const updateVitalsInput = useCallback(
    (vitals: Partial<VitalSigns>) => {
      dispatch(updateNewVitals(vitals));
    },
    [dispatch]
  );

  const saveVitals = useCallback(
    async (seniorId: string) => {
      if (!currentUser) {
        console.error('사용자 정보가 없습니다.');
        return;
      }

      try {
        // Redux 상태의 newVitals를 API 호출용 데이터로 변환
        const vitalData = {
          resident_id: seniorId,
          measured_by: currentUser.id || 'system', // 사용자 ID 사용
          measured_at: new Date().toISOString(),
          systolic_bp: vitals.newVitals.bloodPressureSystolic,
          diastolic_bp: vitals.newVitals.bloodPressureDiastolic,
          heart_rate: vitals.newVitals.heartRate,
          temperature: vitals.newVitals.temperature,
          blood_oxygen: vitals.newVitals.oxygenSaturation,
          blood_sugar: vitals.newVitals.bloodSugar,
          weight: vitals.newVitals.weight,
          notes: vitals.newVitals.notes,
        };

        console.log('💾 바이탈 데이터 저장 중...', vitalData);

        await dispatch(createVitalRecord(vitalData)).unwrap();
        console.log('✅ 바이탈 데이터 저장 완료');

        // 저장 후 현황 새로고침
        await refreshVitalStatus();

        // 기존 Redux 액션도 호출하여 UI 업데이트
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
          recordedBy: currentUser.name || '알 수 없음',
        };

        dispatch(saveVitalRecord({ seniorId, vitals: completeVitals }));
      } catch (error) {
        console.error('❌ 바이탈 데이터 저장 실패:', error);
      }
    },
    [dispatch, vitals.newVitals, currentUser, refreshVitalStatus]
  );

  const acknowledgeVitalAlert = useCallback(
    (alertId: string) => {
      dispatch(acknowledgeAlert(alertId));
    },
    [dispatch]
  );

  const cancelVitalRecording = useCallback(() => {
    dispatch(cancelRecording());
  }, [dispatch]);

  // 바이탈 기록 삭제
  const deleteVitalRecordById = useCallback(
    async (recordId: string) => {
      try {
        console.log('🗑️ 바이탈 기록 삭제 중...', recordId);

        await dispatch(deleteVitalRecord(recordId)).unwrap();
        console.log('✅ 바이탈 기록 삭제 완료');

        // 삭제 후 현황 새로고침
        await refreshVitalStatus();
      } catch (error) {
        console.error('❌ 바이탈 기록 삭제 실패:', error);
      }
    },
    [dispatch, refreshVitalStatus]
  );

  // 여러 바이탈 기록 일괄 삭제
  const deleteMultipleVitalRecordsById = useCallback(
    async (recordIds: string[]) => {
      try {
        console.log('🗑️ 바이탈 기록 일괄 삭제 중...', recordIds);

        await dispatch(deleteMultipleVitalRecords(recordIds)).unwrap();
        console.log('✅ 바이탈 기록 일괄 삭제 완료');

        // 삭제 후 현황 새로고침
        await refreshVitalStatus();
      } catch (error) {
        console.error('❌ 바이탈 기록 일괄 삭제 실패:', error);
      }
    },
    [dispatch, refreshVitalStatus]
  );

  // 거주자별 바이탈 히스토리 조회
  const fetchVitalHistory = useCallback(
    async (residentId: string, limit?: number) => {
      try {
        console.log('📊 바이탈 히스토리 조회 중...', residentId);

        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // 최근 30일

        await dispatch(
          fetchResidentVitalHistory({
            residentId,
            startDate: startDate.toISOString().split('T')[0],
            endDate,
            limit: limit || 50,
          })
        ).unwrap();

        console.log('✅ 바이탈 히스토리 조회 완료');
      } catch (error) {
        console.error('❌ 바이탈 히스토리 조회 실패:', error);
      }
    },
    [dispatch]
  );

  // 통계 계산
  const urgentCount = vitals.urgentAlerts.length;
  const totalSeniors = vitals.seniors.length;
  const checkedToday = vitals.seniors.filter((s) => {
    if (!s.latestVitals) return false;
    const today = new Date().toDateString();
    const vitalDate = new Date(s.latestVitals.timestamp).toDateString();
    return today === vitalDate;
  }).length;

  // urgentCases 계산 - 주의가 필요한 시니어들
  const urgentCases = vitals.seniors.filter((senior) =>
    senior.alerts.some(
      (alert) => !alert.acknowledged && alert.severity === 'high'
    )
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
    refreshVitalStatus,
    deleteVitalRecordById,
    deleteMultipleVitalRecordsById,
    fetchVitalHistory,
  };
}
