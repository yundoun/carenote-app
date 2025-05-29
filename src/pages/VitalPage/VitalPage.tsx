import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVitals, useVitalRecord } from '@/features/Vitals/hooks';
import { Senior, VitalsView } from '@/features/Vitals/types/vitals.types';
import {
  VitalHistory,
  VitalOverview,
  VitalSchedule,
} from '@/features/Vitals/components/inxex';

export function VitalsPage() {
  const [activeView, setActiveView] = useState<VitalsView>('overview');

  const { seniors, urgentCases } = useVitals();
  const {
    isRecording,
    selectedSenior,
    newVitals,
    openRecordDialog,
    closeRecordDialog,
    saveVitals,
    updateVitals,
  } = useVitalRecord();

  const handleSelectSenior = (senior: Senior) => {
    // 상세보기 로직 (향후 구현)
    console.log('Selected senior:', senior);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">바이탈 모니터링</h1>
        <div className="text-right text-sm text-gray-500">
          <p>총 {seniors.length}명</p>
          <p className="text-red-600">주의 필요: {urgentCases.length}명</p>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={(value) => setActiveView(value as VitalsView)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="schedule">측정 일정</TabsTrigger>
          <TabsTrigger value="history">측정 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <VitalOverview
            seniors={seniors}
            urgentCases={urgentCases}
            isRecording={isRecording}
            selectedSenior={selectedSenior}
            newVitals={newVitals}
            onOpenRecord={openRecordDialog}
            onSelectSenior={handleSelectSenior}
            onVitalsChange={updateVitals}
            onSaveVitals={saveVitals}
            onRecordingChange={closeRecordDialog}
          />
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <VitalSchedule seniors={seniors} />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <VitalHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
