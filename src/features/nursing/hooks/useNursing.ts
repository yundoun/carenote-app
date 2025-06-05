import { useCallback, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setSelectedResident,
  setSelectedDate,
  setFilterType,
  clearError,
  fetchTodayNursingRecords,
  fetchResidentNursingRecords,
  createNewMedicationRecord,
  createNewPositionChangeRecord,
  createNewNursingNote,
} from '@/store/slices/nursingSlice';
import type {
  MedicationRecord as ReduxMedicationRecord,
  PositionChangeRecord as ReduxPositionChangeRecord,
  NursingNote as ReduxNursingNote,
} from '@/store/slices/nursingSlice';
import type {
  MedicationRecord,
  PositionChangeRecord,
  NursingNote,
} from '@/features/nursing/types/nursing.types';

// Data transformation adapters
const transformMedicationRecordToUiType = (
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

const transformPositionRecordToUiType = (
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

const transformNursingNoteToUiType = (
  record: ReduxNursingNote
): NursingNote => ({
  id: record.id,
  seniorId: record.residentId,
  seniorName: record.residentName,
  category: record.noteType as any,
  title: record.title,
  content: record.content,
  priority: record.priority,
  recordedBy: record.recordedBy,
  timestamp: new Date(record.recordedAt),
});

export function useNursing() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const nursingState = useAppSelector((state) => state.nursing);
  const {
    medicationRecords: reduxMedicationRecords,
    positionChangeRecords: reduxPositionChangeRecords,
    nursingNotes: reduxNursingNotes,
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
    totalNursingNotes,
  } = nursingState;

  const caregiverId = useMemo(() => {
    return currentUser?.id || 'anonymous_caregiver';
  }, [currentUser?.id]);

  useEffect(() => {
    if (selectedResident) {
      dispatch(
        fetchResidentNursingRecords({
          residentId: selectedResident,
          startDate: selectedDate,
          endDate: selectedDate,
        })
      );
    } else {
      dispatch(fetchTodayNursingRecords({ caregiverId, date: selectedDate }));
    }
  }, [dispatch, caregiverId, selectedResident, selectedDate]);

  const medicationRecords = useMemo(
    () => reduxMedicationRecords.map(transformMedicationRecordToUiType),
    [reduxMedicationRecords]
  );
  const positionChangeRecords = useMemo(
    () => reduxPositionChangeRecords.map(transformPositionRecordToUiType),
    [reduxPositionChangeRecords]
  );
  const nursingNotes = useMemo(
    () => reduxNursingNotes.map(transformNursingNoteToUiType),
    [reduxNursingNotes]
  );

  const dispatchCreateNewMedicationRecord = useCallback(
    async (
      recordPayload: Omit<
        ReduxMedicationRecord,
        'id' | 'recordedAt' | 'residentName' | 'recordedBy'
      > & { residentId: string }
    ) => {
      return dispatch(
        createNewMedicationRecord({
          resident_id: recordPayload.residentId,
          caregiver_id: caregiverId,
          medication_name: recordPayload.medicationName,
          dosage: recordPayload.dosage,
          scheduled_time: recordPayload.scheduledTime,
          actual_time: recordPayload.actualTime,
          status: recordPayload.status,
          notes: recordPayload.notes,
        })
      ).unwrap();
    },
    [dispatch, caregiverId]
  );

  const dispatchCreateNewPositionChangeRecord = useCallback(
    async (
      recordPayload: Omit<
        ReduxPositionChangeRecord,
        'id' | 'recordedAt' | 'residentName' | 'recordedBy'
      > & { residentId: string }
    ) => {
      return dispatch(
        createNewPositionChangeRecord({
          resident_id: recordPayload.residentId,
          caregiver_id: caregiverId,
          change_time: recordPayload.changeTime,
          from_position: recordPayload.fromPosition,
          to_position: recordPayload.toPosition,
          skin_condition: recordPayload.skinCondition,
          notes: recordPayload.notes,
        })
      ).unwrap();
    },
    [dispatch, caregiverId]
  );

  const dispatchCreateNewNursingNote = useCallback(
    async (
      notePayload: Omit<
        ReduxNursingNote,
        | 'id'
        | 'recordedAt'
        | 'residentName'
        | 'recordedBy'
        | 'tags'
        | 'attachments'
      > & { residentId: string }
    ) => {
      return dispatch(
        createNewNursingNote({
          resident_id: notePayload.residentId,
          caregiver_id: caregiverId,
          note_type: notePayload.noteType,
          title: notePayload.title,
          content: notePayload.content,
          priority: notePayload.priority,
        })
      ).unwrap();
    },
    [dispatch, caregiverId]
  );

  const selectResidentCb = useCallback(
    (residentId: string | null) => {
      dispatch(setSelectedResident(residentId));
    },
    [dispatch]
  );

  const selectDateCb = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
    },
    [dispatch]
  );

  const setFilterCb = useCallback(
    (filter: typeof filterType) => {
      dispatch(setFilterType(filter));
    },
    [dispatch]
  );

  const clearErrorCb = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    medicationRecords,
    positionChangeRecords,
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
    totalNursingNotes,
    addMedicationRecord: dispatchCreateNewMedicationRecord,
    addPositionChangeRecord: dispatchCreateNewPositionChangeRecord,
    addNursingNote: dispatchCreateNewNursingNote,
    selectResident: selectResidentCb,
    selectDate: selectDateCb,
    setFilter: setFilterCb,
    clearError: clearErrorCb,
  };
}
