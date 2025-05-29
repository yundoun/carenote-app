import { Card, CardContent } from '@/components/ui/card';

interface UserProfileCardProps {
  name: string;
  role: string;
  floor: string;
}

export function UserProfileCard({ name, role, floor }: UserProfileCardProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{name}님, 안녕하세요!</h2>
            <p className="text-blue-100 text-sm">오늘도 좋은 하루 되세요</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-100">{floor} 담당</p>
            <p className="text-xs text-blue-100">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}