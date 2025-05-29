import { Bell, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Announcement } from '../../types/announcements.types';

interface UrgentAnnouncementsProps {
  urgentAnnouncements: Announcement[];
  onAnnouncementClick: (announcement: Announcement) => void;
}

export function UrgentAnnouncements({
  urgentAnnouncements,
  onAnnouncementClick,
}: UrgentAnnouncementsProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'company':
        return '본사';
      case 'facility':
        return '시설';
      case 'urgent':
        return '긴급';
      case 'education':
        return '교육';
      default:
        return '일반';
    }
  };

  if (urgentAnnouncements.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Bell className="h-5 w-5" />
          긴급 공지
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {urgentAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onAnnouncementClick(announcement)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-red-800">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-200">
                      {getTypeLabel(announcement.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {announcement.author}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
