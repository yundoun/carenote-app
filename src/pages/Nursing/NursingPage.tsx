import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MedicationRecords,
  PositionChange,
  NursingNotes,
  AddRecordForm,
} from '@/features/nursing';
import { useNursing } from '@/features/nursing/hooks/useNursing';

export default function NursingPage() {
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const {
    medicationRecords: medications,
    positionChangeRecords: positions,
    nursingNotes: notes,
    isLoading,
    addNursingNote,
    addMedicationRecord,
    addPositionChangeRecord,
    residents,
  } = useNursing();

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
              <DialogDescription>
                새로운 간호 기록, 복약 기록 또는 체위 변경 기록을 추가합니다.
              </DialogDescription>
            </DialogHeader>
            <AddRecordForm
              onSave={() => setIsAddingRecord(false)}
              addNursingNote={addNursingNote}
              addMedicationRecord={addMedicationRecord}
              addPositionChangeRecord={addPositionChangeRecord}
              isLoading={isLoading}
              residents={residents}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="notes">간호 기록</TabsTrigger>
          <TabsTrigger value="medication">복약 기록</TabsTrigger>
          <TabsTrigger value="position">체위 변경</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-0 space-y-4">
          <NursingNotes notes={notes} />
        </TabsContent>

        <TabsContent value="medication" className="mt-0 space-y-4">
          <MedicationRecords records={medications} />
        </TabsContent>

        <TabsContent value="position" className="mt-0 space-y-4">
          <PositionChange records={positions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
