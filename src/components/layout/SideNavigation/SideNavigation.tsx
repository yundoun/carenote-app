import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, FileText, Activity, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/routes';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export function SideNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: '홈',
      icon: <Home className="h-5 w-5" />,
      path: '/',
    },
    {
      label: '근무표',
      icon: <Calendar className="h-5 w-5" />,
      path: '/schedule',
    },
    {
      label: '환자관리',
      icon: <Users className="h-5 w-5" />,
      path: '/residents',
    },
    {
      label: '간호기록',
      icon: <FileText className="h-5 w-5" />,
      path: '/nursing',
    },
    {
      label: '바이탈',
      icon: <Activity className="h-5 w-5" />,
      path: '/vitals',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200 md:z-30">
      <div className="flex flex-col flex-grow pt-20 pb-4 overflow-y-auto">
        <div className="px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">케어노트</h2>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200',
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}>
              <span
                className={cn(
                  'mr-3 flex-shrink-0',
                  isActive(item.path)
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
