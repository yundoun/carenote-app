import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setSelectedResident,
  setSelectedDate,
  setFilterType,
  addMedicationRecord,
  updateMedicationRecord,
  addPositionChangeRecord,
  addCareActivity,
  addNursingNote,
  startRecording,
  cancelRecording,
  clearError,
  fetchTodayNursingRecords,
  fetchResidentNursingRecords,
  createNewMedicationRecord,
  createNewPositionChangeRecord,
  updateMedicationRecordStatus,
} from '@/store/slices/nursingSlice';
import type {
  MedicationRecord as ReduxMedicationRecord,
  PositionChangeRecord as ReduxPositionChangeRecord,
  CareActivity,
  NursingNote as ReduxNursingNote,
} from '@/store/slices/nursingSlice';
import type {
  MedicationRecord,
  PositionChangeRecord,
  NursingNote,
} from '@/features/nursing/types/nursing.types';

// Data transformation adapters
const transformMedicationRecord = (
  record: ReduxMedicationRecord
): MedicationRecord => ({
  id: record.id,
  seniorId: record.residentId,
  seniorName: record.residentName,
  medication: record.medicationName,
  dosage: record.dosage,
  time: record.scheduledTime,
  administered: record.status === 'COMPLETED',
  administeredBy: record.status === 'COMPLETED' ? record.recordedBy : undefined,
  notes: record.notes,
  date: new Date(record.recordedAt),
});

const transformPositionRecord = (
  record: ReduxPositionChangeRecord
): PositionChangeRecord => ({
  id: record.id,
  seniorId: record.residentId,
  seniorName: record.residentName,
  fromPosition: record.fromPosition,
  toPosition: record.toPosition,
  time: record.changeTime,
  performedBy: record.recordedBy,
  notes: record.notes,
  date: new Date(record.recordedAt),
});

const transformNursingNote = (record: ReduxNursingNote): NursingNote => ({
  id: record.id,
  seniorId: record.residentId,
  seniorName: record.residentName,
  category: 'general', // Map noteType to category as needed
  content: record.content,
  recordedBy: record.recordedBy,
  timestamp: new Date(record.recordedAt),
});

