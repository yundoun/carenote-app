import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserInfo } from './UserInfo';
import { NotificationIcon } from './NotificationIcon';
import { MenuDrawer } from './MenuDrawer';
import { ROUTES } from '@/routes/routes';

interface HeaderProps {
  staffName: string;
  staffRole: string;
  floor: string;
  notificationCount?: number;
}

export function Header({
  staffName,
  staffRole,
  floor,
  notificationCount = 0,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MenuDrawer isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
          <UserInfo name={staffName} role={staffRole} floor={floor} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto"
            onClick={() => navigate(ROUTES.MYPAGE)}
          >
            <User className="h-5 w-5" />
          </Button>
          <NotificationIcon count={notificationCount} />
        </div>
      </div>
    </header>
  );
}
