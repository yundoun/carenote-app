import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setSearchQuery,
  setSelectedResident,
  addRecentNote,
  updateVitalSigns,
  type ResidentDetail,
} from '@/store/slices/residentsSlice';

export function useResidents() {
  const dispatch = useAppDispatch();
  const residentsState = useAppSelector((state) => state.residents);

  const {
    residents,
    filteredResidents,
    urgentCases,
    selectedResident,
    searchQuery,
    isLoading,
    error,
  } = residentsState;

  console.log('🎣 useResidents 훅 - Store 상태:');
  console.log('  - residents:', residents?.length || 0, '명');
  console.log('  - filteredResidents:', filteredResidents?.length || 0, '명');
  console.log('  - urgentCases:', urgentCases?.length || 0, '명');
  console.log('  - isLoading:', isLoading);
  console.log('  - error:', error);
  console.log('  - 전체 state:', residentsState);

  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const selectResident = useCallback(
    (resident: ResidentDetail | null) => {
      dispatch(setSelectedResident(resident));
    },
    [dispatch]
  );

  const addNote = useCallback(
    (residentId: string, note: string) => {
      dispatch(addRecentNote({ residentId, note }));
    },
    [dispatch]
  );

  const updateVitals = useCallback(
    (residentId: string, vitalSigns: ResidentDetail['vitalSigns']) => {
      dispatch(updateVitalSigns({ residentId, vitalSigns }));
    },
    [dispatch]
  );

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
