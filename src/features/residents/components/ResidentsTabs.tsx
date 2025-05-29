import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResidentCard } from './ResidentCard';
import { ResidentDetail } from '../types/residents.types';

interface ResidentsTabsProps {
  residents: ResidentDetail[];
  filteredResidents: ResidentDetail[];
  urgentCases: ResidentDetail[];
  todayScheduleCount: number;
  onResidentClick: (resident: ResidentDetail) => void;
}

export function ResidentsTabs({
  residents,
  filteredResidents,
  urgentCases,
  todayScheduleCount,
  onResidentClick,
}: ResidentsTabsProps) {
  const todayScheduleResidents = residents.filter(
    (r) => r.todaySchedule.length > 0
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="all">전체 ({residents.length})</TabsTrigger>
        <TabsTrigger value="today">
          오늘 일정 ({todayScheduleCount})
        </TabsTrigger>
        <TabsTrigger value="urgent">
          주의 필요 ({urgentCases.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0 space-y-4">
        {filteredResidents.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onDetailClick={() => onResidentClick(resident)}
          />
        ))}
      </TabsContent>

      <TabsContent value="today" className="mt-0 space-y-4">
        {todayScheduleResidents.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onDetailClick={() => onResidentClick(resident)}
            showTodaySchedule={true}
          />
        ))}
      </TabsContent>

      <TabsContent value="urgent" className="mt-0 space-y-4">
        {urgentCases.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onDetailClick={() => onResidentClick(resident)}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}
