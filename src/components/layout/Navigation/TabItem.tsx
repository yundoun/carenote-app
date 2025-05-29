import type React from 'react';
import { cn } from '@/lib/utils';

interface TabItemProps {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabItem({ label, icon, isActive, onClick }: TabItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center w-full h-16 transition-all duration-200 rounded-lg mx-0.5 min-w-0 px-1',
        isActive
          ? 'text-white bg-primary shadow-md'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100'
      )}
      aria-current={isActive ? 'page' : undefined}>
      <div className="flex flex-col items-center gap-1">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <span
          className={cn(
            'text-xs leading-tight text-center',
            isActive ? 'font-semibold' : 'font-medium'
          )}>
          {label}
        </span>
      </div>
    </button>
  );
}
