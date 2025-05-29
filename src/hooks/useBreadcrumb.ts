import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export function useBreadcrumb() {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathname = location.pathname;
    
    // 메인 페이지들은 브레드크럼 없음
    const mainPages = ['/', '/schedule', '/residents', '/nursing', '/vitals'];
    if (mainPages.includes(pathname)) {
      return [];
    }
    
    // 서브 페이지들의 브레드크럼
    const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
      '/education': [
        { label: '홈', path: '/' },
        { label: '교육자료', path: '/education' }
      ],
      '/announcements': [
        { label: '홈', path: '/' },
        { label: '공지사항', path: '/announcements' }
      ],
      '/settings': [
        { label: '홈', path: '/' },
        { label: '설정', path: '/settings' }
      ],
      '/mypage': [
        { label: '홈', path: '/' },
        { label: '마이페이지', path: '/mypage' }
      ],
      '/residents': [
        { label: '홈', path: '/' },
        { label: '환자관리', path: '/residents' }
      ]
    };
    
    return breadcrumbMap[pathname] || [
      { label: '홈', path: '/' },
      { label: '페이지', path: pathname }
    ];
  };
  
  const breadcrumbs = getBreadcrumbs();
  const showBackButton = breadcrumbs.length > 0;
  const currentPageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : '';
  
  return {
    breadcrumbs,
    showBackButton,
    currentPageTitle
  };
}