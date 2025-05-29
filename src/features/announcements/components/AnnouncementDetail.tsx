import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Announcement } from '../types/announcements.types';

interface AnnouncementDetailProps {
  announcement: Announcement;
}

export function AnnouncementDetail({ announcement }: AnnouncementDetailProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200">
          {getTypeLabel(announcement.type)}
        </Badge>
        {announcement.priority === 'high' && (
          <Badge variant="destructive" className="text-xs">
            중요
          </Badge>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {announcement.content}
        </p>
      </div>

      {announcement.attachments && announcement.attachments.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">첨부 파일</h4>
          <div className="space-y-1">
            {announcement.attachments.map((file, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start">
                📎 {file}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <div className="flex justify-between text-sm text-gray-500">
          <span>작성자: {announcement.author}</span>
          <span>
            {announcement.publishedAt.toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
