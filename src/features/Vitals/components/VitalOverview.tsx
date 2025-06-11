import { UrgentAlert } from './UrgentAlert';
import { VitalCard } from './VitalCard';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { useVitals } from '../hooks/useVitals';

export const VitalOverview = () => {
  const { 
    seniors, 
    urgentCases, 
    selectSenior,
    isRecording,
    selectedSenior,
    newVitals,
    startVitalRecording,
    updateVitalsInput,
    saveVitals,
    cancelVitalRecording,
    isLoading,
    fetchVitalHistory
  } = useVitals();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">바이탈 데이터를 불러오는 중...</p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-right text-sm text-gray-500">
          <p>총 {seniors.length}명</p>
          <p className="text-red-600">주의 필요: {urgentCases.length}명</p>
        </div>
      </div>

      <UrgentAlert urgentCases={urgentCases} onSelectSenior={selectSenior} />

      {seniors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">거주자 데이터를 불러오는 중...</p>
        </div>
      ) : (
        seniors.map((senior) => (
          <VitalCard
            key={senior.id}
            senior={senior}
            isRecording={isRecording}
            selectedSenior={selectedSenior}
            newVitals={newVitals}
            startVitalRecording={startVitalRecording}
            selectSenior={selectSenior}
            updateVitalsInput={updateVitalsInput}
            saveVitals={saveVitals}
            cancelVitalRecording={cancelVitalRecording}
            isLoading={isLoading}
            fetchVitalHistory={fetchVitalHistory}
          />
        ))
      )}
    </div>
  );
};
