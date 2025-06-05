import { UrgentAlert } from './UrgentAlert';
import { VitalCard } from './VitalCard';
import { useVitals } from '../hooks/useVitals';

export const VitalOverview = () => {
  const { seniors, urgentCases, selectSenior } = useVitals();

  return (
    <div className="space-y-4">
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
          />
        ))
      )}
    </div>
  );
};
