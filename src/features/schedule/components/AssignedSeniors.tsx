import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Senior } from '../../types/schedule.types';

interface AssignedSeniorsProps {
  seniors: Senior[];
}

export const AssignedSeniors = ({ seniors }: AssignedSeniorsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          담당 어르신 ({seniors.length}명)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {seniors.map((senior) => (
            <div
              key={senior.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {senior.name} ({senior.age}세)
                </p>
                <p className="text-sm text-gray-500">
                  {senior.room}호 | {senior.careLevel} |{' '}
                  {senior.conditions.join(', ')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                상세보기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
