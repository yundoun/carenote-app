import type React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, FileText, Activity, Home, Users } from 'lucide-react';
import { TabItem } from './TabItem';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/');

  useEffect(() => {
    // Update active tab based on current path
    const pathname = location.pathname;
    if (pathname === '/') setActiveTab('/');
    else if (pathname.includes('/schedule')) setActiveTab('/schedule');
    else if (pathname.includes('/residents')) setActiveTab('/residents');
    else if (pathname.includes('/nursing')) setActiveTab('/nursing');
    else if (pathname.includes('/vitals')) setActiveTab('/vitals');
    else if (pathname.includes('/mypage')) setActiveTab('/mypage');
  }, [location.pathname]);

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
      label: '담당자',
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

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10" style={{ height: '72px' }}>
      <div className="flex justify-around items-center h-full px-1 py-2">
        {navItems.map((item) => (
          <TabItem
            key={item.path}
            label={item.label}
            icon={item.icon}
            path={item.path}
            isActive={activeTab === item.path}
            onClick={() => handleNavigation(item.path)}
          />
        ))}
      </div>
    </nav>
  );
}
