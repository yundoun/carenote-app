import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSearchQuery, setSelectedResident, addRecentNote, updateVitalSigns } from '@/store/slices/residentsSlice';
import { ResidentDetail } from '../types/residents.types';

export function useResidents() {
  const dispatch = useAppDispatch();
  const {
    residents,
    filteredResidents,
    urgentCases,
    selectedResident,
    searchQuery,
    isLoading,
    error
  } = useAppSelector((state) => state.residents);

  const updateSearchQuery = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const selectResident = useCallback((resident: ResidentDetail | null) => {
    dispatch(setSelectedResident(resident));
  }, [dispatch]);

  const addNote = useCallback((residentId: string, note: string) => {
    dispatch(addRecentNote({ residentId, note }));
  }, [dispatch]);

  const updateVitals = useCallback((residentId: string, vitalSigns: ResidentDetail['vitalSigns']) => {
    dispatch(updateVitalSigns({ residentId, vitalSigns }));
  }, [dispatch]);

  return {
    residents,
    filteredResidents,
    urgentCases,
    selectedResident,
    searchQuery,
    isLoading,
    error,
    setSearchQuery: updateSearchQuery,
    setSelectedResident: selectResident,
    addRecentNote: addNote,
    updateVitalSigns: updateVitals,
  };
}
