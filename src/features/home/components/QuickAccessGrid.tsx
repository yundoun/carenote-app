import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QuickAccessItem } from '../types/home.types';

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  const navigate = useNavigate();

  const handleQuickAccess = (path: string) => {
    navigate(path);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">빠른 접근</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 md:h-16 lg:h-20 flex-col gap-2 hover:bg-gray-50"
              onClick={() => handleQuickAccess(item.path)}
            >
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-center leading-tight">{item.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}