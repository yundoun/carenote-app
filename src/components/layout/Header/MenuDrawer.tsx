'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { systemMenuItems, getIcon, useNavigation } from '@/routes';

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
        <SheetHeader>
          <SheetTitle>케어노트 메뉴</SheetTitle>
          <SheetDescription>
            앱의 주요 기능과 설정에 접근할 수 있습니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
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
      </SheetContent>
    </Sheet>
  );
}
