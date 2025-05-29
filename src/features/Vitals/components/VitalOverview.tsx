import { UrgentAlert } from './UrgentAlert';
import { VitalCard } from './VitalCard';
import type { Senior, VitalSigns } from '../types/vitals.types';

interface VitalOverviewProps {
  seniors: Senior[];
  urgentCases: Senior[];
  isRecording: boolean;
  selectedSenior: Senior | null;
  newVitals: Partial<VitalSigns>;
  onOpenRecord: (senior: Senior) => void;
  onSelectSenior: (senior: Senior) => void;
  onVitalsChange: (vitals: Partial<VitalSigns>) => void;
  onSaveVitals: () => void;
  onRecordingChange: () => void;
}

export const VitalOverview = ({
  seniors,
  urgentCases,
  isRecording,
  selectedSenior,
  newVitals,
  onOpenRecord,
  onSelectSenior,
  onVitalsChange,
  onSaveVitals,
  onRecordingChange,
}: VitalOverviewProps) => {
  return (
    <div className="space-y-4">
      <UrgentAlert urgentCases={urgentCases} onSelectSenior={onSelectSenior} />

      {seniors.map((senior) => (
        <VitalCard
          key={senior.id}
          senior={senior}
          isRecording={isRecording}
          selectedSenior={selectedSenior}
          newVitals={newVitals}
          onOpenRecord={onOpenRecord}
          onSelectSenior={onSelectSenior}
          onVitalsChange={onVitalsChange}
          onSaveVitals={onSaveVitals}
          onRecordingChange={onRecordingChange}
        />
      ))}
    </div>
  );
};
