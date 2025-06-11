import { Users } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResidentDetailDialog } from '@/features/residents/components/ResidentDetailDialog';
import { useAppSelector } from '@/store';
import type { Senior } from '../../types/schedule.types';
import type { ResidentDetail } from '@/features/residents/types/residents.types';

interface AssignedSeniorsProps {
  seniors: Senior[];
}

export const AssignedSeniors = ({ seniors }: AssignedSeniorsProps) => {
  const [selectedSenior, setSelectedSenior] = useState<ResidentDetail | null>(null);
  const residents = useAppSelector((state) => state.residents.residents);

  const handleSeniorClick = (senior: Senior) => {
    // Redux store에서 해당 ID의 실제 환자 데이터 찾기
    const residentDetail = residents.find(resident => resident.id === senior.id);
    if (residentDetail) {
      setSelectedSenior(residentDetail);
    } else {
      // Redux store에 데이터가 없으면 Senior 데이터로 임시 변환
      setSelectedSenior({
        id: senior.id,
        name: senior.name,
        age: senior.age,
        gender: 'male',
        room: senior.room,
        conditions: senior.conditions,
        careLevel: senior.careLevel,
        emergencyContact: '010-0000-0000',
        todaySchedule: [
          '09:00 - 아침식사',
          '10:30 - 약물복용',
          '14:00 - 점심식사',
          '15:30 - 재활운동',
          '18:00 - 저녁식사'
        ],
        recentNotes: [
          '혈압 측정 완료 (정상)',
          '식사량 양호',
          '컨디션 양호'
        ],
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: '72',
          temperature: '36.5°C',
          lastChecked: '2시간 전'
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          담당 어르신 ({seniors.length}명)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {seniors.map((senior) => (
            <div
              key={senior.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {senior.name} ({senior.age}세)
                </p>
                <p className="text-sm text-gray-500">
                  {senior.room}호 | {senior.careLevel} |{' '}
                  {senior.conditions.join(', ')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSeniorClick(senior)}>
                상세보기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>

      <ResidentDetailDialog
        resident={selectedSenior}
        open={!!selectedSenior}
        onOpenChange={() => setSelectedSenior(null)}
      />
    </Card>
  );
};
