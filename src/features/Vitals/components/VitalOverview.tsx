import { UrgentAlert } from './UrgentAlert';
import { VitalCard } from './VitalCard';
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
    isLoading
  } = useVitals();

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
          />
        ))
      )}
    </div>
  );
};
