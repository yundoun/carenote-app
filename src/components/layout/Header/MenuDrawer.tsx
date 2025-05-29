'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  quickAccessMenuItems,
  systemMenuItems,
  getIcon,
  useNavigation,
} from '@/routes';

interface MenuDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuDrawer({ isOpen, onOpenChange }: MenuDrawerProps) {
  const { navigateTo } = useNavigation();

  const handleMenuClick = (path: string) => {
    navigateTo(path);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="메뉴 열기">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="py-6">
          <h2 className="text-xl font-bold mb-6">케어노트 메뉴</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              빠른 접근
            </h3>
            <nav className="space-y-2">
              {quickAccessMenuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item.path)}>
                  {getIcon(item.iconName)}
                  <span className="ml-3">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>

          <div className="border-t pt-4">
            <nav className="space-y-2">
              {systemMenuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item.path)}>
                  {getIcon(item.iconName)}
                  <span className="ml-3">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
