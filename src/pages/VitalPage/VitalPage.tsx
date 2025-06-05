import { VitalOverview } from '@/features/Vitals/components/inxex';

export function VitalsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">바이탈 모니터링</h1>
      </div>

      <VitalOverview />
    </div>
  );
}
