import { type IconName } from './iconUtils';

// 라우트 경로 상수 정의
export const ROUTES = {
  HOME: '/',
  SCHEDULE: '/schedule',
  VITALS: '/vitals',
  NURSING: '/nursing',
  MYPAGE: '/mypage',
  RESIDENTS: '/residents',
  EDUCATION: '/education',
  ANNOUNCEMENTS: '/announcements',
  SETTINGS: '/settings',
  HELP: '/help',
  LOGOUT: '/logout',
} as const;

// 메뉴 아이템 타입 정의
export interface MenuItem {
  iconName: IconName;
  label: string;
  path: string;
  description?: string;
}

// 빠른 접근 메뉴 아이템들
export const quickAccessMenuItems: MenuItem[] = [
  {
    iconName: 'Users',
    label: '담당자 정보',
    path: ROUTES.RESIDENTS,
    description: '담당 환자 정보 조회',
  },
  {
    iconName: 'PlayCircle',
    label: '교육자료',
    path: ROUTES.EDUCATION,
    description: '간병 교육 자료',
  },
  {
    iconName: 'Bell',
    label: '공지사항',
    path: ROUTES.ANNOUNCEMENTS,
    description: '중요 공지 및 알림',
  },
];

// 시스템 메뉴 아이템들
export const systemMenuItems: MenuItem[] = [
  {
    iconName: 'Settings',
    label: '설정',
    path: ROUTES.SETTINGS,
    description: '앱 설정 관리',
  },
  {
    iconName: 'HelpCircle',
    label: '도움말',
    path: ROUTES.HELP,
    description: '사용법 안내',
  },
  {
    iconName: 'LogOut',
    label: '로그아웃',
    path: ROUTES.LOGOUT,
    description: '앱 종료',
  },
];

// 하단 네비게이션 메뉴 아이템들
export const bottomNavMenuItems: MenuItem[] = [
  {
    iconName: 'Calendar',
    label: '일정관리',
    path: ROUTES.SCHEDULE,
    description: '업무 일정 관리',
  },
  {
    iconName: 'Heart',
    label: '바이탈',
    path: ROUTES.VITALS,
    description: '생체징후 측정',
  },
  {
    iconName: 'Stethoscope',
    label: '간병기록',
    path: ROUTES.NURSING,
    description: '간병 기록 작성',
  },
  {
    iconName: 'User',
    label: '마이페이지',
    path: ROUTES.MYPAGE,
    description: '개인 정보 관리',
  },
];
