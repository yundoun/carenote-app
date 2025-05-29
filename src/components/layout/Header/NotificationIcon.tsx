import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationIconProps {
  count: number;
  onClick?: () => void;
}

export function NotificationIcon({ count, onClick }: NotificationIconProps) {
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 relative"
      aria-label={`알림 ${count}개`}
      onClick={onClick}>
      <Bell className="h-6 w-6" />
      {count > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
          variant="destructive">
          {count}
        </Badge>
      )}
    </button>
  );
}
