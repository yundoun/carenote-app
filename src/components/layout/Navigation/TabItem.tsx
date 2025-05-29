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
        'flex flex-col items-center justify-center w-full h-full transition-all duration-200 rounded-lg mx-1',
        isActive
          ? 'text-white bg-primary shadow-md transform scale-105'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      )}
      aria-current={isActive ? 'page' : undefined}>
      <div className="flex flex-col items-center">
        {icon}
        <span
          className={cn(
            'text-xs mt-1 font-medium',
            isActive ? 'font-bold' : 'font-medium'
          )}>
          {label}
        </span>
      </div>
    </button>
  );
}