export function useNursing() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const {
    medicationRecords,
    positionChangeRecords,
    careActivities,
    nursingNotes,
    selectedResident,
    selectedDate,
    filterType,
    isRecording,
    currentRecord,
    isLoading,
    error,
    totalMedications,
    completedMedications,
    missedMedications,
    totalPositionChanges,
  } = useAppSelector((state) => state.nursing);

  const caregiverId = currentUser?.id || '8debc4ef-aa7a-4ddd-ae6b-4982fe89dc7b'; // 임시 ID

  // 컴포넌트 마운트 시 오늘의 간병 기록 조회
  useEffect(() => {
    console.log('🔄 useNursing 초기화 - 오늘의 간병 기록 조회 시작');
    console.log('👤 현재 사용자:', { currentUser, caregiverId });

    if (selectedResident) {
      // 특정 거주자 기록 조회
      dispatch(
        fetchResidentNursingRecords({
          residentId: selectedResident,
          startDate: selectedDate,
          endDate: selectedDate,
        })
      );
    } else {
      // 오늘의 전체 간병 기록 조회
      dispatch(fetchTodayNursingRecords({ caregiverId, date: selectedDate }));
    }
  }, [dispatch, caregiverId, selectedResident, selectedDate]);

  const selectResident = useCallback(
    (residentId: string | null) => {
      dispatch(setSelectedResident(residentId));
    },
    [dispatch]
  );

  const selectDate = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
    },
    [dispatch]
  );

  const setFilter = useCallback(
    (filter: typeof filterType) => {
      dispatch(setFilterType(filter));
    },
    [dispatch]
  );

  // 기록 추가 함수들
  const addMedication = useCallback(
    (record: Omit<ReduxMedicationRecord, 'id' | 'recordedAt'>) => {
      dispatch(
        createNewMedicationRecord({
          resident_id: record.residentId,
          caregiver_id: caregiverId,
          medication_name: record.medicationName,
          dosage: record.dosage,
          scheduled_time: record.scheduledTime,
          actual_time: record.actualTime,
          status: record.status,
          notes: record.notes,
        })
      );
    },
    [dispatch, caregiverId]
  );

  const updateMedication = useCallback(
    (id: string, updates: Partial<ReduxMedicationRecord>) => {
      dispatch(
        updateMedicationRecordStatus({
          recordId: id,
          updates: {
            status: updates.status,
            actual_time: updates.actualTime,
            notes: updates.notes,
          },
        })
      );
    },
    [dispatch]
  );

  const addPositionChange = useCallback(
    (record: Omit<ReduxPositionChangeRecord, 'id' | 'recordedAt'>) => {
      dispatch(
        createNewPositionChangeRecord({
          resident_id: record.residentId,
          caregiver_id: caregiverId,
          change_time: record.changeTime,
          from_position: record.fromPosition,
          to_position: record.toPosition,
          skin_condition: record.skinCondition,
          notes: record.notes,
        })
      );
    },
    [dispatch, caregiverId]
  );

  const addCare = useCallback(
    (activity: Omit<CareActivity, 'id' | 'recordedAt'>) => {
      dispatch(
        addCareActivity({
          ...activity,
          recordedBy: currentUser?.name || '익명',
        })
      );
    },
    [dispatch, currentUser]
  );

  const addNote = useCallback(
    (note: Omit<ReduxNursingNote, 'id' | 'recordedAt'>) => {
      dispatch(
        addNursingNote({
          ...note,
          recordedBy: currentUser?.name || '익명',
        })
      );
    },
    [dispatch, currentUser]
  );

  const startNewRecording = useCallback(
    (type: 'medication' | 'position' | 'care' | 'note', data?: any) => {
      dispatch(startRecording({ type, data }));
    },
    [dispatch]
  );

  const cancelCurrentRecording = useCallback(() => {
    dispatch(cancelRecording());
  }, [dispatch]);

  // 필터링된 데이터
  const getFilteredRecords = useCallback(() => {
    const today = selectedDate;

    let filteredMedications = medicationRecords;
    let filteredPositions = positionChangeRecords;
    let filteredCare = careActivities;
    let filteredNotes = nursingNotes;

    if (selectedResident) {
      filteredMedications = filteredMedications.filter(
        (r) => r.residentId === selectedResident
      );
      filteredPositions = filteredPositions.filter(
        (r) => r.residentId === selectedResident
      );
      filteredCare = filteredCare.filter(
        (r) => r.residentId === selectedResident
      );
      filteredNotes = filteredNotes.filter(
        (r) => r.residentId === selectedResident
      );
    }

    // 날짜 필터링은 이미 서버에서 처리됨

    return {
      medications: filteredMedications.map(transformMedicationRecord),
      positions: filteredPositions.map(transformPositionRecord),
      care: filteredCare,
      notes: filteredNotes.map(transformNursingNote),
    };
  }, [
    medicationRecords,
    positionChangeRecords,
    careActivities,
    nursingNotes,
    selectedResident,
    selectedDate,
  ]);

  const filteredRecords = getFilteredRecords();

  // 통계 정보
  const statistics = {
    totalMedications,
    completedMedications,
    missedMedications,
    totalPositionChanges,
    completionRate:
      totalMedications > 0
        ? Math.round((completedMedications / totalMedications) * 100)
        : 0,
  };

  // 오류 정리
  const clearNursingError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // 상태
    selectedResident,
    selectedDate,
    filterType,
    isRecording,
    currentRecord,
    isLoading,
    error,

    // 데이터
    medications: filteredRecords.medications,
    positions: filteredRecords.positions,
    care: filteredRecords.care,
    notes: filteredRecords.notes,
    statistics,

    // 원본 데이터 (컴포넌트에서 필요시 사용)
    medicationRecords,
    positionChangeRecords,
    careActivities,
    nursingNotes,

    // 액션
    selectResident,
    selectDate,
    setFilter,
    addMedication,
    updateMedication,
    addPositionChange,
    addCare,
    addNote,
    startNewRecording,
    cancelCurrentRecording,
    clearError: clearNursingError,

    // 새로고침
    refreshTodayRecords: () =>
      dispatch(fetchTodayNursingRecords({ caregiverId, date: selectedDate })),
    refreshResidentRecords: (residentId: string) =>
      dispatch(
        fetchResidentNursingRecords({
          residentId,
          startDate: selectedDate,
          endDate: selectedDate,
        })
      ),
  };
}
