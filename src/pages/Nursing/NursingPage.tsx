import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MedicationRecords,
  PositionChange,
  AppointmentSchedule,
  NursingNotes,
  AddRecordForm,
  useNursingRecords,
} from '@/features/nursing';

export default function NursingPage() {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const {
    medicationRecords,
    positionChangeRecords,
    appointmentRecords,
    nursingNotes,
    isLoading,
  } = useNursingRecords();

  if (isLoading) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">간호 기록</h1>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              기록 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 기록 추가</DialogTitle>
            </DialogHeader>
            <AddRecordForm onSave={() => setIsAddingRecord(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="medication" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="medication">복약 기록</TabsTrigger>
          <TabsTrigger value="position">체위 변경</TabsTrigger>
          <TabsTrigger value="schedule">일정 관리</TabsTrigger>
          <TabsTrigger value="notes">간호 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="medication" className="mt-0 space-y-4">
          <MedicationRecords records={medicationRecords} />
        </TabsContent>

        <TabsContent value="position" className="mt-0 space-y-4">
          <PositionChange records={positionChangeRecords} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-0 space-y-4">
          <AppointmentSchedule records={appointmentRecords} />
        </TabsContent>

        <TabsContent value="notes" className="mt-0 space-y-4">
          <NursingNotes notes={nursingNotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
