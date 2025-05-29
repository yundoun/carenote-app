import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, ArrowLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserInfo } from './UserInfo';
import { NotificationIcon } from './NotificationIcon';
import { MenuDrawer } from './MenuDrawer';
import { ROUTES } from '@/routes/routes';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';

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
  const { breadcrumbs, showBackButton, currentPageTitle } = useBreadcrumb();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          {showBackButton ? (
            <>
              {/* 서브 페이지 헤더 */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto mr-2 flex-shrink-0"
                onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center min-w-0 flex-1">
                <nav className="flex items-center space-x-1 min-w-0">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center">
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {crumb.label}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(crumb.path)}
                            className="text-sm text-gray-500 hover:text-gray-700 truncate">
                            {crumb.label}
                          </button>
                          <ChevronRight className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
                        </>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </>
          ) : (
            <>
              {/* 메인 페이지 헤더 */}
              <MenuDrawer isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
              <UserInfo name={staffName} role={staffRole} floor={floor} />
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <NotificationIcon
            count={notificationCount}
            onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
          />
        </div>
      </div>
    </header>
  );
}
