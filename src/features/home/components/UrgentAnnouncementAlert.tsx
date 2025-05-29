import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/routes';
import type { UrgentAnnouncement } from '../types/home.types';

interface UrgentAnnouncementAlertProps {
  announcements: UrgentAnnouncement[];
}

export function UrgentAnnouncementAlert({ announcements }: UrgentAnnouncementAlertProps) {
  const navigate = useNavigate();

  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 text-sm">긴급 공지</h3>
            <p className="text-red-700 text-sm mt-1">{announcements[0].title}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
              onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
            >
              자세히 보기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}