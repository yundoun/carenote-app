import { useState } from 'react';
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

export default function ResidentsPage() {
  const [selectedResident, setSelectedResident] =
    useState<ResidentDetail | null>(null);

  const {
    residents,
    filteredResidents,
    urgentCases,
    searchQuery,
    setSearchQuery,
  } = useResidents();

  const handleResidentClick = (resident: ResidentDetail) => {
    setSelectedResident(resident);
  };

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
