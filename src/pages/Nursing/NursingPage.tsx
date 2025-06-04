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
  NursingNotes,
  AddRecordForm,
  useNursingRecords,
} from '@/features/nursing';

export default function NursingPage() {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const { medications, positions, notes, isLoading } = useNursingRecords();

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
