import {
  Users,
  PlayCircle,
  Bell,
  Calendar,
  Heart,
  Stethoscope,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from 'lucide-react';

// 아이콘 매핑 객체
const iconMap = {
  Users,
  PlayCircle,
  Bell,
  Calendar,
  Heart,
  Stethoscope,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} as const;

// 아이콘 이름 타입
export type IconName = keyof typeof iconMap;

// 아이콘 이름으로 아이콘 컴포넌트를 가져오는 함수
export function getIcon(iconName: IconName, className = 'h-5 w-5') {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
}
