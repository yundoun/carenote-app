import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { UserInfo } from './UserInfo';
import { NotificationIcon } from './NotificationIcon';
import { MenuDrawer } from './MenuDrawer';

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

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MenuDrawer isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
          <UserInfo name={staffName} role={staffRole} floor={floor} />
        </div>

        <NotificationIcon count={notificationCount} />
      </div>
    </header>
  );
}
