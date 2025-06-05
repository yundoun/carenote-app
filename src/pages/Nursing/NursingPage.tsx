import { useState, useMemo, useEffect } from 'react';
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
import { useResidents } from '@/features/residents/hooks/useResidents';
import { useAppDispatch } from '@/store';
import { fetchResidents } from '@/store/slices/residentsSlice';

export default function NursingPage() {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const dispatch = useAppDispatch();

  // useNursing 훅에서 반환하는 실제 함수명으로 구조 분해 할당합니다.
  // useNursing.ts에서 addNursingNote, addMedicationRecord, addPositionChangeRecord 이름으로 반환하도록 설정했습니다.
  const {
    medicationRecords: medications, // UI 타입으로 변환된 데이터
    positionChangeRecords: positions, // UI 타입으로 변환된 데이터
    nursingNotes: notes, // UI 타입으로 변환된 데이터
    isLoading: isNursingLoading,
    addNursingNote,
    addMedicationRecord,
    addPositionChangeRecord,
    // selectResident, selectDate 등 다른 필요한 함수들도 가져올 수 있습니다.
  } = useNursing();

  const { residents, isLoading: isResidentsLoading } = useResidents();

  const pageIsLoading = isNursingLoading || isResidentsLoading;

  // 컴포넌트 마운트 시 환자 데이터 가져오기
  useEffect(() => {
    console.log('🏥 NursingPage 마운트됨 - fetchResidents 호출 시작');
    if (residents.length === 0) {
      dispatch(fetchResidents());
    }
  }, [dispatch, residents.length]);

  // 이전에 dispatch 오류를 유발했던 handleAdd... 헬퍼 함수들은 제거합니다.
  // useNursing에서 반환된 함수를 직접 AddRecordForm에 전달합니다.

  if (pageIsLoading) {
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
              // useNursing에서 가져온 함수들을 AddRecordFormProps에 정의된 이름으로 전달합니다.
              addNursingNote={addNursingNote}
              addMedicationRecord={addMedicationRecord}
              addPositionChangeRecord={addPositionChangeRecord}
              isLoading={isNursingLoading} // 기록 저장 시의 로딩 상태
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
