import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/routes';
import type { UrgentAnnouncement } from '../types/home.types';

interface UrgentAnnouncementAlertProps {
  announcements: UrgentAnnouncement[];
  urgentAlerts?: any[];
  markAlertRead?: (alertId: string) => void;
}

export function UrgentAnnouncementAlert({ announcements, urgentAlerts = [], markAlertRead }: UrgentAnnouncementAlertProps) {
  const navigate = useNavigate();

  // API 데이터가 있으면 우선 사용, 없으면 props 사용
  const alertsToShow = urgentAlerts.length > 0 ? urgentAlerts : announcements;

  if (!alertsToShow || alertsToShow.length === 0) {
    return null;
  }

  const firstAlert = alertsToShow[0];
  const isApiAlert = 'type' in firstAlert;

  const handleDismiss = () => {
    if (isApiAlert) {
      markAlertRead?.(firstAlert.id);
    }
  };

  const getAlertColor = (type?: string) => {
    switch (type) {
      case 'emergency':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'vital':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'medication':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-red-200 bg-red-50 text-red-800';
    }
  };

  const getIconColor = (type?: string) => {
    switch (type) {
      case 'emergency':
        return 'text-red-500';
      case 'vital':
        return 'text-orange-500';
      case 'medication':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <Card className={isApiAlert ? getAlertColor(firstAlert.type) : 'border-red-200 bg-red-50'}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
            isApiAlert ? getIconColor(firstAlert.type) : 'text-red-500'
          }`} />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {isApiAlert ? `${firstAlert.type === 'emergency' ? '긴급' : '알림'}` : '긴급 공지'}
                </h3>
                <p className="text-sm mt-1">{firstAlert.title}</p>
                {isApiAlert && firstAlert.content && (
                  <p className="text-xs mt-1 opacity-75">{firstAlert.content}</p>
                )}
              </div>
              {isApiAlert && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-opacity-50 hover:bg-opacity-20"
                onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
              >
                자세히 보기
              </Button>
              {urgentAlerts.length > 1 && (
                <span className="text-xs opacity-75 self-center">
                  외 {urgentAlerts.length - 1}건
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}