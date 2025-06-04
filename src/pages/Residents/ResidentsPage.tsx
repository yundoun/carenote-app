import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ResidentSearch,
  UrgentCasesAlert,
  ResidentsTabs,
  ResidentDetailView,
  useResidents,
  ResidentDetail,
} from '@/features/residents';
import { useAppDispatch } from '@/store';
import { fetchResidents } from '@/store/slices/residentsSlice';

export default function ResidentsPage() {
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const dispatch = useAppDispatch();

  const {
    residents,
    filteredResidents,
    urgentCases,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
  } = useResidents();

  // 컴포넌트 마운트 시 주민 데이터 가져오기
  useEffect(() => {
    console.log('🏠 ResidentsPage 마운트됨 - fetchResidents 호출 시작');
    dispatch(fetchResidents());
  }, [dispatch]);

  const handleResidentClick = (resident: any) => {
    setSelectedResident(resident);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">오류: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">환자 관리</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">총 {residents.length}명</p>
          <p className="text-sm text-gray-500">
            주의 필요 {urgentCases.length}명
          </p>
        </div>
      </div>

      <ResidentSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <UrgentCasesAlert
        urgentCases={urgentCases}
        onResidentClick={handleResidentClick}
      />

      <ResidentsTabs
        residents={residents}
        filteredResidents={filteredResidents}
        urgentCases={urgentCases}
        onResidentClick={handleResidentClick}
      />

      {/* Resident Detail Dialog */}
      <Dialog
        open={!!selectedResident}
        onOpenChange={() => setSelectedResident(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedResident?.name} ({selectedResident?.age}세)
            </DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <ResidentDetailView resident={selectedResident} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
