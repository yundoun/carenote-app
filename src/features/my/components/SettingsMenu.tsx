import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MenuItem } from '../types/my.types';

interface SettingsMenuProps {
  menuItems: MenuItem[];
  onMenuClick?: (item: MenuItem) => void;
}

export function SettingsMenu({ menuItems, onMenuClick }: SettingsMenuProps) {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          {menuItems.map((item, index) => (
            <div key={index}>
              {index > 0 && <Separator />}
              <button
                onClick={() => onMenuClick?.(item)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 w-full text-left">
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
