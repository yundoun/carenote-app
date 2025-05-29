import type React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, FileText, Activity } from 'lucide-react';
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
    if (pathname === '/' || pathname.includes('/schedule'))
      setActiveTab('/schedule');
    else if (pathname.includes('/vitals')) setActiveTab('/vitals');
    else if (pathname.includes('/nursing')) setActiveTab('/nursing');
    else if (pathname.includes('/mypage')) setActiveTab('/mypage');
  }, [location.pathname]);

  const navItems: NavItem[] = [
    {
      label: '근무표',
      icon: <Calendar className="h-6 w-6" />,
      path: '/schedule',
    },
    {
      label: '바이탈',
      icon: <Activity className="h-6 w-6" />,
      path: '/vitals',
    },
    {
      label: '간호기록',
      icon: <FileText className="h-6 w-6" />,
      path: '/nursing',
    },
    {
      label: '마이페이지',
      icon: <User className="h-6 w-6" />,
      path: '/mypage',
    },
  ];

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16 px-2 py-2">
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
