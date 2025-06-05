import { Card, CardContent } from '@/components/ui/card';
import { useHomeData } from '../hooks/useHomeData';

interface UserProfileCardProps {
  name: string;
  role: string;
  floor: string;
}

export function UserProfileCard({ name, role, floor }: UserProfileCardProps) {
  const { welcomeData } = useHomeData();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {welcomeData?.welcomeMessage || `${name}님, 안녕하세요!`}
            </h2>
            <p className="text-blue-100 text-sm">
              {welcomeData?.motivationMessage || '오늘도 좋은 하루 되세요'}
            </p>
            {welcomeData && (
              <div className="mt-2 flex gap-4 text-xs text-blue-100">
                <span>담당 입주자: {welcomeData.assignedResidents}명</span>
                <span>대기 업무: {welcomeData.pendingTasks}건</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-100">
              {welcomeData?.shiftInfo.unit || floor} 담당
            </p>
            <p className="text-xs text-blue-100">{role}</p>
            {welcomeData && (
              <p className="text-xs text-blue-100 mt-1">
                {welcomeData.shiftInfo.startTime} ~ {welcomeData.shiftInfo.endTime}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}