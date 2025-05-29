import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setSelectedResident,
  setSelectedDate,
  setFilterType,
  addMedicationRecord,
  updateMedicationRecord,
  addPositionChangeRecord,
  addCareActivity,
  addAppointment,
  updateAppointment,
  addNursingNote,
  startRecording,
  cancelRecording,
} from '@/store/slices/nursingSlice';
import type { 
  MedicationRecord as ReduxMedicationRecord, 
  PositionChangeRecord as ReduxPositionChangeRecord, 
  CareActivity, 
  Appointment as ReduxAppointment, 
  NursingNote as ReduxNursingNote 
} from '@/store/slices/nursingSlice';
import type {
  MedicationRecord,
  PositionChangeRecord,
  AppointmentRecord,
  NursingNote
} from '@/features/nursing/types/nursing.types';

// Data transformation adapters
const transformMedicationRecord = (record: ReduxMedicationRecord): MedicationRecord => ({
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

const transformPositionRecord = (record: ReduxPositionChangeRecord): PositionChangeRecord => ({
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

const transformAppointment = (record: ReduxAppointment): AppointmentRecord => ({
  id: record.id,
  seniorId: record.residentId,
  seniorName: record.residentName,
  type: record.type.toLowerCase() as 'hospital' | 'visit' | 'outing' | 'therapy',
  description: record.title,
  scheduledTime: record.scheduledTime,
  status: record.status.toLowerCase() as 'scheduled' | 'completed' | 'cancelled',
  notes: record.notes,
  date: new Date(record.scheduledDate),
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
    appointments,
    nursingNotes,
    selectedResident,
    selectedDate,
    filterType,
    isRecording,
    currentRecord,
    isLoading,
    error,
  } = useAppSelector((state) => state.nursing);

  const selectResident = useCallback((residentId: string | null) => {
    dispatch(setSelectedResident(residentId));
  }, [dispatch]);

  const selectDate = useCallback((date: string) => {
    dispatch(setSelectedDate(date));
  }, [dispatch]);

  const setFilter = useCallback((filter: typeof filterType) => {
    dispatch(setFilterType(filter));
  }, [dispatch]);

  // 기록 추가 함수들
  const addMedication = useCallback((record: Omit<ReduxMedicationRecord, 'id' | 'recordedAt'>) => {
    dispatch(addMedicationRecord({
      ...record,
      recordedBy: currentUser?.name || '익명',
    }));
  }, [dispatch, currentUser]);

  const updateMedication = useCallback((id: string, updates: Partial<ReduxMedicationRecord>) => {
    dispatch(updateMedicationRecord({ id, updates }));
  }, [dispatch]);

  const addPositionChange = useCallback((record: Omit<ReduxPositionChangeRecord, 'id' | 'recordedAt'>) => {
    dispatch(addPositionChangeRecord({
      ...record,
      recordedBy: currentUser?.name || '익명',
    }));
  }, [dispatch, currentUser]);

  const addCare = useCallback((activity: Omit<CareActivity, 'id' | 'recordedAt'>) => {
    dispatch(addCareActivity({
      ...activity,
      recordedBy: currentUser?.name || '익명',
    }));
  }, [dispatch, currentUser]);

  const addNewAppointment = useCallback((appointment: Omit<ReduxAppointment, 'id'>) => {
    dispatch(addAppointment(appointment));
  }, [dispatch]);

  const updateExistingAppointment = useCallback((id: string, updates: Partial<ReduxAppointment>) => {
    dispatch(updateAppointment({ id, updates }));
  }, [dispatch]);

  const addNote = useCallback((note: Omit<ReduxNursingNote, 'id' | 'recordedAt'>) => {
    dispatch(addNursingNote({
      ...note,
      recordedBy: currentUser?.name || '익명',
    }));
  }, [dispatch, currentUser]);

  const startNewRecording = useCallback((type: 'medication' | 'position' | 'care' | 'note', data?: any) => {
    dispatch(startRecording({ type, data }));
  }, [dispatch]);

  const cancelCurrentRecording = useCallback(() => {
    dispatch(cancelRecording());
  }, [dispatch]);

  // 필터링된 데이터
  const getFilteredRecords = useCallback(() => {
    const today = selectedDate;
    
    let filteredMedications = medicationRecords;
    let filteredPositions = positionChangeRecords;
    let filteredCare = careActivities;
    let filteredAppointments = appointments;
    let filteredNotes = nursingNotes;

    if (selectedResident) {
      filteredMedications = filteredMedications.filter(r => r.residentId === selectedResident);
      filteredPositions = filteredPositions.filter(r => r.residentId === selectedResident);
      filteredCare = filteredCare.filter(r => r.residentId === selectedResident);
      filteredAppointments = filteredAppointments.filter(r => r.residentId === selectedResident);
      filteredNotes = filteredNotes.filter(r => r.residentId === selectedResident);
    }

    // 날짜 필터링
    filteredMedications = filteredMedications.filter(r => 
      r.recordedAt.startsWith(today)
    );
    filteredPositions = filteredPositions.filter(r => 
      r.recordedAt.startsWith(today)
    );
    filteredCare = filteredCare.filter(r => 
      r.recordedAt.startsWith(today)
    );
    filteredAppointments = filteredAppointments.filter(r => 
      r.scheduledDate === today
    );
    filteredNotes = filteredNotes.filter(r => 
      r.recordedAt.startsWith(today)
    );

    return {
      medications: filteredMedications.map(transformMedicationRecord),
      positions: filteredPositions.map(transformPositionRecord),
      care: filteredCare,
      appointments: filteredAppointments.map(transformAppointment),
      notes: filteredNotes.map(transformNursingNote),
    };
  }, [
    medicationRecords,
    positionChangeRecords,
    careActivities,
    appointments,
    nursingNotes,
    selectedResident,
    selectedDate,
  ]);

  const filteredRecords = getFilteredRecords();

  // 통계 계산
  const todayMedications = medicationRecords.filter(r => 
    r.recordedAt.startsWith(selectedDate)
  );
  const completedMedications = todayMedications.filter(r => r.status === 'COMPLETED');
  const medicationCompletionRate = todayMedications.length > 0 
    ? Math.round((completedMedications.length / todayMedications.length) * 100) 
    : 0;

  return {
    // 상태
    selectedResident,
    selectedDate,
    filterType,
    isRecording,
    currentRecord,
    isLoading,
    error,

    // 전체 데이터
    allMedicationRecords: medicationRecords,
    allPositionChangeRecords: positionChangeRecords,
    allCareActivities: careActivities,
    allAppointments: appointments,
    allNursingNotes: nursingNotes,

    // 필터링된 데이터
    ...filteredRecords,

    // 통계
    medicationCompletionRate,
    todayRecordsCount: Object.values(filteredRecords).reduce((sum, records) => sum + records.length, 0),

    // 액션들
    selectResident,
    selectDate,
    setFilter,
    addMedication,
    updateMedication,
    addPositionChange,
    addCare,
    addAppointment: addNewAppointment,
    updateAppointment: updateExistingAppointment,
    addNote,
    startRecording: startNewRecording,
    cancelRecording: cancelCurrentRecording,
  };
}