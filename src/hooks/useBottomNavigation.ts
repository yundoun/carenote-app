import { useLocation } from 'react-router-dom';

// 하단 네비게이션을 표시할 페이지들
const BOTTOM_NAV_ROUTES = [
  '/',
  '/schedule',
  '/residents',
  '/nursing',
  '/vitals'
];

export function useBottomNavigation() {
  const location = useLocation();
  
  const shouldShowBottomNav = BOTTOM_NAV_ROUTES.some(route => {
    if (route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route);
  });

  return { shouldShowBottomNav };
}