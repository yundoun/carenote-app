import { Clock, MapPin, Users, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { TodayShift } from '../../types/schedule.types';

interface TodayShiftOverviewProps {
  shift: TodayShift;
}

export const TodayShiftOverview = ({ shift }: TodayShiftOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          오늘의 근무 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">근무 시간</p>
            <p className="text-lg font-semibold">
              {shift.startTime} - {shift.endTime} ({shift.shiftType})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">근무 위치</p>
            <p className="text-lg font-semibold flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {shift.location.floor} {shift.location.unit}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">담당 병실</p>
            <p className="text-lg font-semibold">
              {shift.location.rooms.length}개 병실 (
              {shift.location.rooms.join(', ')})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">담당 어르신</p>
            <p className="text-lg font-semibold flex items-center gap-1">
              <Users className="h-4 w-4" />
              {shift.assignedSeniors.length}명
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4">
              <Building className="h-4 w-4 mr-2" />
              근무지 상세정보 보기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>근무지 상세정보</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">위치 정보</h4>
                <p>• 층수: {shift.location.floor}</p>
                <p>• 유닛: {shift.location.unit}</p>
                <p>• 전체 병실: {shift.location.totalRooms}개</p>
                <p>• 담당 병실: {shift.location.rooms.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">시설 정보</h4>
                <p>• 간호사실: 3층 중앙</p>
                <p>• 응급실: 1층</p>
                <p>• 물리치료실: 2층</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
