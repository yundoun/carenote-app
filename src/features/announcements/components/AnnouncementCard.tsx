import {
  Building,
  Users,
  Bell,
  Star,
  Megaphone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Announcement } from '../types/announcements.types';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick: () => void;
}

export function AnnouncementCard({
  announcement,
  onClick,
}: AnnouncementCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building className="h-4 w-4" />;
      case 'facility':
        return <Users className="h-4 w-4" />;
      case 'urgent':
        return <Bell className="h-4 w-4" />;
      case 'education':
        return <Star className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(announcement.type)}
              <Badge
                variant="outline"
                className={getPriorityColor(announcement.priority)}>
                {getTypeLabel(announcement.type)}
              </Badge>
              {announcement.priority === 'high' && (
                <Badge variant="destructive" className="text-xs">
                  중요
                </Badge>
              )}
            </div>
            <h3 className="font-medium mb-1">{announcement.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {announcement.content}
            </p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">
                {announcement.author}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {announcement.publishedAt.toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}
